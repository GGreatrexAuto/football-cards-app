from app.services.test_data import MOCK_CLUBS, MOCK_LEAGUES, MOCK_NATIONS


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
    return MOCK_CLUBS


async def get_nations():
    # Placeholder
    return MOCK_NATIONS


async def get_leagues():
    # Placeholder
    return MOCK_LEAGUES
