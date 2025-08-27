from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Text, Boolean, 
    JSON, ForeignKey, Index, UniqueConstraint
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from .db import Base
import enum
from sqlalchemy import Enum

class BusinessType(enum.Enum):
    RESTAURANT = "restaurant"
    CAFE = "cafe"
    RETAIL = "retail"
    HOTEL = "hotel"
    BANK = "bank"
    HOSPITAL = "hospital"
    SCHOOL = "school"
    PARK = "park"
    PHARMACY = "pharmacy"
    GAS_STATION = "gas_station"
    SHOPPING_MALL = "shopping_mall"
    MUSEUM = "museum"
    MOSQUE = "mosque"
    CHURCH = "church"
    GOVERNMENT = "government"
    OTHER = "other"

class ScrapingStatus(enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress" 
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"

class Region(Base):
    """Geographic regions for focused data collection (e.g., Kaleiçi)"""
    __tablename__ = "regions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    # Polygon geometry for the region boundary
    boundary = Column(Geometry(geometry_type="POLYGON", srid=4326), nullable=False)
    center_point = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)
    
    # Metadata
    city = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=True)
    country = Column(String(100), default="TR")
    
    # Status
    is_active = Column(Boolean, default=True)
    scraping_priority = Column(Integer, default=1)  # 1=highest, 5=lowest
    last_scraped = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    businesses = relationship("Business", back_populates="region")
    scraping_jobs = relationship("ScrapingJob", back_populates="region")

class Business(Base):
    """Comprehensive business information from Google Maps"""
    __tablename__ = "businesses"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Info
    google_place_id = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    business_type = Column(Enum(BusinessType), nullable=False, index=True)
    category = Column(String(100))  # Google's category
    subcategory = Column(String(100))  # More specific category
    
    # Contact & Location
    address = Column(String(500))
    phone = Column(String(50))
    website = Column(String(500))
    email = Column(String(255))
    
    # Geographic
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False, index=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True, index=True)
    
    # Google Data
    rating = Column(Float)
    review_count = Column(Integer, default=0)
    price_level = Column(Integer)  # 1-4 scale from Google
    google_url = Column(String(1000))
    
    # Operating Hours (JSON format)
    hours = Column(JSON)  # {"monday": {"open": "09:00", "close": "22:00"}, ...}
    
    # Features & Amenities
    features = Column(JSON)  # ["wifi", "parking", "wheelchair_accessible", ...]
    photos_count = Column(Integer, default=0)
    
    # Business Intelligence
    is_chain = Column(Boolean, default=False)
    chain_name = Column(String(255))
    estimated_employees = Column(Integer)
    estimated_revenue_range = Column(String(50))  # "10K-50K", "50K-100K", etc.
    
    # Scraping Metadata
    source = Column(String(64), default="google_maps")
    last_scraped = Column(DateTime(timezone=True))
    scraping_attempts = Column(Integer, default=0)
    data_completeness = Column(Float, default=0.0)  # 0-1 score
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    region = relationship("Region", back_populates="businesses")
    reviews = relationship("BusinessReview", back_populates="business", cascade="all, delete-orphan")
    photos = relationship("BusinessPhoto", back_populates="business", cascade="all, delete-orphan")
    environmental_features = relationship("EnvironmentalFeature", back_populates="business")

class BusinessReview(Base):
    """Google Reviews data for sentiment analysis"""
    __tablename__ = "business_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False, index=True)
    
    # Review Data
    google_review_id = Column(String(255), unique=True)
    author_name = Column(String(255))
    author_photo_url = Column(String(1000))
    rating = Column(Integer, nullable=False)  # 1-5 stars
    text = Column(Text)
    
    # Dates
    published_at = Column(DateTime(timezone=True))
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # AI Analysis Results
    sentiment_score = Column(Float)  # -1 to 1 (negative to positive)
    sentiment_label = Column(String(20))  # "positive", "negative", "neutral"
    topics = Column(JSON)  # ["food_quality", "service", "atmosphere", ...]
    keywords = Column(JSON)  # extracted keywords
    
    # Language & Processing
    language = Column(String(10), default="tr")
    is_processed = Column(Boolean, default=False)
    
    # Relationships
    business = relationship("Business", back_populates="reviews")

class BusinessPhoto(Base):
    """Photos from Google Maps for visual analysis"""
    __tablename__ = "business_photos"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False, index=True)
    
    # Photo Data
    google_photo_id = Column(String(255), unique=True)
    url = Column(String(1000), nullable=False)
    local_path = Column(String(500))  # stored locally after download
    width = Column(Integer)
    height = Column(Integer)
    file_size = Column(Integer)
    
    # Classification
    photo_type = Column(String(50))  # "exterior", "interior", "food", "menu", etc.
    ai_labels = Column(JSON)  # AI-detected objects/features
    ai_confidence = Column(Float)
    
    # Processing Status
    is_downloaded = Column(Boolean, default=False)
    is_processed = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    business = relationship("Business", back_populates="photos")

