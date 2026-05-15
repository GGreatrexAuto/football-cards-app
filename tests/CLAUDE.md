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

```python
import pytest
from unittest.mock import patch
from app.services.football_api import get_clubs
from app.services.test_data import MOCK_CLUBS

@pytest.mark.asyncio
async def test_get_clubs_returns_mock_data():
    clubs = await get_clubs()
    assert clubs == MOCK_CLUBS

@patch('app.services.football_api.httpx.AsyncClient.get')
async def test_get_clubs_handles_api_error(mock_get):
    mock_get.side_effect = Exception("timeout")
    with pytest.raises(Exception):
        await get_clubs()
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
