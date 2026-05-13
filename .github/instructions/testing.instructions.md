---
name: testing-general
description: "Use when: writing tests in tests/ directory - test pyramid, pytest fixtures, coverage targets, mock patterns"
applyTo: "tests/**"
---

# Testing Context - Test Pyramid & Patterns

## 📍 Scope
This applies to all test code in the `tests/` directory across all test types.

---

## 🔺 Test Pyramid

Tests follow a **shift-left, pyramid-shaped strategy**:

```
          /\
         /E2E\              ← Few (critical user journeys)
        /------\            pytest playwright specs
       /  BDD   \           ← More integration tests
      /----------\          behave + TestClient
     / Contracts  \         ← Property-based auto-generated
    /   (API)      \        Schemathesis schema validation
   /   Unit Tests   \       ← Most (fast, focused)
  /====================\    pytest functions
```

### Test Type Breakdown
| Type | Tool | Location | Scope | Speed |
|------|------|----------|-------|-------|
| **Unit** | pytest | `tests/unit/` | Single function/component | ⚡ Fast |
| **Contract** | Schemathesis | `tests/contract/` | API schema compliance (OpenAPI) | ⚡ Fast |
| **Integration** | Behave + TestClient | `tests/integration/` | API endpoints + business logic | 🔶 Medium |
| **E2E** | Playwright | `tests/e2e/` | Full user workflows | 🐢 Slow |

### Coverage Target
**Minimum 80% globally** - Higher for critical paths (core business logic).

### Test Execution Order (Recommended)
1. **Unit Tests** (fastest feedback)
2. **Contract Tests** (catch schema violations early)
3. **Integration Tests** (full API flows)
4. **E2E Tests** (user workflows)

---

## BDD & Gherkin
For tests at integration test level in the pyramid and above we use **Behavior-Driven Development (BDD)** with Gherkin syntax to define features and scenarios in a human-readable format. This promotes collaboration between developers, testers, and non-technical stakeholders.

## 🤝 Contract Tests (API Schema Validation)

**Location**: `tests/contract/`

Contract tests use **Schemathesis** to automatically validate that API implementations match their OpenAPI schema. This catches schema/implementation mismatches immediately.

### Quick Pattern
```python
# tests/contract/test_api_contract.py
import schemathesis
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
schema = schemathesis.openapi.from_dict(app.openapi())

@schema.parametrize()
def test_api_compliance(case):
    """Tests all endpoints match OpenAPI schema."""
    data = None if isinstance(case.body, NotSet) else case.body
    response = client.request(
        case.method,
        case.path,
        params=case.query,
        headers=case.headers,
        data=data,
    )
    case.validate_response(response)
```

### How It Works
- Automatically generates test cases from the OpenAPI schema
- Tests all endpoints, methods, parameters, response types
- Property-based testing discovers edge cases (boundary values, missing fields, type variations)
- If API response doesn't match schema → test fails immediately

### Running Contract Tests
```bash
pytest tests/contract/
```

### Why Contract Tests Matter
✅ Ensures API implementation matches documentation  
✅ Catches schema violations early  
✅ Auto-generates edge case tests  
✅ Fast feedback loop (runs before integration tests)  
✅ Prevents breaking API contracts  

**See `contract.instructions.md` for full contract testing guide.**

---

## 🧪 Unit Tests (pytest)

**Location**: `tests/unit/`

### Structure
- One test file per module
- Mirror the app structure: `app/services/football_api.py` → `tests/unit/test_football_api.py`

```
tests/unit/
├── test_football_api.py       # Tests for app/services/football_api.py
├── test_models.py             # Tests for Pydantic models
└── conftest.py               # Fixtures & setup
```

### Pytest Basics

```python
# tests/unit/test_football_api.py
import pytest
from app.services.football_api import get_clubs
from app.services.test_data import MOCK_CLUBS

@pytest.mark.asyncio
async def test_get_clubs():
    """Tests that get_clubs returns the expected mock data."""
    clubs = await get_clubs()
    assert clubs == MOCK_CLUBS
```

### Async Test Pattern
Always use `@pytest.mark.asyncio` for async functions:

```python
@pytest.mark.asyncio
async def test_get_nations():
    """Test async function."""
    nations = await get_nations()
    assert len(nations) > 0
```

### Mocking Pattern
Use `unittest.mock` to mock external dependencies:

```python
from unittest.mock import patch, MagicMock

@patch('app.services.football_api.external_api_call')
def test_with_mock(mock_external):
    """Mock an external API call."""
    mock_external.return_value = {'id': 1, 'name': 'Test Club'}
    result = get_clubs()
    assert result['name'] == 'Test Club'
```

### Fixtures
Define reusable test data in `conftest.py` or at module level:

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)

@pytest.fixture
def mock_clubs():
    """Mock club data."""
    return [
        {'id': 1, 'name': 'FC Test'},
        {'id': 2, 'name': 'Unit United'},
    ]
```

### Test Naming
Test function names must be descriptive and start with `test_`:

```python
# ✅ GOOD: describes what is being tested
def test_get_clubs_returns_list_of_clubs():
    pass

def test_get_clubs_handles_api_error():
    pass