class EnvironmentalFeature(Base):
    """Environmental and contextual features around businesses"""
    __tablename__ = "environmental_features"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False, index=True)
    
    # Feature Type
    feature_type = Column(String(100), nullable=False, index=True)
    # Types: "transportation", "landmark", "natural", "demographic", "infrastructure"
    
    feature_name = Column(String(255))
    description = Column(Text)
    
    # Spatial
    distance_meters = Column(Float)
    direction = Column(String(10))  # "N", "S", "E", "W", "NE", etc.
    
    # Feature Properties
    properties = Column(JSON)  # flexible properties for different feature types
    
    # Impact Scoring
    impact_score = Column(Float)  # -1 to 1 (negative to positive impact)
    weight = Column(Float, default=1.0)  # importance weight
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    business = relationship("Business", back_populates="environmental_features")

class ScrapingJob(Base):
    """Track Google Maps scraping operations"""
    __tablename__ = "scraping_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True, index=True)
    
    # Job Configuration
    job_name = Column(String(255), nullable=False)
    job_type = Column(String(50))  # "business_discovery", "detail_scraping", "review_scraping"
    target_business_types = Column(JSON)  # list of business types to scrape
    max_results = Column(Integer, default=1000)
    
    # Search Parameters
    search_query = Column(String(500))
    search_radius = Column(Integer)  # meters
    center_point = Column(Geometry(geometry_type="POINT", srid=4326))
    
    # Status & Progress
    status = Column(Enum(ScrapingStatus), default=ScrapingStatus.PENDING, index=True)
    progress_percentage = Column(Float, default=0.0)
    businesses_found = Column(Integer, default=0)
    businesses_processed = Column(Integer, default=0)
    errors_count = Column(Integer, default=0)
    
    # Timing
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    estimated_duration = Column(Integer)  # seconds
    
    # Results & Logs
    results_summary = Column(JSON)
    error_log = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    region = relationship("Region", back_populates="scraping_jobs")

class MLModel(Base):
    """ML models for location scoring and prediction"""
    __tablename__ = "ml_models"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Model Info
    name = Column(String(255), nullable=False)
    model_type = Column(String(100))  # "location_scoring", "success_prediction", etc.
    algorithm = Column(String(100))  # "xgboost", "random_forest", etc.
    version = Column(String(50))
    
    # Training Data
    training_data_size = Column(Integer)
    feature_count = Column(Integer)
    training_region_ids = Column(JSON)  # regions used for training
    
    # Performance Metrics
    accuracy = Column(Float)
    precision = Column(Float)
    recall = Column(Float)
    f1_score = Column(Float)
    cross_validation_score = Column(Float)
    
    # Model Files
    model_file_path = Column(String(500))
    feature_names = Column(JSON)
    feature_importance = Column(JSON)
    
    # Status
    is_active = Column(Boolean, default=False)
    is_production = Column(Boolean, default=False)
    
    # Metadata
    hyperparameters = Column(JSON)
    training_notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    trained_at = Column(DateTime(timezone=True))
    deployed_at = Column(DateTime(timezone=True))

class Analysis(Base):
    """Analysis results for locations"""
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Location
    location_name = Column(String(255))
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False, index=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True)
    
    # Analysis Parameters
    business_type = Column(Enum(BusinessType), nullable=False)
    analysis_radius = Column(Integer, default=500)  # meters
    ml_model_id = Column(Integer, ForeignKey("ml_models.id"), nullable=True)
    
    # Results
    overall_score = Column(Float, nullable=False)  # 0-10 scale
    confidence_score = Column(Float)  # 0-1 scale
    
    # Detailed Scores
    competition_score = Column(Float)
    foot_traffic_score = Column(Float)
    accessibility_score = Column(Float)
    demographic_score = Column(Float)
    environmental_score = Column(Float)
    
    # Insights
    key_insights = Column(JSON)  # list of key insights
    recommendations = Column(JSON)  # list of recommendations
    risk_factors = Column(JSON)  # potential risks
    opportunities = Column(JSON)  # opportunities
    
    # Data Quality
    data_completeness = Column(Float, default=0.0)  # 0-1 score
    businesses_analyzed = Column(Integer, default=0)
    
    # Metadata
    analysis_version = Column(String(50))
    processing_time_ms = Column(Integer)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    region = relationship("Region")
    ml_model = relationship("MLModel")

# Indexes for performance
Index("idx_businesses_location", Business.geom)
Index("idx_businesses_type_rating", Business.business_type, Business.rating)
Index("idx_reviews_business_rating", BusinessReview.business_id, BusinessReview.rating)
Index("idx_environmental_distance", EnvironmentalFeature.feature_type, EnvironmentalFeature.distance_meters)

# Legacy model for backward compatibility
class Place(Base):
    """Legacy model - kept for backward compatibility"""
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(64), nullable=False, index=True)
    rating = Column(Float, nullable=True)
    review_count = Column(Integer, nullable=True)
    source = Column(String(64), nullable=True, default="seed")
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
