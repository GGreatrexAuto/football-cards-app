# Backend Tests — Claude Code Context

Applies to all test code under `tests/` (unit, contract, integration).
For frontend component tests see `football-cards-ui/CLAUDE.md`.
For E2E Playwright tests see `football-cards-ui/tests/e2e/CLAUDE.md`.

## Test Pyramid

```
         /E2E\           ← few  — Playwright, real servers (football-cards-ui/tests/e2e/)
        /------\
       /  BDD   \        ← more — Behave + TestClient (tests/integration/)
      /----------\
     / Contracts  \      ← auto — Schemathesis schema validation (tests/contract/)
    /--------------\
   /  Unit (pytest) \    ← most — single functions, fast (tests/unit/)
  /==================\
```

**Coverage target: ≥ 80% globally.**  
Run order: unit → contract → integration → E2E.

---

## Unit Tests (`tests/unit/`)

- One test file per module; mirror app structure: `app/services/football_api.py` → `tests/unit/test_football_api.py`
- Use `@pytest.mark.asyncio` for every async function
- Mock external dependencies with `unittest.mock.patch`

The service has three paths to test for every function: no API key (returns mock), successful API call (verify transformation), and API error (falls back to mock). Always mock `settings` and `httpx.AsyncClient` — never make real HTTP calls in unit tests.

```python
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.services.football_api import get_clubs, get_leagues
from app.services.test_data import MOCK_CLUBS, MOCK_LEAGUES

# Helper: build a mock httpx async context manager
def _make_client_mock(responses):
    mock_client = AsyncMock()
    mock_client.get = AsyncMock(side_effect=responses)
    mock_class = MagicMock()
    mock_class.return_value.__aenter__ = AsyncMock(return_value=mock_client)
    mock_class.return_value.__aexit__ = AsyncMock(return_value=False)
    return mock_class

# 1. No API key → mock data returned without any HTTP call
@pytest.mark.asyncio
async def test_get_clubs_no_api_key_returns_mock():
    with patch("app.services.football_api.settings") as s:
        s.football_data_api_key = ""
        assert await get_clubs() == MOCK_CLUBS

# 2. Successful API call → transformed response
@pytest.mark.asyncio
async def test_get_leagues_transforms_api_response():
    resp = MagicMock()
    resp.raise_for_status = MagicMock()
    resp.json.return_value = {"competitions": [{"id": 2021, "name": "Premier League"}]}
    mock_class = _make_client_mock([resp])
    with patch("app.services.football_api.settings") as s, \
         patch("app.services.football_api.httpx.AsyncClient", mock_class):
        s.football_data_api_key = "test-key"
        s.football_data_api_url = "https://api.football-data.org/v4"
        result = await get_leagues()
    assert result == [{"id": 2021, "name": "Premier League"}]

# 3. API error → fallback to mock (no exception raised)
@pytest.mark.asyncio
async def test_get_leagues_api_error_falls_back_to_mock():
    mock_class = _make_client_mock([Exception("timeout")])
    with patch("app.services.football_api.settings") as s, \
         patch("app.services.football_api.httpx.AsyncClient", mock_class):
        s.football_data_api_key = "test-key"
        s.football_data_api_url = "https://api.football-data.org/v4"
        assert await get_leagues() == MOCK_LEAGUES
```

**Test naming**: `test_<function>_<scenario>` — descriptive, not vague (`test_clubs` is bad).

**Fixtures**: define reusable data in `tests/conftest.py`:

```python
@pytest.fixture
def client():
    from fastapi.testclient import TestClient
    from app.main import app
    return TestClient(app)
```

---

## Contract Tests (`tests/contract/`)

Schemathesis auto-generates test cases from the FastAPI OpenAPI schema and validates every response against it.

```python
import schemathesis
from fastapi.testclient import TestClient
from schemathesis.core import NotSet
from app.main import app

client = TestClient(app)
schema = schemathesis.openapi.from_dict(app.openapi())

@schema.parametrize()
def test_api_compliance(case):
    """All endpoints must match OpenAPI schema."""
    data = None if isinstance(case.body, NotSet) else case.body
    response = client.request(
        case.method, case.path,
        params=case.query, headers=case.headers, data=data,
    )
    case.validate_response(response)
```

Run: `pytest tests/contract/`

---

## Integration Tests (`tests/integration/`)

BDD with **Behave** + **Gherkin** `.feature` files + FastAPI `TestClient`.

### Structure

```
tests/integration/
├── features/            # *.feature files (Gherkin)
│   ├── clubs.feature
│   └── external_api_failure.feature
├── steps/
│   └── api_steps.py     # Given/When/Then implementations
└── environment.py       # before_all / after_scenario hooks
```

### Feature File Example

```gherkin
Feature: Football Clubs API
  Background:
    Given the application is running

  Scenario: Get all clubs successfully
    When I make a GET request to "/clubs"
    Then the response status code should be 200
    And the response should be a JSON array
```

### Step Definitions

```python
from behave import given, when, then

@given("the application is running")
def step_app_running(context):
    assert context.client is not None

@when('I make a GET request to "{endpoint}"')
def step_get_request(context, endpoint):
    context.response = context.client.get(endpoint)

@then("the response status code should be {code:d}")
def step_status_code(context, code):
    assert context.response.status_code == code
```

### Environment Setup

```python
# tests/integration/environment.py
from fastapi.testclient import TestClient
from app.main import app

def before_all(context):
    context.client = TestClient(app)
    context.mock_patch = None

def after_scenario(context, _scenario):
    if context.mock_patch:
        context.mock_patch.stop()
        context.mock_patch = None
```

### Mocking in Steps

```python
from unittest.mock import patch

@given("the external API is unavailable")
def step_api_unavailable(context):
    context.mock_patch = patch(
        "app.services.football_api.get_clubs",
        side_effect=Exception("API is down"),
    )
    context.mock_patch.start()
```

Run: `behave tests/integration`  
Run specific feature: `behave tests/integration/features/clubs.feature`

---

## Running All Backend Tests

```bash
pytest tests/unit/ -v                              # unit tests
pytest tests/contract/ -v                          # contract tests
behave tests/integration                           # BDD integration tests
pytest tests/ --cov=app --cov-report=term-missing  # full suite + coverage
```
