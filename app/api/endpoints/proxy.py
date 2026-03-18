from typing import List

from fastapi import APIRouter

from app.api import models
from app.services import football_api

router = APIRouter()


@router.get("/clubs", response_model=List[models.Club])
async def get_clubs():
    return await football_api.get_clubs()


@router.get("/nations", response_model=List[models.Nation])
async def get_nations():
    return await football_api.get_nations()


@router.get("/leagues", response_model=List[models.League])
async def get_leagues():
    return await football_api.get_leagues()
