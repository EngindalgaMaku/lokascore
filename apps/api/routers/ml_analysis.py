from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from ..db import get_db
from ..models import Analysis, MLModel, Business, BusinessReview, BusinessType
from ..services.ml_pipeline import scoring_model, sentiment_analyzer, feature_engineer

router = APIRouter(prefix="/ml", tags=["AI & Machine Learning"])

class LocationAnalysisRequest(BaseModel):
    lat: float
    lng: float
    business_type: str
    radius: int = 500
    analysis_name: Optional[str] = None

class LocationAnalysisResponse(BaseModel):
    analysis_id: int
    overall_score: float
    confidence: float
    component_scores: Dict[str, float]
    insights: Dict[str, List[str]]
    feature_importance: Dict[str, float]
    processing_time_ms: Optional[int]

class ModelTrainingRequest(BaseModel):
    business_type: str
    region_id: Optional[int] = None
    model_name: Optional[str] = None

class ModelTrainingResponse(BaseModel):
    success: bool
    model_id: Optional[int]
    model_type: str
    r2_score: float
    training_samples: int
    feature_count: int
    error: Optional[str] = None

class SentimentAnalysisResponse(BaseModel):
    business_id: int
    avg_sentiment: float
    sentiment_distribution: Dict[str, int]
    total_reviews_analyzed: int
    top_topics: Dict[str, int]
    sentiment_score: float

