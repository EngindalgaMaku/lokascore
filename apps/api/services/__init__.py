from .google_scraper import GoogleMapsScraper, ScrapingOrchestrator, ScrapingConfig
from .ml_pipeline import FeatureEngineer, SentimentAnalyzer, LocationScoringModel, feature_engineer, sentiment_analyzer, scoring_model

# Initialize default scraper configuration
default_config = ScrapingConfig(
    google_api_key=None,  # Set from environment variables
    max_businesses_per_search=200,
    max_reviews_per_business=50,
    delay_between_requests=1.0,
    selenium_headless=True
)

# Global scraper instance
scraper = GoogleMapsScraper(default_config)
orchestrator = ScrapingOrchestrator(default_config)

# ML services are already initialized in ml_pipeline.py
# feature_engineer, sentiment_analyzer, scoring_model