import pytest

from app.services import football_api


@pytest.mark.asyncio
async def test_get_clubs():
    clubs = await football_api.get_clubs()
    assert isinstance(clubs, list)
    assert len(clubs) > 0
    assert "id" in clubs[0]
    assert "name" in clubs[0]


@pytest.mark.asyncio
async def test_get_nations():
    nations = await football_api.get_nations()
    assert isinstance(nations, list)
    assert len(nations) > 0
    assert "id" in nations[0]
    assert "name" in nations[0]


@pytest.mark.asyncio
async def test_get_leagues():
    leagues = await football_api.get_leagues()
    assert isinstance(leagues, list)
    assert len(leagues) > 0
    assert "id" in leagues[0]
    assert "name" in leagues[0]
