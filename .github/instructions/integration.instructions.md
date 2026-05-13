---
name: integration-bdd
description: "Use when: writing BDD integration tests in tests/integration/ - Behave feature files, step definitions, test client setup, mocking"
applyTo: "tests/integration/**"
---

# Integration Tests (BDD + Behave) Context

## 📍 Scope
This applies to Behavior-Driven Development (BDD) tests in `tests/integration/` using Behave framework.

---

## 🎭 Behave Overview

Behave is a BDD framework that uses **Gherkin language** for test specifications:
- **Feature files** (`.feature`): Human-readable test scenarios
- **Step definitions** (`.py`): Implementation of test steps
- **Environment** (`environment.py`): Setup/teardown hooks
- **Uses**: FastAPI TestClient for HTTP testing

### Directory Structure
```
tests/integration/
├── features/                 # Gherkin feature files
│   ├── clubs.feature
│   ├── leagues.feature
│   ├── nations.feature
│   ├── external_api_failure.feature
│   └── __init__.py
├── steps/
│   ├── api_steps.py         # Step implementations
│   └── __init__.py
├── environment.py           # Setup & teardown
├── __init__.py
└── [conftest.py (if also using pytest)]
```

---

## 📝 Feature Files (Gherkin Syntax)

### File Naming & Location
- File: `tests/integration/features/<feature>.feature`
- One feature per file (e.g., `clubs.feature`, `leagues.feature`)
- Use lowercase, hyphens for readability

### Gherkin Structure
```gherkin
Feature: [Feature Name]
  [Optional description/narrative]
  
  Background:
    [Common setup steps shared by all scenarios]
  
  Scenario: [First scenario name]
    Given [initial state/precondition]
    When [action/trigger]
    Then [expected outcome/assertion]
    And [additional assertion]
  
  Scenario: [Second scenario name]
    Given [state]
    When [action]
    Then [outcome]
```

### Example Feature Files

**File: `tests/integration/features/clubs.feature`**
```gherkin
Feature: Football Clubs API
  As a client application
  I want to retrieve football club data
  So that I can display clubs to users

  Background:
    Given the application is running

  Scenario: Get all clubs successfully
    When I make a GET request to "/clubs"
    Then the response status code should be 200
    And the response should be a JSON array
    And each item in the array should have an "id" and "name"

  Scenario: Response contains expected club names
    When I make a GET request to "/clubs"
    Then the response status code should be 200
    And the response should be a JSON array
```

**File: `tests/integration/features/external_api_failure.feature`**
```gherkin
Feature: External API Failure Handling
  As a client
  I want graceful error handling when external APIs fail
  So that the app degrades gracefully

  Scenario: Handle external API failure
    Given the external API is unavailable
    When I make a GET request to "/clubs"
    Then the response status code should be 500
    And the response should contain an error message
```

### Gherkin Keywords
- **Feature**: Test suite title
- **Scenario**: Individual test case
- **Background**: Setup shared by all scenarios
- **Given**: Initial state/precondition
- **When**: Action/trigger
- **Then**: Expected outcome
- **And/But**: Additional steps of any type

---

## 🔧 Step Definitions

### File Organization
**File: `tests/integration/steps/api_steps.py`**

Steps are Python functions decorated with Behave decorators:

```python
from behave import given, when, then
from unittest.mock import patch

@given("the application is running")
def step_given_app_is_running(context):
    """Verify test client is ready."""
    assert context.client is not None

@when('I make a GET request to "{endpoint}"')
def step_when_make_get_request(context, endpoint):
    """Execute GET request and store response."""
    context.response = context.client.get(endpoint)

@then("the response status code should be {status_code:d}")
def step_then_status_code(context, status_code):
    """Assert response status code."""
    assert context.response.status_code == status_code
```

### Step Decorator Patterns

#### Parameterized Steps
Extract values from step text using:
- `{text}` → captures string
- `{number:d}` → captures integer
- `{float:f}` → captures float
- `"{quoted}"` → captures quoted string

```python
@when('I make a {method} request to "{endpoint}"')
def step_when_make_request(context, method, endpoint):
    """Method and endpoint are extracted from step text."""
    if method == 'GET':
        context.response = context.client.get(endpoint)
    elif method == 'POST':
        context.response = context.client.post(endpoint, json=context.request_body)

@then("the response status code should be {status_code:d}")
def step_then_status_code(context, status_code):
    """status_code is captured as integer."""
    assert context.response.status_code == status_code
```

#### Context Object
The `context` object passes data between steps:

