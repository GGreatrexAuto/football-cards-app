import pytest

from app.services.football_api import get_clubs, get_leagues, get_nations


@pytest.mark.asyncio
async def test_get_clubs():
    """
    Tests that the get_clubs function returns the expected data.
    """
    clubs = await get_clubs()
    assert clubs == [
        {"id": "1", "name": "Real Madrid"},
        {"id": "2", "name": "Barcelona"},
    ]


@pytest.mark.asyncio
async def test_get_nations():
    """
    Tests that the get_nations function returns the expected data.
    """
    nations = await get_nations()
    assert nations == [{"id": "1", "name": "Spain"}, {"id": "2", "name": "Brazil"}]


@pytest.mark.asyncio
async def test_get_leagues():
    """
    Tests that the get_leagues function returns the expected data.
    """
    leagues = await get_leagues()
    assert leagues == [
        {"id": "1", "name": "La Liga"},
        {"id": "2", "name": "Premier League"},
    ]
