from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session
from ..db import get_db

router = APIRouter(prefix="/analyze", tags=["analyze"])

class BasicAnalyzeResponse(BaseModel):
    competitors_250m: int
    competitors_500m: int
    nearby_schools: int
    nearby_parks: int
    summary: str

@router.get("/basic", response_model=BasicAnalyzeResponse)
def analyze_basic(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: int = Query(500, description="Radius meters for main analysis"),
    type: str = Query("cafe", description="Business type to analyze"),
    db: Session = Depends(get_db),
):
    # Use geography for accurate meter-based buffers
    sql = text(
        """
        WITH point AS (
            SELECT ST_SetSRID(ST_MakePoint(:lng, :lat), 4326) AS geom
        ),
        buf250 AS (
            SELECT ST_Buffer(ST_Transform(geom, 3857), 250) AS g FROM point
        ),
        buf500 AS (
            SELECT ST_Buffer(ST_Transform(geom, 3857), 500) AS g FROM point
        )
        SELECT
            -- competitors in 250m
            (SELECT COUNT(*) FROM places p, buf250 b
             WHERE p.category = :type AND ST_Intersects(ST_Transform(p.geom, 3857), b.g)) AS comp_250,
            -- competitors in 500m
            (SELECT COUNT(*) FROM places p, buf500 b
             WHERE p.category = :type AND ST_Intersects(ST_Transform(p.geom, 3857), b.g)) AS comp_500,
            -- schools in 500m
            (SELECT COUNT(*) FROM places p, buf500 b
             WHERE p.category = 'school' AND ST_Intersects(ST_Transform(p.geom, 3857), b.g)) AS school_cnt,
            -- parks in 500m
            (SELECT COUNT(*) FROM places p, buf500 b
             WHERE p.category = 'park' AND ST_Intersects(ST_Transform(p.geom, 3857), b.g)) AS park_cnt;
        """
    )
    row = db.execute(sql, {"lat": lat, "lng": lng, "type": type}).one()
    comp250, comp500, schools, parks = row
    summary = f"Bu alanda {comp500} {type}, {schools} okul, {parks} park bulunmaktadır."
    return BasicAnalyzeResponse(
        competitors_250m=comp250,
        competitors_500m=comp500,
        nearby_schools=schools,
        nearby_parks=parks,
        summary=summary,
    )
