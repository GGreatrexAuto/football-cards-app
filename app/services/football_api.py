"""Football-Data.org API integration with mock fallback."""

import logging
from typing import Any

import httpx

from app.core.config import settings
from app.services.test_data import (
    MOCK_CLUBS,
    MOCK_LEAGUES,
    MOCK_NATIONS,
    MOCK_POSITIONS,
)

logger = logging.getLogger(__name__)


def _auth_headers() -> dict[str, str]:
    return {"X-Auth-Token": settings.football_data_api_key}


async def get_clubs() -> list[dict[str, Any]]:
    """Retrieve all football clubs from configured competitions.

    Returns:
        List of club dicts with id, name, and league_id.
        Falls back to mock data if no API key is set or the request fails.
    """
    if not settings.football_data_api_key:
        return MOCK_CLUBS
    try:
        codes = [c.strip() for c in settings.football_data_competitions.split(",")]
        clubs: list[dict[str, Any]] = []
        async with httpx.AsyncClient(timeout=10.0) as client:
            for code in codes:
                resp = await client.get(
                    f"{settings.football_data_api_url}/competitions/{code}/teams",
                    headers=_auth_headers(),
                )
                resp.raise_for_status()
                data = resp.json()
                league_id: int = data["competition"]["id"]
                for team in data.get("teams", []):
                    clubs.append(
                        {"id": team["id"], "name": team["name"], "league_id": league_id}
                    )
        return clubs
    except Exception:  # pylint: disable=broad-exception-caught
        logger.warning("External API unavailable for clubs; using mock data")
        return MOCK_CLUBS


async def get_nations() -> list[dict[str, Any]]:
    """Retrieve all nations/areas from the Football-Data.org areas endpoint.

    Returns:
        List of nation dicts with id and name.
        Falls back to mock data if no API key is set or the request fails.
    """
    if not settings.football_data_api_key:
        return MOCK_NATIONS
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{settings.football_data_api_url}/areas",
                headers=_auth_headers(),
            )
            resp.raise_for_status()
            data = resp.json()
            return [
                {"id": area["id"], "name": area["name"]}
                for area in data.get("areas", [])
                if area.get("countryCode")
            ]
    except Exception:  # pylint: disable=broad-exception-caught
        logger.warning("External API unavailable for nations; using mock data")
        return MOCK_NATIONS


async def get_leagues() -> list[dict[str, Any]]:
    """Retrieve all competitions/leagues from Football-Data.org.

    Returns:
        List of league dicts with id and name.
        Falls back to mock data if no API key is set or the request fails.
    """
    if not settings.football_data_api_key:
        return MOCK_LEAGUES
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{settings.football_data_api_url}/competitions",
                headers=_auth_headers(),
            )
            resp.raise_for_status()
            data = resp.json()
            return [
                {"id": comp["id"], "name": comp["name"]}
                for comp in data.get("competitions", [])
            ]
    except Exception:  # pylint: disable=broad-exception-caught
        logger.warning("External API unavailable for leagues; using mock data")
        return MOCK_LEAGUES


async def get_positions() -> list[dict[str, Any]]:
    """Return available player positions.

    Returns:
        List of position dicts with code and name.
    """
    return MOCK_POSITIONS
