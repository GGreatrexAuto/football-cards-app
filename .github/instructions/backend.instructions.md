---
name: backend-python
description: "Use when: writing or modifying FastAPI backend code in app/ directory - Python code style, async patterns, API routes, error handling"
applyTo: "app/**"
---

# Backend (FastAPI) Context

## 📍 Scope
This applies to all Python code in the `app/` directory (FastAPI backend).

---

## 🐍 Python Code Style

### Formatter Configuration
- **Black**: Line length 88 characters (configured in `pyproject.toml`)
- **isort**: Black-compatible profile for import sorting
- **Pylint**: All warnings must be addressed before commit

### Before Committing
```bash
black .           # Auto-format all Python files
isort .           # Sort imports
pylint app/       # Fix all warnings
```

### Import Ordering (isort/black)
```python
# 1. Standard library imports
import os
import asyncio

# 2. Third-party imports
from fastapi import FastAPI
from pydantic import BaseModel

# 3. Local imports
from app.core.config import settings
from app.services.football_api import get_clubs
```

---

## 🔄 Async/Await Patterns

**All service functions are async**. Use `async def` and `await` consistently:

```python
# ✅ CORRECT: async service function
async def get_clubs():
    return MOCK_CLUBS

# ❌ WRONG: missing async/await
def get_clubs():
    return MOCK_CLUBS
```

### FastAPI Routes
Routes automatically support async:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/clubs")
async def read_clubs():
    clubs = await get_clubs()  # await async service calls
    return clubs
```

---

## 🏗️ Directory Structure & Conventions

```
app/
├── main.py              # FastAPI app initialization, CORS, router setup
├── api/
│   ├── models.py       # Pydantic models (Club, Nation, League, etc.)
│   ├── endpoints/
│   │   └── proxy.py    # API route handlers (routers)
│   └── __init__.py
├── core/
│   ├── config.py       # Settings & environment configuration
│   └── __init__.py
├── services/
│   ├── football_api.py # External API integration (async functions)
│   ├── test_data.py    # Mock data constants for development
│   └── __init__.py
└── __init__.py
```

### File Responsibilities
- **models.py**: Pydantic model definitions (data validation)
- **proxy.py**: FastAPI routes with business logic
- **football_api.py**: External API calls (async)
- **config.py**: Environment variables, settings
- **test_data.py**: Mock data for testing

---

## 📦 Pydantic Models

**All request/response models in `app/api/models.py`**. Use Pydantic BaseModel:

```python
from pydantic import BaseModel

class Club(BaseModel):
    id: int
    name: str
    league_id: int
```

**Key Patterns**:
- All fields must have type hints
- Use descriptive field names
- Add Field() with descriptions for complex fields
- Inherit from BaseModel

---

## 🛣️ API Routes Pattern

**FastAPI routers in `app/api/endpoints/proxy.py`**:

```python
from fastapi import APIRouter
from app.services.football_api import get_clubs

router = APIRouter()

@router.get("/clubs")
async def read_clubs():
    """Get all football clubs."""
    clubs = await get_clubs()
    return clubs
```

**Route Conventions**:
- Use descriptive function names (read_*, create_*, update_*, delete_*)
- Add docstrings explaining what each endpoint does
- Always use `async def` for route handlers
- `await` any async service calls
- Return Pydantic models or lists of models

---

## 🚨 Error Handling

Use FastAPI's HTTPException for errors:

```python
from fastapi import HTTPException

@router.get("/clubs/{club_id}")
async def read_club(club_id: int):
    club = await get_club_by_id(club_id)
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    return club
```

---

## ✅ Type Hints

**All public functions must have type hints**:

```python
# ✅ CORRECT
async def get_clubs() -> List[Club]:
    return MOCK_CLUBS

async def process_data(data: dict[str, any]) -> bool:
    return True

# ❌ WRONG: missing return type
async def get_clubs():
    return MOCK_CLUBS
```

---

## 📝 Docstrings

Use Google-style docstrings for public functions:

```python
async def get_club_by_league(league_id: int) -> List[Club]:
    """
    Retrieve all clubs for a specific league.

    Args:
        league_id: The ID of the league.

    Returns:
        List of Club objects in the league.

    Raises:
        HTTPException: If league not found.
    """
    # Implementation
```

---

## 🧪 Testing Service Functions

Service functions are tested in `tests/unit/`:

```python
# tests/unit/test_football_api.py
import pytest
from app.services.football_api import get_clubs

@pytest.mark.asyncio
async def test_get_clubs():
    """Tests that get_clubs returns expected mock data."""
    clubs = await get_clubs()
    assert clubs == MOCK_CLUBS
```

**Key Patterns**:
- Use `@pytest.mark.asyncio` for async functions
- Test functions should be descriptive: `test_<function>_<scenario>`
- Mock external dependencies
- Assert on return values and side effects

---

## 🔌 CORS Configuration

Currently configured in `app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Update `allow_origins` when deploying to production.

---

## 📋 Quick Checklist

When adding a new endpoint:
- [ ] Define Pydantic model in `models.py` if needed
- [ ] Add async function in `services/` if external data needed
- [ ] Create route in `api/endpoints/proxy.py`
- [ ] Add type hints and docstring
- [ ] Add unit tests in `tests/unit/`
- [ ] Add integration test in `tests/integration/`
- [ ] Run formatters: `black`, `isort`, `pylint`
- [ ] Verify test coverage >= 80%
