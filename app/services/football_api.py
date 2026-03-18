from functools import lru_cache


@lru_cache(maxsize=128)
async def get_clubs():
    # This is a placeholder. In a real application, you would make a
    # request to the external API.
    # async with httpx.AsyncClient() as client:
    #     response = await client.get(
    #         f"{settings.external_api_url}/clubs",
    #         headers={"X-API-KEY": settings.external_api_key}
    #     )
    #     response.raise_for_status()
    #     return response.json()
    return [{"id": "1", "name": "Real Madrid"}, {"id": "2", "name": "Barcelona"}]


@lru_cache(maxsize=128)
async def get_nations():
    # Placeholder
    return [{"id": "1", "name": "Spain"}, {"id": "2", "name": "Brazil"}]


@lru_cache(maxsize=128)
async def get_leagues():
    # Placeholder
    return [{"id": "1", "name": "La Liga"}, {"id": "2", "name": "Premier League"}]