@router.post("/analyze-location", response_model=LocationAnalysisResponse)
async def analyze_location_with_ai(
    request: LocationAnalysisRequest,
    db: Session = Depends(get_db)
):
    """
    🤖 AI-powered location analysis
    
    Uses machine learning models and comprehensive feature engineering to score location potential.
    Includes competition analysis, demographic insights, and environmental factors.
    """
    
    start_time = datetime.now()
    
    try:
        # Validate business type
        try:
            business_type_enum = BusinessType(request.business_type)
        except ValueError:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid business type: {request.business_type}"
            )
        
        # Run AI analysis
        result = scoring_model.predict_location_score(
            lat=request.lat,
            lng=request.lng,
            business_type=request.business_type
        )
        
        processing_time = int((datetime.now() - start_time).total_seconds() * 1000)
        
        return LocationAnalysisResponse(
            analysis_id=result['analysis_id'],
            overall_score=result['overall_score'],
            confidence=result['confidence'],
            component_scores=result['component_scores'],
            insights=result['insights'],
            feature_importance=result.get('feature_importance', {}),
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/train-model", response_model=ModelTrainingResponse)
async def train_location_model(
    request: ModelTrainingRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    🧠 Train new ML model for specific business type
    
    Creates a machine learning model trained on existing business data to predict 
    location success potential. Uses XGBoost, LightGBM, and other algorithms.
    """
    
    try:
        # Validate business type
        try:
            business_type_enum = BusinessType(request.business_type)
        except ValueError:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid business type: {request.business_type}"
            )
        
        # Check if we have enough data
        business_count = db.query(Business).filter(
            Business.business_type == business_type_enum,
            Business.rating.isnot(None),
            Business.review_count > 5
        ).count()
        
        if business_count < 30:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient training data: {business_count} businesses (minimum 30 required)"
            )
        
        # Train model in background
        background_tasks.add_task(
            _train_model_background, 
            request.business_type, 
            request.region_id
        )
        
        return ModelTrainingResponse(
            success=True,
            model_id=None,  # Will be set after training
            model_type=request.business_type,
            r2_score=0.0,  # Will be updated after training
            training_samples=business_count,
            feature_count=0  # Will be updated after training
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return ModelTrainingResponse(
            success=False,
            model_id=None,
            model_type=request.business_type,
            r2_score=0.0,
            training_samples=0,
            feature_count=0,
            error=str(e)
        )

@router.get("/models", response_model=List[Dict])
def get_trained_models(
    business_type: Optional[str] = Query(None),
    is_active: bool = Query(True),
    db: Session = Depends(get_db)
):
    """Get list of trained ML models"""
    
    query = db.query(MLModel).filter(MLModel.is_active == is_active)
    
    if business_type:
        query = query.filter(MLModel.name.contains(business_type))
    
    models = query.order_by(MLModel.created_at.desc()).all()
    
    return [
        {
            "id": model.id,
            "name": model.name,
            "model_type": model.model_type,
            "algorithm": model.algorithm,
            "version": model.version,
            "accuracy": model.accuracy,
            "training_data_size": model.training_data_size,
            "feature_count": model.feature_count,
            "is_production": model.is_production,
            "trained_at": model.trained_at,
            "performance_metrics": {
                "accuracy": model.accuracy,
                "precision": model.precision,
                "recall": model.recall,
                "f1_score": model.f1_score
            }
        } for model in models
    ]

@router.post("/analyze-sentiment/{business_id}", response_model=SentimentAnalysisResponse)
async def analyze_business_sentiment(
    business_id: int,
    db: Session = Depends(get_db)
):
    """
    😊 Analyze business review sentiments with AI
    
    Performs sentiment analysis on business reviews using Turkish NLP models.
    Provides insights into customer satisfaction and key topics.
    """
    
    # Check if business exists
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Check if business has reviews
    review_count = db.query(BusinessReview).filter(
        BusinessReview.business_id == business_id
    ).count()
    
    if review_count == 0:
        raise HTTPException(
            status_code=404, 
            detail="No reviews found for this business"
        )
    
    try:
        # Perform sentiment analysis
        result = sentiment_analyzer.analyze_business_reviews(business_id, db)
        
        return SentimentAnalysisResponse(
            business_id=business_id,
            avg_sentiment=result['avg_sentiment'],
            sentiment_distribution=result['sentiment_distribution'],
            total_reviews_analyzed=result['total_reviews_analyzed'],
            top_topics=result['top_topics'],
            sentiment_score=result['sentiment_score']
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Sentiment analysis failed: {str(e)}"
        )

@router.get("/features/{lat}/{lng}", response_model=Dict[str, Any])
def get_location_features(
    lat: float,
    lng: float,
    business_type: str = Query(..., description="Business type for analysis"),
    radius: int = Query(500, description="Analysis radius in meters"),
    db: Session = Depends(get_db)
):
    """
    🔍 Get detailed location features for analysis
    
    Returns all engineered features used by ML models for a specific location.
    Useful for understanding what factors influence location scoring.
    """
    
    try:
        # Validate business type
        try:
            BusinessType(business_type)
        except ValueError:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid business type: {business_type}"
            )
        
        # Generate features
        features = feature_engineer.create_location_features(
            lat=lat,
            lng=lng,
            business_type=business_type,
            radius=radius,
            db_session=db
        )
        
        # Categorize features for better understanding
        categorized_features = {
            "competition": {k: v for k, v in features.items() if 'competitor' in k or 'competition' in k},
            "density": {k: v for k, v in features.items() if 'density' in k or 'total_businesses' in k},
            "quality": {k: v for k, v in features.items() if 'rating' in k or 'quality' in k},
            "accessibility": {k: v for k, v in features.items() if 'accessibility' in k or 'distance' in k},
            "environmental": {k: v for k, v in features.items() if 'park' in k or 'cultural' in k or 'noise' in k},
            "demographic": {k: v for k, v in features.items() if 'population' in k or 'income' in k or 'age' in k},
            "temporal": {k: v for k, v in features.items() if 'month' in k or 'day' in k or 'weekend' in k}
        }
        
        return {
            "location": {"lat": lat, "lng": lng},
            "analysis_params": {"business_type": business_type, "radius": radius},
            "feature_count": len(features),
            "features": {
                "categorized": categorized_features,
                "all_features": features
            },
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Feature generation failed: {str(e)}"
        )

@router.get("/analyses", response_model=List[Dict])
def get_recent_analyses(
    business_type: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    """Get recent AI analyses"""
    
    query = db.query(Analysis).order_by(Analysis.created_at.desc())
    
    if business_type:
        try:
            business_type_enum = BusinessType(business_type)
            query = query.filter(Analysis.business_type == business_type_enum)
        except ValueError:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid business type: {business_type}"
            )
    
    analyses = query.limit(limit).all()
    
    return [
        {
            "id": analysis.id,
            "location_name": analysis.location_name,
            "business_type": analysis.business_type.value if analysis.business_type else None,
            "overall_score": analysis.overall_score,
            "confidence_score": analysis.confidence_score,
            "component_scores": {
                "competition": analysis.competition_score,
                "foot_traffic": analysis.foot_traffic_score,
                "accessibility": analysis.accessibility_score,
                "demographic": analysis.demographic_score,
                "environmental": analysis.environmental_score
            },
            "key_insights": analysis.key_insights,
            "created_at": analysis.created_at,
            "businesses_analyzed": analysis.businesses_analyzed
        } for analysis in analyses
    ]

@router.get("/analysis/{analysis_id}", response_model=Dict)
def get_analysis_detail(analysis_id: int, db: Session = Depends(get_db)):
    """Get detailed analysis results"""
    
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return {
        "id": analysis.id,
        "location_name": analysis.location_name,
        "business_type": analysis.business_type.value if analysis.business_type else None,
        "analysis_radius": analysis.analysis_radius,
        "overall_score": analysis.overall_score,
        "confidence_score": analysis.confidence_score,
        "component_scores": {
            "competition": analysis.competition_score,
            "foot_traffic": analysis.foot_traffic_score,
            "accessibility": analysis.accessibility_score,
            "demographic": analysis.demographic_score,
            "environmental": analysis.environmental_score
        },
        "insights": {
            "key_insights": analysis.key_insights,
            "recommendations": analysis.recommendations,
            "risk_factors": analysis.risk_factors,
            "opportunities": analysis.opportunities
        },
        "data_quality": {
            "data_completeness": analysis.data_completeness,
            "businesses_analyzed": analysis.businesses_analyzed
        },
        "metadata": {
            "analysis_version": analysis.analysis_version,
            "processing_time_ms": analysis.processing_time_ms,
            "created_at": analysis.created_at,
            "ml_model_id": analysis.ml_model_id
        }
    }

async def _train_model_background(business_type: str, region_id: Optional[int]):
    """Background task for model training"""
    try:
        result = scoring_model.train_model(business_type, region_id)
        # In production, you might want to send notifications or update job status
        print(f"Model training completed for {business_type}: {result}")
    except Exception as e:
        print(f"Model training failed for {business_type}: {e}")