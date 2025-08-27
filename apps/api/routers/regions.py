from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any
from datetime import datetime
import json

from ..db import get_db
from ..models import Region, Business, ScrapingJob, JobStatus
from ..services.google_scraper import scraper

router = APIRouter(prefix="/regions", tags=["Region Management"])

class RegionCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    city: str = Field(..., min_length=2, max_length=50)
    district: str = Field(..., min_length=2, max_length=50)
    country: str = Field(default="Turkey", max_length=50)
    center_lat: float = Field(..., ge=-90, le=90)
    center_lng: float = Field(..., ge=-180, le=180)
    radius_km: float = Field(default=2.0, gt=0, le=50)
    polygon: Optional[str] = Field(None, description="GeoJSON polygon for precise boundaries")
    is_pilot_region: bool = Field(default=False)

class RegionResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    city: str
    district: str
    country: str
    center_lat: float
    center_lng: float
    radius_km: float
    polygon: Optional[str]
    is_pilot_region: bool
    businesses_count: int
    scraping_jobs_count: int
    last_scraping_date: Optional[datetime]
    data_completeness: Optional[float]
    created_at: datetime
    updated_at: datetime

class RegionDataCollectionRequest(BaseModel):
    region_id: int
    business_types: List[str] = Field(
        default=["restaurant", "cafe", "store", "hotel", "service"],
        description="Business types to collect"
    )
    search_queries: List[str] = Field(
        default=["restoran", "kafe", "otel", "mağaza", "market"],
        description="Custom search queries for the region"
    )
    max_businesses: int = Field(default=1000, ge=10, le=5000)
    include_reviews: bool = Field(default=True)
    max_reviews_per_business: int = Field(default=50, ge=5, le=200)
    scrape_environmental_data: bool = Field(default=True)

class DataCollectionResponse(BaseModel):
    job_id: int
    region_id: int
    status: str
    estimated_duration_minutes: int
    businesses_to_scrape: int
    message: str

class RegionStatsResponse(BaseModel):
    region_id: int
    region_name: str
    businesses: Dict[str, int]
    reviews_stats: Dict[str, Any]
    coverage_stats: Dict[str, float]
    data_quality: Dict[str, float]
    last_updated: datetime

