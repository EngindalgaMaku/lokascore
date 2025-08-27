import logging
import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import joblib
import json

# ML Libraries
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import xgboost as xgb
import lightgbm as lgb

# NLP Libraries
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from textblob import TextBlob
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Geospatial
from geopy.distance import geodesic
import geoalchemy2.functions as geofunc

from ..models import Business, BusinessReview, Analysis, MLModel, EnvironmentalFeature, Region
from ..db import SessionLocal
from sqlalchemy import text, func

logger = logging.getLogger(__name__)

class FeatureEngineer:
    """Feature engineering for location analysis"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
    
    def create_location_features(self, lat: float, lng: float, business_type: str, 
                               radius: int = 500, db_session=None) -> Dict:
        """
        Create comprehensive feature set for a location
        
        Returns:
            Dict with all engineered features for ML model
        """
        if not db_session:
            db_session = SessionLocal()
        
        features = {}
        
        # 1. Competition Features
        competition_features = self._get_competition_features(lat, lng, business_type, radius, db_session)
        features.update(competition_features)
        
        # 2. Density Features  
        density_features = self._get_density_features(lat, lng, radius, db_session)
        features.update(density_features)
        
        # 3. Quality Features
        quality_features = self._get_quality_features(lat, lng, business_type, radius, db_session)
        features.update(quality_features)
        
        # 4. Accessibility Features
        accessibility_features = self._get_accessibility_features(lat, lng, radius, db_session)
        features.update(accessibility_features)
        
        # 5. Environmental Features
        environmental_features = self._get_environmental_features(lat, lng, radius, db_session)
        features.update(environmental_features)
        
        # 6. Demographic Features (placeholder - would need census data)
        demographic_features = self._get_demographic_features(lat, lng, radius)
        features.update(demographic_features)
        
        # 7. Temporal Features
        temporal_features = self._get_temporal_features()
        features.update(temporal_features)
        
        logger.info(f"Generated {len(features)} features for location ({lat}, {lng})")
        return features
    
    def _get_competition_features(self, lat: float, lng: float, business_type: str, 
                                 radius: int, db_session) -> Dict:
        """Competition analysis features"""
        features = {}
        
        # SQL for spatial queries
        point = f"ST_SetSRID(ST_MakePoint({lng}, {lat}), 4326)"
        
        # Same type competitors in different radii
        for r in [100, 250, 500, 750, 1000]:
            if r > radius:
                continue
                
            query = text(f"""
                SELECT COUNT(*) as count,
                       AVG(rating) as avg_rating,
                       AVG(review_count) as avg_reviews,
                       SUM(review_count) as total_reviews
                FROM businesses 
                WHERE business_type = :business_type 
                AND ST_DWithin(geom::geography, ({point})::geography, {r})
                AND is_active = true
            """)
            
            result = db_session.execute(query, {"business_type": business_type}).first()
            
            features[f'competitors_{r}m'] = result.count or 0
            features[f'avg_competitor_rating_{r}m'] = result.avg_rating or 0
            features[f'avg_competitor_reviews_{r}m'] = result.avg_reviews or 0
            features[f'total_competitor_reviews_{r}m'] = result.total_reviews or 0
        
        # Competition intensity score
        if features.get('competitors_500m', 0) > 0:
            features['competition_intensity'] = (
                features['competitors_250m'] / max(features['competitors_500m'], 1)
            )
        else:
            features['competition_intensity'] = 0
        
        # Market saturation
        area_km2 = (np.pi * (radius/1000)**2)
        features['competitor_density_per_km2'] = features.get('competitors_500m', 0) / area_km2
        
        return features
    
    def _get_density_features(self, lat: float, lng: float, radius: int, db_session) -> Dict:
        """Business density features"""
        features = {}
        
        point = f"ST_SetSRID(ST_MakePoint({lng}, {lat}), 4326)"
        
        # Total business density
        query = text(f"""
            SELECT COUNT(*) as total_businesses,
                   COUNT(DISTINCT business_type) as business_types,
                   AVG(rating) as avg_area_rating,
                   SUM(review_count) as total_area_reviews
            FROM businesses 
            WHERE ST_DWithin(geom::geography, ({point})::geography, {radius})
            AND is_active = true
        """)
        
        result = db_session.execute(query).first()
        
        features['total_businesses'] = result.total_businesses or 0
        features['business_type_diversity'] = result.business_types or 0
        features['avg_area_rating'] = result.avg_area_rating or 0
        features['total_area_reviews'] = result.total_area_reviews or 0
        
        # Business category mix
        category_query = text(f"""
            SELECT business_type, COUNT(*) as count
            FROM businesses 
            WHERE ST_DWithin(geom::geography, ({point})::geography, {radius})
            AND is_active = true
            GROUP BY business_type
        """)
        
        category_results = db_session.execute(category_query).fetchall()
        
        # One-hot encode business types in area
        business_types = ['restaurant', 'cafe', 'retail', 'hotel', 'bank', 'hospital', 'school']
        for bt in business_types:
            features[f'has_{bt}_nearby'] = 0
        
        for result in category_results:
            bt = result.business_type
            if bt in business_types:
                features[f'has_{bt}_nearby'] = 1
                features[f'count_{bt}_nearby'] = result.count
        
        return features
    
    def _get_quality_features(self, lat: float, lng: float, business_type: str,
                            radius: int, db_session) -> Dict:
        """Quality indicators"""
        features = {}
        
        point = f"ST_SetSRID(ST_MakePoint({lng}, {lat}), 4326)"
        
        # High-quality competitors (rating > 4.0)
        query = text(f"""
            SELECT COUNT(*) as high_quality_count,
                   AVG(rating) as high_quality_avg_rating,
                   AVG(review_count) as high_quality_avg_reviews
            FROM businesses 
            WHERE business_type = :business_type
            AND rating >= 4.0
            AND ST_DWithin(geom::geography, ({point})::geography, {radius})
            AND is_active = true
        """)
        
        result = db_session.execute(query, {"business_type": business_type}).first()
        
        features['high_quality_competitors'] = result.high_quality_count or 0
        features['high_quality_avg_rating'] = result.high_quality_avg_rating or 0
        features['high_quality_avg_reviews'] = result.high_quality_avg_reviews or 0
        
        # Review volume indicators
        features['market_engagement'] = features.get('total_area_reviews', 0) / max(features.get('total_businesses', 1), 1)
        
        return features
    
    def _get_accessibility_features(self, lat: float, lng: float, radius: int, db_session) -> Dict:
        """Accessibility and transportation features"""
        features = {}
        
        point = f"ST_SetSRID(ST_MakePoint({lng}, {lat}), 4326)"
        
        # Transportation related businesses
        transport_types = ['gas_station', 'bank']  # Proxy for accessibility
        
        for transport_type in transport_types:
            query = text(f"""
                SELECT COUNT(*) as count,
                       MIN(ST_Distance(geom::geography, ({point})::geography)) as min_distance
                FROM businesses 
                WHERE business_type = :transport_type
                AND ST_DWithin(geom::geography, ({point})::geography, {radius * 2})
                AND is_active = true
            """)
            
            result = db_session.execute(query, {"transport_type": transport_type}).first()
            features[f'{transport_type}_count'] = result.count or 0
            features[f'distance_to_nearest_{transport_type}'] = result.min_distance or radius * 2
        
        # Accessibility score (inverse of distance to important services)
        important_services = features.get('bank_count', 0) + features.get('gas_station_count', 0)
        features['accessibility_score'] = min(important_services / 5, 1.0)  # Normalize to 0-1
        
        return features
    
    def _get_environmental_features(self, lat: float, lng: float, radius: int, db_session) -> Dict:
        """Environmental context features"""
        features = {}
        
        # This would be enhanced with actual environmental data
        # For now, using business types as proxies
        
        point = f"ST_SetSRID(ST_MakePoint({lng}, {lat}), 4326)"
        
        # Green spaces (parks)
        parks_query = text(f"""
            SELECT COUNT(*) as park_count,
                   MIN(ST_Distance(geom::geography, ({point})::geography)) as nearest_park_distance
            FROM businesses 
            WHERE business_type = 'park'
            AND ST_DWithin(geom::geography, ({point})::geography, {radius * 3})
        """)
        
        result = db_session.execute(parks_query).first()
        features['nearby_parks'] = result.park_count or 0
        features['distance_to_park'] = result.nearest_park_distance or radius * 3
        
        # Cultural attractions (museums, etc.)
        cultural_query = text(f"""
            SELECT COUNT(*) as cultural_count
            FROM businesses 
            WHERE business_type IN ('museum', 'mosque', 'church')
            AND ST_DWithin(geom::geography, ({point})::geography, {radius * 2})
        """)
        
        result = db_session.execute(cultural_query).first()
        features['cultural_attractions'] = result.cultural_count or 0
        
        # Noise level proxy (based on business density and types)
        busy_businesses = features.get('restaurant_count_nearby', 0) + features.get('cafe_count_nearby', 0)
        features['estimated_noise_level'] = min(busy_businesses / 10, 1.0)
        
        return features
    
    def _get_demographic_features(self, lat: float, lng: float, radius: int) -> Dict:
        """Demographic features (would need external census data)"""
        # Placeholder implementation
        # In production, integrate with census/demographic APIs
        
        features = {
            'population_density_estimate': 1000,  # people per km2
            'avg_income_estimate': 50000,  # annual income estimate
            'age_group_young_adult_ratio': 0.3,  # 18-35 age group
            'age_group_middle_age_ratio': 0.4,   # 35-55 age group
            'age_group_senior_ratio': 0.3,       # 55+ age group
            'education_level_university_ratio': 0.4,
            'tourism_factor': 0.7 if 'kaleiçi' in str(lat) else 0.3,  # Tourism intensity
        }
        
        return features
    
    def _get_temporal_features(self) -> Dict:
        """Time-based features"""
        now = datetime.now()
        
        features = {
            'month': now.month,
            'day_of_week': now.weekday(),
            'hour': now.hour,
            'is_weekend': 1 if now.weekday() >= 5 else 0,
            'is_summer_season': 1 if now.month in [6, 7, 8, 9] else 0,  # Tourism season
            'is_business_hours': 1 if 8 <= now.hour <= 22 else 0,
        }
        
        return features

class SentimentAnalyzer:
    """Analyze business review sentiments"""
    
    def __init__(self):
        # Initialize sentiment analysis models
        try:
            self.turkish_sentiment = pipeline(
                "sentiment-analysis", 
                model="savasy/bert-base-turkish-sentiment-cased"
            )
        except:
            logger.warning("Turkish BERT model not available, using TextBlob")
            self.turkish_sentiment = None
        
        # Initialize NLTK sentiment analyzer
        try:
            nltk.download('vader_lexicon', quiet=True)
            self.vader = SentimentIntensityAnalyzer()
        except:
            self.vader = None
    
    def analyze_business_reviews(self, business_id: int, db_session=None) -> Dict:
        """Analyze all reviews for a business"""
        if not db_session:
            db_session = SessionLocal()
        
        # Get reviews
        reviews = db_session.query(BusinessReview).filter(
            BusinessReview.business_id == business_id,
            BusinessReview.text.isnot(None)
        ).all()
        
        if not reviews:
            return self._empty_sentiment_result()
        
        sentiments = []
        topics = []
        
        for review in reviews:
            if not review.text or len(review.text.strip()) < 10:
                continue
            
            # Analyze sentiment
            sentiment = self._analyze_single_review(review.text)
            sentiments.append(sentiment)
            
            # Extract topics/keywords
            review_topics = self._extract_topics(review.text)
            topics.extend(review_topics)
        
        if not sentiments:
            return self._empty_sentiment_result()
        
        # Aggregate results
        avg_sentiment = np.mean([s['compound'] for s in sentiments])
        sentiment_distribution = {
            'positive': len([s for s in sentiments if s['compound'] > 0.1]),
            'negative': len([s for s in sentiments if s['compound'] < -0.1]),
            'neutral': len([s for s in sentiments if -0.1 <= s['compound'] <= 0.1])
        }
        
        # Topic analysis
        from collections import Counter
        topic_counter = Counter(topics)
        top_topics = dict(topic_counter.most_common(10))
        
        return {
            'avg_sentiment': avg_sentiment,
            'sentiment_distribution': sentiment_distribution,
            'total_reviews_analyzed': len(sentiments),
            'top_topics': top_topics,
            'sentiment_score': self._calculate_business_sentiment_score(
                avg_sentiment, sentiment_distribution, len(sentiments)
            )
        }
    
    def _analyze_single_review(self, text: str) -> Dict:
        """Analyze sentiment of a single review"""
        sentiment_scores = {'compound': 0, 'pos': 0, 'neu': 0, 'neg': 0}
        
        # Try Turkish BERT model first
        if self.turkish_sentiment:
            try:
                result = self.turkish_sentiment(text[:512])  # BERT input limit
                if result[0]['label'] == 'POSITIVE':
                    sentiment_scores['compound'] = result[0]['score']
                    sentiment_scores['pos'] = result[0]['score']
                else:
                    sentiment_scores['compound'] = -result[0]['score']
                    sentiment_scores['neg'] = result[0]['score']
            except Exception as e:
                logger.warning(f"Turkish sentiment analysis failed: {e}")
        
        # Fallback to VADER
        if sentiment_scores['compound'] == 0 and self.vader:
            try:
                scores = self.vader.polarity_scores(text)
                sentiment_scores = scores
            except Exception as e:
                logger.warning(f"VADER sentiment analysis failed: {e}")
        
        # Last fallback to TextBlob
        if sentiment_scores['compound'] == 0:
            try:
                blob = TextBlob(text)
                polarity = blob.sentiment.polarity
                sentiment_scores['compound'] = polarity
                if polarity > 0:
                    sentiment_scores['pos'] = polarity
                elif polarity < 0:
                    sentiment_scores['neg'] = abs(polarity)
                else:
                    sentiment_scores['neu'] = 1.0
            except:
                pass
        
        return sentiment_scores
    
    def _extract_topics(self, text: str) -> List[str]:
        """Extract topics/keywords from review text"""
        # Simple keyword extraction based on common restaurant/business topics
        topics = []
        
        topic_keywords = {
            'food_quality': ['lezzetli', 'güzel', 'harika', 'mükemmel', 'berbat', 'kötü', 'yemek'],
            'service': ['servis', 'hizmet', 'garson', 'personel', 'çalışan', 'güler yüzlü'],
            'atmosphere': ['ortam', 'atmosfer', 'müzik', 'dekor', 'ambiyans', 'rahat'],
            'price': ['fiyat', 'pahalı', 'ucuz', 'uygun', 'ekonomik', 'değer'],
            'location': ['konum', 'yer', 'ulaşım', 'park', 'merkez', 'yakın'],
            'cleanliness': ['temiz', 'hijyen', 'pis', 'kirli', 'bakımlı'],
            'speed': ['hızlı', 'yavaş', 'geç', 'çabuk', 'bekletme', 'süre']
        }
        
        text_lower = text.lower()
        
        for topic, keywords in topic_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    topics.append(topic)
                    break  # One match per topic per review
        
        return topics
    
    def _calculate_business_sentiment_score(self, avg_sentiment: float, 
                                          distribution: Dict, total_reviews: int) -> float:
        """Calculate overall sentiment score for business (0-10 scale)"""
        if total_reviews == 0:
            return 5.0  # Neutral default
        
        # Base score from average sentiment (-1 to 1 -> 0 to 10)
        base_score = (avg_sentiment + 1) * 5
        
        # Adjust for review volume (more reviews = more reliable)
        confidence_multiplier = min(total_reviews / 20, 1.0)  # Max confidence at 20+ reviews
        
        # Adjust for distribution balance
        pos_ratio = distribution['positive'] / total_reviews
        neg_ratio = distribution['negative'] / total_reviews
        
        if pos_ratio > 0.7:  # Overwhelmingly positive
            adjustment = 0.5
        elif neg_ratio > 0.5:  # Mostly negative
            adjustment = -0.5
        else:
            adjustment = 0
        
        final_score = base_score + (adjustment * confidence_multiplier)
        return max(0, min(10, final_score))  # Clamp to 0-10
    
    def _empty_sentiment_result(self) -> Dict:
        """Return empty sentiment analysis result"""
        return {
            'avg_sentiment': 0.0,
            'sentiment_distribution': {'positive': 0, 'negative': 0, 'neutral': 0},
            'total_reviews_analyzed': 0,
            'top_topics': {},
            'sentiment_score': 5.0
        }

class LocationScoringModel:
    """ML model for scoring location potential"""
    
    def __init__(self):
        self.models = {}
        self.feature_engineer = FeatureEngineer()
        self.sentiment_analyzer = SentimentAnalyzer()
        
    def train_model(self, business_type: str, region_id: Optional[int] = None) -> Dict:
        """Train ML model for specific business type"""
        logger.info(f"Training model for {business_type}")
        
        db_session = SessionLocal()
        
        try:
            # Get training data
            X, y = self._prepare_training_data(business_type, region_id, db_session)
            
            if len(X) < 50:
                raise ValueError(f"Insufficient training data: {len(X)} samples")
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Try multiple algorithms
            models = {
                'xgboost': xgb.XGBRegressor(random_state=42),
                'lightgbm': lgb.LGBMRegressor(random_state=42),
                'random_forest': RandomForestRegressor(random_state=42),
                'gradient_boosting': GradientBoostingRegressor(random_state=42)
            }
            
            best_model = None
            best_score = -np.inf
            results = {}
            
            for name, model in models.items():
                # Train model
                model.fit(X_train, y_train)
                
                # Evaluate
                y_pred = model.predict(X_test)
                score = r2_score(y_test, y_pred)
                
                results[name] = {
                    'r2_score': score,
                    'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
                    'mae': mean_absolute_error(y_test, y_pred)
                }
                
                if score > best_score:
                    best_score = score
                    best_model = model
                    best_model_name = name
            
            # Save best model
            model_path = f"models/{business_type}_{best_model_name}_{datetime.now().strftime('%Y%m%d')}.joblib"
            joblib.dump(best_model, model_path)
            
            # Save model metadata to database
            ml_model_record = MLModel(
                name=f"{business_type}_location_scoring",
                model_type="location_scoring",
                algorithm=best_model_name,
                version="1.0",
                training_data_size=len(X),
                feature_count=len(X.columns),
                training_region_ids=[region_id] if region_id else None,
                accuracy=best_score,
                precision=results[best_model_name]['rmse'],
                recall=results[best_model_name]['mae'],
                f1_score=best_score,
                model_file_path=model_path,
                feature_names=list(X.columns),
                feature_importance=self._get_feature_importance(best_model, X.columns),
                is_active=True,
                hyperparameters=best_model.get_params(),
                trained_at=datetime.utcnow()
            )
            
            db_session.add(ml_model_record)
            db_session.commit()
            
            # Store model in memory
            self.models[business_type] = {
                'model': best_model,
                'feature_names': list(X.columns),
                'scaler': self.feature_engineer.scaler
            }
            
            logger.info(f"Model trained successfully: {best_model_name} with R² = {best_score:.3f}")
            
            return {
                'success': True,
                'model_type': best_model_name,
                'r2_score': best_score,
                'training_samples': len(X),
                'feature_count': len(X.columns),
                'model_id': ml_model_record.id,
                'results': results
            }
            
        except Exception as e:
            logger.error(f"Model training failed: {e}")
            db_session.rollback()
            return {'success': False, 'error': str(e)}
        
        finally:
            db_session.close()
    
    def predict_location_score(self, lat: float, lng: float, business_type: str) -> Dict:
        """Predict location score for given coordinates"""
        
        # Generate features
        db_session = SessionLocal()
        features = self.feature_engineer.create_location_features(lat, lng, business_type, db_session=db_session)
        
        # Load model if not in memory
        if business_type not in self.models:
            self._load_model(business_type, db_session)
        
        if business_type not in self.models:
            # Fallback to rule-based scoring
            return self._rule_based_scoring(features)
        
        # ML prediction
        model_data = self.models[business_type]
        model = model_data['model']
        feature_names = model_data['feature_names']
        
        # Prepare feature vector
        X = pd.DataFrame([features])[feature_names].fillna(0)
        
        # Predict
        raw_score = model.predict(X)[0]
        
        # Convert to 0-10 scale and add additional insights
        normalized_score = max(0, min(10, raw_score))
        
        # Generate insights
        insights = self._generate_insights(features, normalized_score, business_type)
        
        # Create analysis record
        analysis = Analysis(
            location_name=f"Location ({lat:.4f}, {lng:.4f})",
            geom=f"POINT({lng} {lat})",
            business_type=business_type,
            overall_score=normalized_score,
            confidence_score=0.85,  # Placeholder
            competition_score=self._calculate_component_score(features, 'competition'),
            foot_traffic_score=self._calculate_component_score(features, 'traffic'),
            accessibility_score=features.get('accessibility_score', 0.5) * 10,
            demographic_score=self._calculate_component_score(features, 'demographic'),
            environmental_score=self._calculate_component_score(features, 'environmental'),
            key_insights=insights['key_points'],
            recommendations=insights['recommendations'],
            risk_factors=insights['risks'],
            opportunities=insights['opportunities'],
            businesses_analyzed=features.get('total_businesses', 0),
            analysis_version="v1.0"
        )
        
        db_session.add(analysis)
        db_session.commit()
        analysis_id = analysis.id
        db_session.close()
        
        return {
            'overall_score': normalized_score,
            'confidence': 0.85,
            'analysis_id': analysis_id,
            'component_scores': {
                'competition': analysis.competition_score,
                'foot_traffic': analysis.foot_traffic_score,
                'accessibility': analysis.accessibility_score,
                'demographic': analysis.demographic_score,
                'environmental': analysis.environmental_score
            },
            'insights': insights,
            'feature_importance': self._get_feature_importance_for_prediction(model_data['model'], feature_names),
            'raw_features': features
        }
    
    def _prepare_training_data(self, business_type: str, region_id: Optional[int], db_session) -> Tuple[pd.DataFrame, pd.Series]:
        """Prepare training data from existing businesses"""
        
        # Get businesses of the specified type
        query = db_session.query(Business).filter(
            Business.business_type == business_type,
            Business.rating.isnot(None),
            Business.review_count > 5,  # Minimum review threshold
            Business.is_active == True
        )
        
        if region_id:
            query = query.filter(Business.region_id == region_id)
        
        businesses = query.all()
        
        if len(businesses) < 50:
            raise ValueError(f"Insufficient training data for {business_type}")
        
        # Generate features for each business
        X_data = []
        y_data = []
        
        for business in businesses:
            if not business.geom:
                continue
                
            # Extract coordinates from geometry
            coord_query = text(
                "SELECT ST_Y(geom) as lat, ST_X(geom) as lng FROM businesses WHERE id = :business_id"
            )
            coords = db_session.execute(coord_query, {"business_id": business.id}).first()
            
            if not coords:
                continue
            
            # Generate features
            features = self.feature_engineer.create_location_features(
                coords.lat, coords.lng, business_type, db_session=db_session
            )
            
            # Add business-specific features
            features['actual_rating'] = business.rating
            features['actual_review_count'] = business.review_count
            features['price_level'] = business.price_level or 2
            
            # Create success target variable
            # Combine rating and review count for success metric
            success_score = self._calculate_success_score(business.rating, business.review_count)
            
            X_data.append(features)
            y_data.append(success_score)
        
        # Convert to DataFrame
        X = pd.DataFrame(X_data)
        y = pd.Series(y_data)
        
        # Handle missing values
        X = X.fillna(X.median())
        
        logger.info(f"Prepared training data: {len(X)} samples, {len(X.columns)} features")
        return X, y
    
    def _calculate_success_score(self, rating: float, review_count: int) -> float:
        """Calculate success score from rating and review count"""
        if not rating:
            return 5.0
        
        # Weighted combination of rating and review popularity
        # Rating: 0-5 -> 0-10 scale
        rating_score = (rating / 5.0) * 10
        
        # Review count contributes to reliability (log scale)
        review_factor = min(np.log(review_count + 1) / np.log(100), 1.0)  # Max factor at 100 reviews
        
        # Combined score with 70% weight on rating, 30% on review factor
        success_score = (rating_score * 0.7) + (review_factor * 10 * 0.3)
        
        return max(0, min(10, success_score))
    
    def _rule_based_scoring(self, features: Dict) -> Dict:
        """Fallback rule-based scoring when ML model not available"""
        
        # Simple rule-based scoring
        score = 5.0  # Base score
        
        # Competition factor
        competitors = features.get('competitors_500m', 0)
        if competitors == 0:
            score += 2.0  # No competition bonus
        elif competitors <= 3:
            score += 1.0  # Light competition
        elif competitors <= 7:
            score += 0.0  # Normal competition
        else:
            score -= 1.0  # Heavy competition
        
        # Quality factor
        avg_rating = features.get('avg_competitor_rating_500m', 3.5)
        if avg_rating >= 4.0:
            score += 1.0  # High quality area
        elif avg_rating <= 3.0:
            score -= 0.5  # Low quality area
        
        # Accessibility
        accessibility = features.get('accessibility_score', 0.5)
        score += accessibility * 2  # 0-2 point bonus
        
        # Tourism factor (for Kaleiçi area)
        tourism = features.get('tourism_factor', 0.3)
        score += tourism * 1.5  # Tourism bonus
        
        score = max(0, min(10, score))
        
        return {
            'overall_score': score,
            'confidence': 0.6,  # Lower confidence for rule-based
            'method': 'rule_based',
            'component_scores': {
                'competition': max(0, min(10, 7 - competitors)),
                'accessibility': accessibility * 10,
                'quality': avg_rating * 2,
                'tourism': tourism * 10
            }
        }
    
    def _load_model(self, business_type: str, db_session):
        """Load trained model from database/file"""
        model_record = db_session.query(MLModel).filter(
            MLModel.model_type == "location_scoring",
            MLModel.name.contains(business_type),
            MLModel.is_active == True
        ).order_by(MLModel.created_at.desc()).first()
        
        if model_record and model_record.model_file_path:
            try:
                model = joblib.load(model_record.model_file_path)
                self.models[business_type] = {
                    'model': model,
                    'feature_names': model_record.feature_names,
                    'scaler': StandardScaler()  # Would load actual scaler
                }
                logger.info(f"Loaded model for {business_type}")
            except Exception as e:
                logger.error(f"Failed to load model: {e}")
    
    def _generate_insights(self, features: Dict, score: float, business_type: str) -> Dict:
        """Generate human-readable insights"""
        
        insights = {
            'key_points': [],
            'recommendations': [],
            'risks': [],
            'opportunities': []
        }
        
        # Competition analysis
        competitors = features.get('competitors_500m', 0)
        if competitors == 0:
            insights['opportunities'].append("Hiç rakip yok - ilk mover advantage")
        elif competitors > 10:
            insights['risks'].append(f"Yüksek rekabet: {competitors} rakip 500m içinde")
        
        # Market quality
        avg_rating = features.get('avg_competitor_rating_500m', 0)
        if avg_rating >= 4.0:
            insights['key_points'].append("Yüksek kalite bölgesi - müşteri beklentileri yüksek")
        elif avg_rating <= 3.0:
            insights['opportunities'].append("Düşük kalite rakipler - farkınızı ortaya koyun")
        
        # Accessibility
        accessibility = features.get('accessibility_score', 0)
        if accessibility < 0.3:
            insights['risks'].append("Zayıf erişilebilirlik")
            insights['recommendations'].append("Ulaşım ve park imkanlarını değerlendirin")
        
        # Tourism factor
        tourism = features.get('tourism_factor', 0)
        if tourism > 0.6:
            insights['opportunities'].append("Yüksek turizm potansiyeli")
            insights['recommendations'].append("Turistlere yönelik hizmet stratejileri geliştirin")
        
        # Score-based insights
        if score >= 8.0:
            insights['key_points'].append("Mükemmel konum potansiyeli")
        elif score >= 6.0:
            insights['key_points'].append("İyi konum potansiyeli")
            insights['recommendations'].append("Doğru konsept ile başarılı olabilirsiniz")
        else:
            insights['risks'].append("Düşük potansiyel - detaylı değerlendirme gerekli")
            insights['recommendations'].append("Alternative lokasyonları değerlendirin")
        
        return insights
    
    def _calculate_component_score(self, features: Dict, component: str) -> float:
        """Calculate component-specific scores"""
        
        if component == 'competition':
            competitors = features.get('competitors_500m', 0)
            if competitors == 0:
                return 10.0
            elif competitors <= 3:
                return 8.0
            elif competitors <= 7:
                return 6.0
            elif competitors <= 15:
                return 4.0
            else:
                return 2.0
                
        elif component == 'traffic':
            total_reviews = features.get('total_area_reviews', 0)
            engagement = features.get('market_engagement', 0)
            return min(10, (np.log(total_reviews + 1) / np.log(1000)) * 8 + engagement * 2)
            
        elif component == 'demographic':
            tourism = features.get('tourism_factor', 0.3)
            income = features.get('avg_income_estimate', 40000)
            return min(10, tourism * 5 + (income / 10000))
            
        elif component == 'environmental':
            parks = min(features.get('nearby_parks', 0), 5)
            cultural = min(features.get('cultural_attractions', 0), 3)
            return min(10, parks * 1.5 + cultural * 2.0 + 2.0)
        
        return 5.0  # Default
    
    def _get_feature_importance(self, model, feature_names) -> Dict:
        """Get feature importance from model"""
        try:
            if hasattr(model, 'feature_importances_'):
                importances = model.feature_importances_
                return dict(zip(feature_names, importances.tolist()))
            else:
                return {}
        except:
            return {}
    
    def _get_feature_importance_for_prediction(self, model, feature_names) -> Dict:
        """Get top feature importances for this prediction"""
        importance_dict = self._get_feature_importance(model, feature_names)
        
        # Return top 10 features
        sorted_features = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
        return dict(sorted_features[:10])

# Initialize global instances
feature_engineer = FeatureEngineer()
sentiment_analyzer = SentimentAnalyzer()
scoring_model = LocationScoringModel()