# ❌ BAD: vague or too short
def test_clubs():
    pass

def test_1():
    pass
```

## 🎭 Integration Tests (Behave + BDD)

**Location**: `tests/integration/`

**Pattern**: Behavior-Driven Development using Gherkin language + Behave framework.

### Structure
```
tests/integration/
├── features/                 # .feature files (Gherkin)
│   ├── clubs.feature
│   ├── leagues.feature
│   ├── nations.feature
│   └── external_api_failure.feature
├── steps/
│   └── api_steps.py         # Step implementations
├── environment.py           # Setup/teardown hooks
└── __init__.py
```

### Gherkin Feature File (.feature)

**File: `tests/integration/features/clubs.feature`**

```gherkin
Feature: Football Clubs API
  As a client
  I want to retrieve club data
  So that I can display clubs in my app

  Scenario: Get all clubs successfully
    Given the application is running
    When I make a GET request to "/clubs"
    Then the response status code should be 200
    And the response should be a JSON array
    And each item in the array should have an "id" and "name"

  Scenario: Handle API failure gracefully
    Given the external API is unavailable
    When I make a GET request to "/clubs"
    Then the response status code should be 500
    And the response should contain an error message
```

### Step Implementation

**File: `tests/integration/steps/api_steps.py`**

```python
from behave import given, when, then
from unittest.mock import patch

@given("the application is running")
def step_given_app_is_running(context):
    """Verify the test client is ready."""
    assert context.client is not None

@when('I make a GET request to "{endpoint}"')
def step_when_make_get_request(context, endpoint):
    """Execute a GET request."""
    context.response = context.client.get(endpoint)

@then("the response status code should be {status_code:d}")
def step_then_status_code(context, status_code):
    """Assert response status code."""
    assert context.response.status_code == status_code

@then("the response should be a JSON array")
def step_then_json_array(context):
    """Assert response is JSON array."""
    response_json = context.response.json()
    assert isinstance(response_json, list)

@given("the external API is unavailable")
def step_given_external_api_unavailable(context):
    """Mock external API failure."""
    context.mock_patch = patch(
        "app.services.football_api.get_clubs",
        side_effect=Exception("API is down")
    )
    context.mock_patch.start()
```

### Environment Setup

**File: `tests/integration/environment.py`**

```python
from fastapi.testclient import TestClient
from app.main import app

def before_all(context):
    """Set up test client before all scenarios."""
    context.client = TestClient(app)
    context.mock_patch = None

def after_scenario(context, _scenario):
    """Clean up mocks after each scenario."""
    if context.mock_patch:
        context.mock_patch.stop()
        context.mock_patch = None
```

### Running Integration Tests
```bash
behave tests/integration
```

---

## 📋 Test Naming & Organization

### Descriptive Test Names
- Use `test_<feature>_<scenario>` pattern
- Include the expected outcome

```python
# ✅ GOOD
def test_get_clubs_returns_all_clubs():
    pass

def test_get_clubs_with_invalid_league_returns_empty_list():
    pass

def test_save_card_persists_to_local_storage():
    pass

# ❌ BAD
def test_clubs():
    pass

def test_1():
    pass

def test_api():
    pass
```

---

## 🛡️ Mocking & Test Isolation

### Mock External Dependencies
Never depend on real external APIs in tests:

```python
# ❌ BAD: calls real API
def test_get_clubs():
    clubs = get_clubs()  # Makes real HTTP request

# ✅ GOOD: mocks external call
@patch('app.services.football_api.httpx.AsyncClient.get')
def test_get_clubs(mock_get):
    mock_get.return_value.json.return_value = MOCK_CLUBS
    clubs = get_clubs()
    assert clubs == MOCK_CLUBS
```

### Mock Storage Services
```python
from unittest.mock import patch

@patch('app.services.storage.localStorage.getItem')
def test_load_card(mock_get_item):
    mock_get_item.return_value = '{"playerName": "Test"}'
    card = load_card()
    assert card['playerName'] == 'Test'
```

---

## ✅ Before Committing

```bash
# 1. Run all unit tests
pytest tests/unit -v

# 2. Run contract tests (API schema validation)
pytest tests/contract/ -v

# 3. Run integration tests
behave tests/integration

# 4. Check coverage
pytest tests/unit --cov=app --cov-report=term-missing

# 5. Run all tests together
pytest tests/ --cov=app

# 6. Run e2e tests (frontend)
npm test --testPathPattern=e2e
```

---

## 📋 Quick Checklist

When adding a feature:
- [ ] Follow the current backlog in `PHASE_3_FRONTEND_TODO.md`
- [ ] Write unit tests first (TDD when possible)
- [ ] Add contract test validation (Schemathesis validates schema compliance)
- [ ] Add integration test with Behave (.feature file + steps)
- [ ] Mock external dependencies (APIs, storage)
- [ ] Test both success and failure paths
- [ ] Async tests use `@pytest.mark.asyncio`
- [ ] Test naming is descriptive
- [ ] Coverage >= 80%
- [ ] Run in order: unit → contract → integration → e2e
- [ ] All tests pass before committing
- [ ] Update feature files in `tests/integration/features/` if API changes