@router.post("/create", response_model=RegionResponse)
async def create_region(
    request: RegionCreateRequest,
    db: Session = Depends(get_db)
):
    """
    🗺️ Create new region for analysis
    
    Creates a new geographic region for comprehensive business data collection and analysis.
    Supports both circular (radius-based) and polygon-based regions.
    """
    
    # Check if region name already exists in the same city
    existing_region = db.query(Region).filter(
        Region.name == request.name,
        Region.city == request.city
    ).first()
    
    if existing_region:
        raise HTTPException(
            status_code=400,
            detail=f"Region '{request.name}' already exists in {request.city}"
        )
    
    try:
        # Create region
        region = Region(
            name=request.name,
            description=request.description,
            city=request.city,
            district=request.district,
            country=request.country,
            center_lat=request.center_lat,
            center_lng=request.center_lng,
            radius_km=request.radius_km,
            polygon=request.polygon,
            is_pilot_region=request.is_pilot_region,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.add(region)
        db.commit()
        db.refresh(region)
        
        return RegionResponse(
            id=region.id,
            name=region.name,
            description=region.description,
            city=region.city,
            district=region.district,
            country=region.country,
            center_lat=region.center_lat,
            center_lng=region.center_lng,
            radius_km=region.radius_km,
            polygon=region.polygon,
            is_pilot_region=region.is_pilot_region,
            businesses_count=0,
            scraping_jobs_count=0,
            last_scraping_date=None,
            data_completeness=0.0,
            created_at=region.created_at,
            updated_at=region.updated_at
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create region: {str(e)}")

@router.get("/list", response_model=List[RegionResponse])
def get_regions(
    city: Optional[str] = None,
    is_pilot_region: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get list of regions with statistics"""
    
    query = db.query(Region)
    
    if city:
        query = query.filter(Region.city.ilike(f"%{city}%"))
    
    if is_pilot_region is not None:
        query = query.filter(Region.is_pilot_region == is_pilot_region)
    
    regions = query.order_by(Region.created_at.desc()).all()
    
    # Get statistics for each region
    region_responses = []
    for region in regions:
        # Count businesses in region
        business_count = db.query(Business).filter(
            Business.region_id == region.id
        ).count()
        
        # Count scraping jobs
        jobs_count = db.query(ScrapingJob).filter(
            ScrapingJob.region_id == region.id
        ).count()
        
        # Get last scraping date
        last_job = db.query(ScrapingJob).filter(
            ScrapingJob.region_id == region.id,
            ScrapingJob.status == JobStatus.completed
        ).order_by(ScrapingJob.updated_at.desc()).first()
        
        region_responses.append(RegionResponse(
            id=region.id,
            name=region.name,
            description=region.description,
            city=region.city,
            district=region.district,
            country=region.country,
            center_lat=region.center_lat,
            center_lng=region.center_lng,
            radius_km=region.radius_km,
            polygon=region.polygon,
            is_pilot_region=region.is_pilot_region,
            businesses_count=business_count,
            scraping_jobs_count=jobs_count,
            last_scraping_date=last_job.updated_at if last_job else None,
            data_completeness=region.data_completeness,
            created_at=region.created_at,
            updated_at=region.updated_at
        ))
    
    return region_responses

@router.post("/collect-data", response_model=DataCollectionResponse)
async def start_region_data_collection(
    request: RegionDataCollectionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    🚀 Start comprehensive data collection for a region
    
    Initiates Google Maps scraping and environmental data collection for the specified region.
    This is a long-running background task that can take hours depending on region size.
    """
    
    # Verify region exists
    region = db.query(Region).filter(Region.id == request.region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    
    # Check if there's already a running job for this region
    active_job = db.query(ScrapingJob).filter(
        ScrapingJob.region_id == request.region_id,
        ScrapingJob.status.in_([JobStatus.running, JobStatus.pending])
    ).first()
    
    if active_job:
        raise HTTPException(
            status_code=400,
            detail=f"Data collection already in progress for this region (Job ID: {active_job.id})"
        )
    
    try:
        # Create scraping job
        job = ScrapingJob(
            region_id=request.region_id,
            job_type="comprehensive_region_scraping",
            status=JobStatus.pending,
            config={
                "business_types": request.business_types,
                "search_queries": request.search_queries,
                "max_businesses": request.max_businesses,
                "include_reviews": request.include_reviews,
                "max_reviews_per_business": request.max_reviews_per_business,
                "scrape_environmental_data": request.scrape_environmental_data
            },
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        # Start background data collection
        background_tasks.add_task(
            _collect_region_data_background,
            job.id,
            region,
            request
        )
        
        # Estimate duration based on expected businesses
        estimated_duration = max(10, min(480, request.max_businesses * 0.1))  # 0.1 min per business, max 8 hours
        
        return DataCollectionResponse(
            job_id=job.id,
            region_id=request.region_id,
            status="pending",
            estimated_duration_minutes=int(estimated_duration),
            businesses_to_scrape=request.max_businesses,
            message=f"Data collection started for {region.name}. This may take several hours depending on region size."
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start data collection: {str(e)}"
        )

@router.get("/{region_id}/stats", response_model=RegionStatsResponse)
def get_region_statistics(region_id: int, db: Session = Depends(get_db)):
    """
    📊 Get detailed statistics for a region
    
    Returns comprehensive analytics including business distribution, 
    review statistics, and data quality metrics.
    """
    
    region = db.query(Region).filter(Region.id == region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    
    # Business statistics
    business_stats = db.query(
        Business.business_type,
        func.count(Business.id).label('count')
    ).filter(
        Business.region_id == region_id
    ).group_by(Business.business_type).all()
    
    business_dict = {str(stat.business_type): stat.count for stat in business_stats}
    
    # Review statistics
    review_stats = db.query(
        func.count(Business.id).label('businesses_with_reviews'),
        func.avg(Business.rating).label('avg_rating'),
        func.sum(Business.review_count).label('total_reviews'),
        func.max(Business.review_count).label('max_reviews'),
        func.min(Business.rating).label('min_rating'),
        func.max(Business.rating).label('max_rating')
    ).filter(
        Business.region_id == region_id,
        Business.rating.isnot(None)
    ).first()
    
    reviews_dict = {
        "businesses_with_reviews": review_stats.businesses_with_reviews or 0,
        "avg_rating": float(review_stats.avg_rating or 0),
        "total_reviews": review_stats.total_reviews or 0,
        "max_reviews_per_business": review_stats.max_reviews or 0,
        "rating_range": {
            "min": float(review_stats.min_rating or 0),
            "max": float(review_stats.max_rating or 0)
        }
    }
    
    # Coverage statistics
    total_businesses = sum(business_dict.values())
    businesses_with_reviews = review_stats.businesses_with_reviews or 0
    
    coverage_dict = {
        "total_businesses": total_businesses,
        "businesses_with_reviews_pct": (businesses_with_reviews / total_businesses * 100) if total_businesses > 0 else 0,
        "avg_reviews_per_business": (review_stats.total_reviews / total_businesses) if total_businesses > 0 else 0
    }
    
    # Data quality metrics
    quality_dict = {
        "completeness_score": region.data_completeness or 0.0,
        "data_freshness_days": (datetime.utcnow() - region.updated_at).days,
        "coverage_score": min(100.0, total_businesses / 100.0 * 100)  # Assuming 100 businesses = 100% coverage
    }
    
    return RegionStatsResponse(
        region_id=region_id,
        region_name=region.name,
        businesses=business_dict,
        reviews_stats=reviews_dict,
        coverage_stats=coverage_dict,
        data_quality=quality_dict,
        last_updated=region.updated_at
    )

@router.get("/{region_id}/businesses")
def get_region_businesses(
    region_id: int,
    business_type: Optional[str] = None,
    min_rating: Optional[float] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get businesses in a region with filters"""
    
    query = db.query(Business).filter(Business.region_id == region_id)
    
    if business_type:
        query = query.filter(Business.business_type == business_type)
    
    if min_rating:
        query = query.filter(Business.rating >= min_rating)
    
    businesses = query.limit(limit).all()
    
    return [
        {
            "id": business.id,
            "name": business.name,
            "business_type": business.business_type.value if business.business_type else None,
            "rating": business.rating,
            "review_count": business.review_count,
            "address": business.address,
            "latitude": business.latitude,
            "longitude": business.longitude,
            "google_place_id": business.google_place_id,
            "phone": business.phone,
            "website": business.website,
            "opening_hours": business.opening_hours,
            "price_level": business.price_level
        } for business in businesses
    ]

@router.post("/kaleiçi-pilot")
async def setup_kaleici_pilot_project(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    🎯 Setup Kaleiçi (Antalya) Pilot Project
    
    Creates the Kaleiçi region and starts comprehensive data collection.
    This is the pilot project for LOKASCORE platform.
    """
    
    # Check if Kaleiçi region already exists
    existing_region = db.query(Region).filter(
        Region.name.ilike("%kaleiçi%"),
        Region.city.ilike("%antalya%")
    ).first()
    
    if existing_region:
        return {
            "message": "Kaleiçi region already exists",
            "region_id": existing_region.id,
            "status": "existing"
        }
    
    try:
        # Create Kaleiçi region
        kaleici_region = Region(
            name="Kaleiçi",
            description="Antalya'nın tarihi merkezi - LOKASCORE pilot projesi bölgesi",
            city="Antalya",
            district="Muratpaşa",
            country="Turkey",
            center_lat=36.8841,  # Kaleiçi center coordinates
            center_lng=30.7056,
            radius_km=1.5,  # 1.5km radius should cover most of Kaleiçi
            is_pilot_region=True,
            data_completeness=0.0,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.add(kaleici_region)
        db.commit()
        db.refresh(kaleici_region)
        
        # Setup comprehensive data collection
        collection_request = RegionDataCollectionRequest(
            region_id=kaleici_region.id,
            business_types=[
                "restaurant", "cafe", "hotel", "boutique_hotel", 
                "store", "souvenir_shop", "art_gallery", "museum",
                "bar", "nightclub", "service", "tour_agency"
            ],
            search_queries=[
                "kaleiçi restoran", "kaleiçi kafe", "kaleiçi otel",
                "kaleiçi butik otel", "kaleiçi mağaza", "kaleiçi müze",
                "kaleiçi bar", "kaleiçi tur", "kaleiçi hediyelik",
                "old town antalya", "antalya historical center"
            ],
            max_businesses=500,  # Kaleiçi is small but dense
            include_reviews=True,
            max_reviews_per_business=100,  # More reviews for pilot project
            scrape_environmental_data=True
        )
        
        # Start data collection
        job = ScrapingJob(
            region_id=kaleici_region.id,
            job_type="kaleici_pilot_scraping",
            status=JobStatus.pending,
            config=collection_request.dict(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        # Start background collection
        background_tasks.add_task(
            _collect_region_data_background,
            job.id,
            kaleici_region,
            collection_request
        )
        
        return {
            "message": "Kaleiçi pilot project setup completed successfully",
            "region_id": kaleici_region.id,
            "job_id": job.id,
            "status": "started",
            "estimated_duration_hours": 3,
            "next_steps": [
                "Data collection will run in background for ~3 hours",
                "Monitor progress via /scraping/jobs/{job_id}",
                "Once complete, ML models will be trained on the data",
                "Region analysis will be available via /ml/analyze-location"
            ]
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to setup Kaleiçi pilot project: {str(e)}"
        )

async def _collect_region_data_background(
    job_id: int,
    region: Region,
    config: RegionDataCollectionRequest
):
    """Background task for comprehensive region data collection"""
    
    try:
        print(f"Starting region data collection for {region.name} (Job ID: {job_id})")
        
        # This would call the Google scraper service
        result = await scraper.scrape_region_comprehensive(
            region=region,
            business_types=config.business_types,
            search_queries=config.search_queries,
            max_businesses=config.max_businesses,
            include_reviews=config.include_reviews,
            max_reviews_per_business=config.max_reviews_per_business,
            scrape_environmental_data=config.scrape_environmental_data
        )
        
        print(f"Region data collection completed for {region.name}: {result}")
        
    except Exception as e:
        print(f"Region data collection failed for {region.name}: {e}")