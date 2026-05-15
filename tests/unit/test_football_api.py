"""Unit tests for football_api service."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.services.football_api import get_clubs, get_leagues, get_nations
from app.services.test_data import MOCK_CLUBS, MOCK_LEAGUES, MOCK_NATIONS


def _make_response(json_data: dict) -> MagicMock:
    resp = MagicMock()
    resp.raise_for_status = MagicMock()
    resp.json.return_value = json_data
    return resp


def _make_client_mock(responses: list) -> tuple[MagicMock, AsyncMock]:
    """Return (MockClass, mock_client) where MockClass() is an async context manager."""
    mock_client = AsyncMock()
    mock_client.get = AsyncMock(side_effect=responses)
    mock_class = MagicMock()
    mock_class.return_value.__aenter__ = AsyncMock(return_value=mock_client)
    mock_class.return_value.__aexit__ = AsyncMock(return_value=False)
    return mock_class, mock_client


# ---------------------------------------------------------------------------
# get_leagues
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_leagues_no_api_key_returns_mock():
    """No API key configured → return mock data without any HTTP call."""
    with patch("app.services.football_api.settings") as mock_settings:
        mock_settings.football_data_api_key = ""
        result = await get_leagues()
    assert result == MOCK_LEAGUES


@pytest.mark.asyncio
async def test_get_leagues_transforms_api_response():
    """Valid API key → fetch competitions and transform to id/name dicts."""
    api_response = _make_response(
        {
            "competitions": [
                {"id": 2021, "name": "Premier League"},
                {"id": 2014, "name": "La Liga"},
            ]
        }
    )
    mock_class, _ = _make_client_mock([api_response])

    with patch("app.services.football_api.settings") as mock_settings, patch(
        "app.services.football_api.httpx.AsyncClient", mock_class
    ):
        mock_settings.football_data_api_key = "test-key"
        mock_settings.football_data_api_url = "https://api.football-data.org/v4"
        result = await get_leagues()

    assert result == [
        {"id": 2021, "name": "Premier League"},
        {"id": 2014, "name": "La Liga"},
    ]


@pytest.mark.asyncio
async def test_get_leagues_api_error_falls_back_to_mock():
    """HTTP error → log warning and return mock data."""
    mock_class, _ = _make_client_mock([Exception("timeout")])

    with patch("app.services.football_api.settings") as mock_settings, patch(
        "app.services.football_api.httpx.AsyncClient", mock_class
    ):
        mock_settings.football_data_api_key = "test-key"
        mock_settings.football_data_api_url = "https://api.football-data.org/v4"
        result = await get_leagues()

    assert result == MOCK_LEAGUES


# ---------------------------------------------------------------------------
# get_nations
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_nations_no_api_key_returns_mock():
    with patch("app.services.football_api.settings") as mock_settings:
        mock_settings.football_data_api_key = ""
        result = await get_nations()
    assert result == MOCK_NATIONS


@pytest.mark.asyncio
async def test_get_nations_filters_to_countries_only():
    """Areas without countryCode (e.g. continents) are excluded."""
    api_response = _make_response(
        {
            "areas": [
                {"id": 2072, "name": "England", "countryCode": "ENG"},
                {"id": 2001, "name": "Europe", "countryCode": None},
                {"id": 2088, "name": "Germany", "countryCode": "DEU"},
            ]
        }
    )
    mock_class, _ = _make_client_mock([api_response])

    with patch("app.services.football_api.settings") as mock_settings, patch(
        "app.services.football_api.httpx.AsyncClient", mock_class
    ):
        mock_settings.football_data_api_key = "test-key"
        mock_settings.football_data_api_url = "https://api.football-data.org/v4"
        result = await get_nations()

    assert result == [
        {"id": 2072, "name": "England"},
        {"id": 2088, "name": "Germany"},
    ]


@pytest.mark.asyncio
async def test_get_nations_api_error_falls_back_to_mock():
    mock_class, _ = _make_client_mock([Exception("connection refused")])

    with patch("app.services.football_api.settings") as mock_settings, patch(
        "app.services.football_api.httpx.AsyncClient", mock_class
    ):
        mock_settings.football_data_api_key = "test-key"
        mock_settings.football_data_api_url = "https://api.football-data.org/v4"
        result = await get_nations()

    assert result == MOCK_NATIONS


# ---------------------------------------------------------------------------
# get_clubs
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_clubs_no_api_key_returns_mock():
    with patch("app.services.football_api.settings") as mock_settings:
        mock_settings.football_data_api_key = ""
        result = await get_clubs()
    assert result == MOCK_CLUBS


@pytest.mark.asyncio
async def test_get_clubs_transforms_api_response():
    """Teams from one competition are transformed with league_id from competition.id."""
    api_response = _make_response(
        {
            "competition": {"id": 2021},
            "teams": [
                {"id": 57, "name": "Arsenal FC"},
                {"id": 61, "name": "Chelsea FC"},
            ],
        }
    )
    mock_class, _ = _make_client_mock([api_response])

    with patch("app.services.football_api.settings") as mock_settings, patch(
        "app.services.football_api.httpx.AsyncClient", mock_class
    ):
        mock_settings.football_data_api_key = "test-key"
        mock_settings.football_data_api_url = "https://api.football-data.org/v4"
        mock_settings.football_data_competitions = "PL"
        result = await get_clubs()

    assert result == [
        {"id": 57, "name": "Arsenal FC", "league_id": 2021},
        {"id": 61, "name": "Chelsea FC", "league_id": 2021},
    ]


@pytest.mark.asyncio
async def test_get_clubs_multiple_competitions():
    """Teams are aggregated from each competition with correct league_id."""
    pl_response = _make_response(
        {
            "competition": {"id": 2021},
            "teams": [{"id": 57, "name": "Arsenal FC"}],
        }
    )
    pd_response = _make_response(
        {
            "competition": {"id": 2014},
            "teams": [{"id": 86, "name": "Real Madrid CF"}],
        }
    )
    mock_class, _ = _make_client_mock([pl_response, pd_response])

    with patch("app.services.football_api.settings") as mock_settings, patch(
        "app.services.football_api.httpx.AsyncClient", mock_class
    ):
        mock_settings.football_data_api_key = "test-key"
        mock_settings.football_data_api_url = "https://api.football-data.org/v4"
        mock_settings.football_data_competitions = "PL,PD"
        result = await get_clubs()

    assert result == [
        {"id": 57, "name": "Arsenal FC", "league_id": 2021},
        {"id": 86, "name": "Real Madrid CF", "league_id": 2014},
    ]


@pytest.mark.asyncio
async def test_get_clubs_api_error_falls_back_to_mock():
    mock_class, _ = _make_client_mock([Exception("503 Service Unavailable")])

    with patch("app.services.football_api.settings") as mock_settings, patch(
        "app.services.football_api.httpx.AsyncClient", mock_class
    ):
        mock_settings.football_data_api_key = "test-key"
        mock_settings.football_data_api_url = "https://api.football-data.org/v4"
        mock_settings.football_data_competitions = "PL"
        result = await get_clubs()

    assert result == MOCK_CLUBS
