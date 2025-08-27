from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="LOKASCORE API",
    version="2.0.0",
    description="🎯 AI-powered location analysis platform",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "🎯 Welcome to LOKASCORE API v2.0",
        "description": "AI-powered location analysis platform",
        "documentation": "/docs",
        "status": "healthy",
        "database": "Not connected (standalone mode)"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "service": "LOKASCORE API",
        "mode": "standalone"
    }

@app.get("/api/analyze")
def analyze():
    return {
        "message": "Analysis endpoint - coming soon",
        "features": ["Location scoring", "Sentiment analysis", "ML predictions"]
    }

# Regions endpoints
@app.get("/regions/list")
def regions_list():
    return [
        {
            "id": 1,
            "name": "Kaleiçi, Antalya",
            "status": "active",
            "businesses_count": 156,
            "last_updated": "2025-01-15T10:30:00Z"
        },
        {
            "id": 2,
            "name": "Kadıköy, İstanbul",
            "status": "active",
            "businesses_count": 324,
            "last_updated": "2025-01-14T16:45:00Z"
        },
        {
            "id": 3,
            "name": "Beşiktaş, İstanbul",
            "status": "active",
            "businesses_count": 198,
            "last_updated": "2025-01-13T09:20:00Z"
        },
        {
            "id": 4,
            "name": "Çankaya, Ankara",
            "status": "updating",
            "businesses_count": 142,
            "last_updated": "2025-01-12T13:45:00Z"
        }
    ]

@app.get("/regions/{region_id}/stats")
def region_stats(region_id: int):
    return {
        "success": True,
        "stats": {
            "total_businesses": 156,
            "active_businesses": 142,
            "average_rating": 4.2,
            "last_analysis": "2025-01-15T10:30:00Z"
        }
    }

# Scraping endpoints
@app.get("/scraping/stats")
def scraping_stats():
    return {
        "success": True,
        "total_businesses_scraped": 1247,
        "active_scraping_jobs": 3,
        "completed_scraping_jobs": 89,
        "last_run": "2025-01-15T14:20:00Z"
    }

@app.get("/scraping/jobs")
def scraping_jobs(limit: int = 10):
    return {
        "success": True,
        "jobs": [
            {
                "id": 1,
                "name": "Kaleiçi Restaurant Scraping",
                "status": "completed",
                "created_at": "2025-01-15T10:00:00Z",
                "completed_at": "2025-01-15T10:30:00Z",
                "records_collected": 156
            },
            {
                "id": 2,
                "name": "Kadıköy Cafe Scraping",
                "status": "running",
                "created_at": "2025-01-15T14:00:00Z",
                "records_collected": 89
            }
        ]
    }

# ML endpoints
@app.get("/ml/models")
def ml_models():
    return [
        {
            "id": 1,
            "name": "Location Scorer v2.1",
            "status": "active",
            "accuracy": 0.89,
            "last_trained": "2025-01-10T12:00:00Z"
        },
        {
            "id": 2,
            "name": "Sentiment Analyzer v1.3",
            "status": "active",
            "accuracy": 0.92,
            "last_trained": "2025-01-08T09:00:00Z"
        },
        {
            "id": 3,
            "name": "Traffic Pattern Analyzer",
            "status": "active",
            "accuracy": 0.85,
            "last_trained": "2025-01-05T14:30:00Z"
        },
        {
            "id": 4,
            "name": "Competitor Density Model",
            "status": "active",
            "accuracy": 0.88,
            "last_trained": "2025-01-03T11:15:00Z"
        },
        {
            "id": 5,
            "name": "Foot Traffic Predictor",
            "status": "training",
            "accuracy": 0.83,
            "last_trained": "2024-12-28T16:45:00Z"
        }
    ]