```python
@given("I have a request body")
def step_given_request_body(context):
    """Store data in context for later steps."""
    context.request_body = {'playerName': 'Test Player'}

@when('I make a POST request to "{endpoint}"')
def step_when_post_request(context, endpoint):
    """Use context data from previous step."""
    context.response = context.client.post(endpoint, json=context.request_body)

@then("the response contains the player name")
def step_then_contains_player(context):
    """Verify response data."""
    data = context.response.json()
    assert data['playerName'] == context.request_body['playerName']
```

### Response Assertion Steps
```python
@then("the response should be a JSON array")
def step_then_json_array(context):
    """Assert response is JSON array."""
    response_json = context.response.json()
    assert isinstance(response_json, list)

@then('each item in the array should have an "id" and "name"')
def step_then_each_item_has_fields(context):
    """Assert all items have required fields."""
    response_json = context.response.json()
    for item in response_json:
        assert 'id' in item
        assert 'name' in item

@then("the response should contain an error message")
def step_then_contains_error(context):
    """Assert error response."""
    response_json = context.response.json()
    assert 'detail' in response_json or 'error' in response_json
```

### Mocking Steps
```python
from unittest.mock import patch

@given("the external API is unavailable")
def step_given_external_api_unavailable(context):
    """Mock external API failure."""
    context.mock_patch = patch(
        "app.services.football_api.get_clubs",
        side_effect=Exception("API is down")
    )
    context.mock_patch.start()
```

---

## 🔌 Environment Setup

**File: `tests/integration/environment.py`**

Behave hooks for setup/teardown:

```python
from fastapi.testclient import TestClient
from app.main import app

def before_all(context):
    """
    Run once before any scenarios.
    Initialize FastAPI test client.
    """
    context.client = TestClient(app)
    context.mock_patch = None

def before_scenario(context, scenario):
    """
    Run before each scenario.
    Reset state between tests.
    """
    context.response = None
    context.request_body = None

def after_scenario(context, scenario):
    """
    Run after each scenario.
    Clean up mocks and resources.
    """
    if context.mock_patch:
        context.mock_patch.stop()
        context.mock_patch = None
```

### Hooks Available
- `before_all(context)`: Before any scenarios
- `before_scenario(context, scenario)`: Before each scenario
- `after_scenario(context, scenario)`: After each scenario
- `after_all(context)`: After all scenarios

---

## 📝 Docstrings in Steps

Add docstrings to step functions for clarity:

```python
@when('I make a GET request to "{endpoint}"')
def step_when_make_get_request(context, endpoint):
    """
    Execute a GET request to the specified endpoint.
    
    Args:
        context: Behave context object
        endpoint: API endpoint path (e.g., "/clubs", "/leagues")
    
    Stores the response in context.response for later assertions.
    """
    context.response = context.client.get(endpoint)
```

---

## ✅ Running Integration Tests

### Run All Integration Tests
```bash
behave tests/integration
```

### Run Specific Feature File
```bash
behave tests/integration/features/clubs.feature
```

### Run Specific Scenario
```bash
behave tests/integration/features/clubs.feature -n "Get all clubs successfully"
```

### Run with Verbose Output
```bash
behave tests/integration -v
```

### Run with Tags
Tag scenarios and run selectively:

```gherkin
@critical
Scenario: Get all clubs successfully
  ...

@slow
Scenario: Handle large dataset
  ...
```

```bash
behave tests/integration -t critical  # Only @critical
behave tests/integration -t ~slow     # Exclude @slow
```

---

## 🧪 Test Data & Mocks

### Using Mock Data
```python
@given("clubs exist in the system")
def step_given_clubs_exist(context):
    """Mock club data in context."""
    from app.services.test_data import MOCK_CLUBS
    context.mock_clubs = MOCK_CLUBS
```

### Mocking Service Functions
```python
from unittest.mock import patch, MagicMock

@given("the league service returns test data")
def step_given_league_service_returns_data(context):
    """Mock the league service."""
    mock_league = {'id': 1, 'name': 'Premier League'}
    
    context.mock_patch = patch(
        'app.services.football_api.get_leagues',
        return_value=[mock_league]
    )
    context.mock_patch.start()
```

---

## 📋 Quick Checklist

When adding an integration test:
- [ ] Create `.feature` file in `tests/integration/features/`
- [ ] Write scenarios in Gherkin (Given/When/Then)
- [ ] Implement step functions in `tests/integration/steps/api_steps.py`
- [ ] Use `context` object to share data between steps
- [ ] Mock external dependencies with `@patch`
- [ ] Setup/cleanup in `environment.py` hooks
- [ ] Add docstrings to step functions
- [ ] Test both success and error paths
- [ ] Run: `behave tests/integration`
- [ ] Verify TestClient is initialized before tests
