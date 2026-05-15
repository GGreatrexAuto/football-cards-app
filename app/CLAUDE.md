# Backend (FastAPI) — Claude Code Context

Applies to all Python code under `app/`.

## Directory Layout

```
app/
├── main.py              # FastAPI app init, CORS middleware, router registration
├── api/
│   ├── models.py        # All Pydantic request/response models
│   └── endpoints/
│       └── proxy.py     # Route handlers (APIRouter)
├── core/
│   └── config.py        # Settings loaded from .env (see .env.example)
└── services/
    ├── football_api.py  # Football-Data.org integration — falls back to mock data if no key
    └── test_data.py     # Built-in mock data (fallback + test fixtures)
```

## Configuration & Environment

Settings are in `app/core/config.py` (pydantic-settings, reads `.env`):

| Variable | Default | Purpose |
|---|---|---|
| `FOOTBALL_DATA_API_KEY` | `""` (empty) | Football-Data.org v4 API key — empty = use mock data |
| `FOOTBALL_DATA_API_URL` | `https://api.football-data.org/v4` | Base URL |
| `FOOTBALL_DATA_COMPETITIONS` | `PL,PD,BL1,SA,FL1` | Leagues to fetch clubs from |

Copy `.env.example` to `.env` and set `FOOTBALL_DATA_API_KEY` to activate live data.

## Code Style

Run before every commit:
```bash
black .        # auto-format (line-length 88, configured in pyproject.toml)
isort .        # sort imports (black profile)
pylint app/    # fix all warnings
```

Import ordering (isort/black enforced):
1. Standard library
2. Third-party (`fastapi`, `pydantic`, …)
3. Local (`from app.core.config import settings`)

## Async/Await

All service functions **must** be `async def`. All route handlers **must** be `async def` and `await` their service calls.

```python
# services/football_api.py — calls Football-Data.org when key is set, else mock fallback
async def get_clubs() -> list[dict]:
    if not settings.football_data_api_key:
        return MOCK_CLUBS
    async with httpx.AsyncClient() as client:
        ...  # real HTTP call; exceptions caught → returns MOCK_CLUBS

# api/endpoints/proxy.py
@router.get("/clubs")
async def read_clubs() -> list[Club]:
    return await get_clubs()
```

## Pydantic Models

All models live in `app/api/models.py`. Inherit from `BaseModel`; every field must have a type hint.

```python
from pydantic import BaseModel

class Club(BaseModel):
    id: int
    name: str
    league_id: int
```

## Route Conventions

- Descriptive function names: `read_*`, `create_*`, `update_*`, `delete_*`
- Always `async def` with a one-line docstring
- Use `HTTPException` for error responses

```python
from fastapi import APIRouter, HTTPException
router = APIRouter()

@router.get("/clubs/{club_id}")
async def read_club(club_id: int) -> Club:
    """Get a single club by ID."""
    club = await get_club_by_id(club_id)
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    return club
```

## Type Hints & Docstrings

Every public function needs return-type annotation and a Google-style docstring:

```python
async def get_clubs() -> list[Club]:
    """
    Retrieve all football clubs.

    Returns:
        List of Club objects.
    """
```

## CORS

Configured in `app/main.py` for `http://localhost:3000`. Update `allow_origins` for production.

## Pre-commit Checklist

- [ ] `black . && isort . && pylint app/`
- [ ] `pytest tests/unit/ -v`
- [ ] `pytest tests/contract/ -v`
- [ ] `behave tests/integration`
- [ ] Coverage ≥ 80%: `pytest tests/ --cov=app --cov-report=term-missing`

## Adding a New Endpoint

1. Define Pydantic model in `app/api/models.py`
2. Add async service function in `app/services/`
3. Create route in `app/api/endpoints/proxy.py`
4. Add unit test in `tests/unit/`
5. Add BDD scenario in `tests/integration/features/`
6. Run formatters and verify contract tests still pass
