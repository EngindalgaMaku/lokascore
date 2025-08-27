import os
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://lokascore:lokascore@localhost:5432/lokascore")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

places = [
    # Cafes around Muratpaşa
    ("Cafe A", "cafe", 36.8899, 30.7065, 4.3, 128),
    ("Cafe B", "cafe", 36.8885, 30.7092, 4.1, 64),
    ("Cafe C", "cafe", 36.8912, 30.7110, 4.6, 210),
    ("Cafe D", "cafe", 36.8870, 30.7048, 3.9, 32),
    ("Cafe E", "cafe", 36.8930, 30.7080, 4.8, 420),
    # Schools
    ("School 1", "school", 36.8925, 30.7072, None, None),
    ("School 2", "school", 36.8865, 30.7105, None, None),
    # Parks
    ("Park 1", "park", 36.8905, 30.7035, None, None),
    ("Park 2", "park", 36.8950, 30.7095, None, None),
]

schema_sql = """
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE IF NOT EXISTS places (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  rating DOUBLE PRECISION NULL,
  review_count INTEGER NULL,
  source VARCHAR(64) NULL DEFAULT 'seed',
  geom geometry(POINT, 4326) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_places_geom ON places USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_places_category ON places (category);
"""

insert_sql = text(
    """
    INSERT INTO places (name, category, rating, review_count, geom)
    VALUES (:name, :cat, :rating, :rc, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326))
    ON CONFLICT DO NOTHING
    """
)

with engine.begin() as conn:
    conn.execute(text(schema_sql))
    for n, c, lat, lng, r, rc in places:
        conn.execute(insert_sql, {"name": n, "cat": c, "rating": r, "rc": rc, "lat": lat, "lng": lng})

print("Seed completed.")
