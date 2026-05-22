"""Test data constants for football API fixtures."""

MOCK_CLUBS = [
    {"id": 1, "name": "Real Madrid", "league_id": 1, "league_name": "La Liga"},
    {"id": 2, "name": "Barcelona", "league_id": 1, "league_name": "La Liga"},
    {"id": 3, "name": "Atletico Madrid", "league_id": 1, "league_name": "La Liga"},
    {"id": 4, "name": "Sevilla", "league_id": 1, "league_name": "La Liga"},
    {"id": 5, "name": "Valencia", "league_id": 1, "league_name": "La Liga"},
    {
        "id": 6,
        "name": "Manchester United",
        "league_id": 2,
        "league_name": "Premier League",
    },
    {"id": 7, "name": "Liverpool", "league_id": 2, "league_name": "Premier League"},
    {
        "id": 8,
        "name": "Manchester City",
        "league_id": 2,
        "league_name": "Premier League",
    },
    {"id": 9, "name": "Chelsea", "league_id": 2, "league_name": "Premier League"},
    {"id": 10, "name": "Arsenal", "league_id": 2, "league_name": "Premier League"},
    {"id": 11, "name": "Bayern Munich", "league_id": 3, "league_name": "Bundesliga"},
    {
        "id": 12,
        "name": "Borussia Dortmund",
        "league_id": 3,
        "league_name": "Bundesliga",
    },
    {"id": 13, "name": "RB Leipzig", "league_id": 3, "league_name": "Bundesliga"},
    {"id": 14, "name": "Bayer Leverkusen", "league_id": 3, "league_name": "Bundesliga"},
    {
        "id": 15,
        "name": "Eintracht Frankfurt",
        "league_id": 3,
        "league_name": "Bundesliga",
    },
    {"id": 16, "name": "Juventus", "league_id": 4, "league_name": "Serie A"},
    {"id": 17, "name": "AC Milan", "league_id": 4, "league_name": "Serie A"},
    {"id": 18, "name": "Inter Milan", "league_id": 4, "league_name": "Serie A"},
    {"id": 19, "name": "Napoli", "league_id": 4, "league_name": "Serie A"},
    {"id": 20, "name": "Roma", "league_id": 4, "league_name": "Serie A"},
    {"id": 21, "name": "Inter Miami", "league_id": 5, "league_name": "MLS"},
    {"id": 22, "name": "Al-Nassr", "league_id": 6, "league_name": "Saudi Pro League"},
]

MOCK_NATIONS = [
    {"id": 1, "name": "Spain"},
    {"id": 2, "name": "Brazil"},
    {"id": 3, "name": "Argentina"},
    {"id": 4, "name": "France"},
    {"id": 5, "name": "Germany"},
    {"id": 6, "name": "Italy"},
    {"id": 7, "name": "England"},
    {"id": 8, "name": "Portugal"},
    {"id": 9, "name": "Netherlands"},
    {"id": 10, "name": "Uruguay"},
]

MOCK_LEAGUES = [
    {"id": 1, "name": "La Liga"},
    {"id": 2, "name": "Premier League"},
    {"id": 3, "name": "Bundesliga"},
    {"id": 4, "name": "Serie A"},
    {"id": 5, "name": "MLS"},
    {"id": 6, "name": "Saudi Pro League"},
]

MOCK_POSITIONS = [
    {"code": "GK", "name": "Goalkeeper"},
    {"code": "DEF", "name": "Defender"},
    {"code": "MID", "name": "Midfielder"},
    {"code": "FWD", "name": "Forward"},
]
