from typing import List

from fastapi import APIRouter, HTTPException

from app.api import models
from app.services import football_api

router = APIRouter()


@router.get("/clubs", response_model=List[models.Club])
async def get_clubs():
    try:
        return await football_api.get_clubs()
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Service Unavailable") from exc


@router.get("/nations", response_model=List[models.Nation])
async def get_nations():
    try:
        return await football_api.get_nations()
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Service Unavailable") from exc


@router.get("/leagues", response_model=List[models.League])
async def get_leagues():
    try:
        return await football_api.get_leagues()
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Service Unavailable") from exc
