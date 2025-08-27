from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from db import Base, engine, ensure_postgis_and_schema
import models  # noqa: F401  # ensure models are imported for metadata
from routers import analyze, scraping, ml_analysis, regions

app = FastAPI(
    title="LOKASCORE API",
    version="2.0.0",
    description="🎯 AI-powered location analysis platform for data-driven business decisions",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    ensure_postgis_and_schema()
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "service": "LOKASCORE API",
        "features": [
            "Google Maps Data Scraping",
            "AI/ML Location Analysis",
            "Region Management",
            "Sentiment Analysis",
            "Location Scoring"
        ]
    }

@app.get("/")
def root():
    return {
        "message": "🎯 Welcome to LOKASCORE API v2.0",
        "description": "AI-powered location analysis platform for data-driven business decisions",
        "documentation": "/docs",
        "endpoints": {
            "analyze": "/analyze - Location analysis endpoints",
            "scraping": "/scraping - Google Maps data collection",
            "ml": "/ml - AI/ML analysis and model training",
            "regions": "/regions - Geographic region management"
        },
        "pilot_project": "Kaleiçi, Antalya - Turkey's first AI location analysis"
    }

# Include all routers
app.include_router(analyze.router)
app.include_router(scraping.router)
app.include_router(ml_analysis.router)
app.include_router(regions.router)
