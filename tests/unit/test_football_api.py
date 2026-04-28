import pytest

from app.services.football_api import get_clubs, get_leagues, get_nations
from app.services.test_data import MOCK_CLUBS, MOCK_LEAGUES, MOCK_NATIONS


@pytest.mark.asyncio
async def test_get_clubs():
    """
    Tests that the get_clubs function returns the expected data.
    """
    clubs = await get_clubs()
    assert clubs == MOCK_CLUBS


@pytest.mark.asyncio
async def test_get_nations():
    """
    Tests that the get_nations function returns the expected data.
    """
    nations = await get_nations()
    assert nations == MOCK_NATIONS


@pytest.mark.asyncio
async def test_get_leagues():
    """
    Tests that the get_leagues function returns the expected data.
    """
    leagues = await get_leagues()
    assert leagues == MOCK_LEAGUES
