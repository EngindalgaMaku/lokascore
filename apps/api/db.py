from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from geoalchemy2 import load_spatialite  # not used with PostGIS but keeps geo types available
from typing import Generator
from .config import settings

class Base(DeclarativeBase):
    pass

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_postgis_and_schema():
    with engine.connect() as conn:
        # Enable PostGIS extension (safe if already exists)
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        conn.commit()
