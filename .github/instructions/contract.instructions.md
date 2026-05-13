---
name: contract-testing
description: "Use when: writing API contract tests in tests/contract/ - Schemathesis, OpenAPI schema validation, property-based testing"
applyTo: "tests/contract/**"
---

# Contract Tests (Schemathesis) Context

## 📍 Scope
This applies to API contract tests in `tests/contract/` using Schemathesis framework.

---

## 🤝 Contract Testing Overview

**Contract testing** validates that API implementations match their OpenAPI schema specification:
- Automatically generates test cases from OpenAPI schema
- Tests all endpoints, methods, parameters, and response types
- Ensures API behaves as documented
- Catches schema/implementation mismatches early
- Property-based testing finds edge cases

### Key Principle
> **"The API must behave exactly as its OpenAPI specification declares"**

---

## 📁 Directory Structure

```
tests/contract/
├── __init__.py
├── test_api_contract.py      # Main contract test file
└── [additional test files if needed]
```

---

## 🛠️ Schemathesis Setup

### Installation
Schemathesis is included in `requirements.txt`:
```bash
pip install schemathesis
```

### Basic Pattern

**File: `tests/contract/test_api_contract.py`**

```python
"""API Contract Tests using Schemathesis"""

import schemathesis
from fastapi.testclient import TestClient
from schemathesis.core import NotSet

from app.main import app

# 1. Create test client
client = TestClient(app)

# 2. Load OpenAPI schema from FastAPI app
schema = schemathesis.openapi.from_dict(app.openapi())

# 3. Parametrized test - runs for every endpoint/operation
@schema.parametrize()
def test_api_compliance(case):
    """Test that API responses match the OpenAPI schema"""
    # Prepare request data
    data = None if isinstance(case.body, NotSet) else case.body
    
    # Execute request
    response = client.request(
        case.method, 
        case.path, 
        params=case.query, 
        headers=case.headers, 
        data=data
    )
    
    # Validate response matches schema
    case.validate_response(response)
```

---

## 📋 How Schemathesis Works

### 1. Schema Loading
```python
# Load from FastAPI app
schema = schemathesis.openapi.from_dict(app.openapi())

# Alternative: Load from OpenAPI URL
schema = schemathesis.openapi.from_uri("http://localhost:8000/openapi.json")

# Alternative: Load from file
schema = schemathesis.openapi.from_path("openapi.json")
```

### 2. Parametrization
```python
@schema.parametrize()
def test_api_compliance(case):
    """
    Automatically runs for EVERY operation in OpenAPI schema.
    
    For example, if schema has:
    - GET /clubs
    - GET /nations
    - POST /clubs
    
    This test runs 3 times with generated test cases for each.
    """
    pass
```

### 3. Test Case Object
The `case` object contains all information about the generated test:

```python
@schema.parametrize()
def test_api_compliance(case):
    # case.method: HTTP method (GET, POST, etc.)
    # case.path: API endpoint path (/clubs, /nations)
    # case.query: Query parameters as dict
    # case.headers: HTTP headers as dict
    # case.body: Request body (if applicable)
    
    print(f"Testing {case.method} {case.path}")
    print(f"Query: {case.query}")
    print(f"Body: {case.body}")
```

### 4. Request Execution
```python
response = client.request(
    case.method,
    case.path,
    params=case.query,
    headers=case.headers,
    data=case.body if not isinstance(case.body, NotSet) else None
)
```

### 5. Response Validation
```python
# Validates response against schema:
# - Status code matches schema
# - Response body structure matches schema
# - Data types are correct
# - Required fields present
case.validate_response(response)
```

---

## ✅ Common Assertions

### Validate Response Schema
```python
@schema.parametrize()
def test_api_compliance(case):
    """Ensures response matches OpenAPI schema."""
    response = client.request(
        case.method, case.path, params=case.query, 
        headers=case.headers, data=case.body
    )
    case.validate_response(response)
```

### Check Status Code
```python
@schema.parametrize()
def test_api_status_codes(case):
    """Check response has valid status code."""
    response = client.request(case.method, case.path)
    
    # Schema defines expected status codes
    # Schemathesis validates response status is one of them
    case.validate_response(response)
    assert response.status_code in [200, 201, 400, 404, 500]
```

### Verify Response Type
```python
@schema.parametrize()
def test_api_response_types(case):
    """Ensure response types match schema."""
    response = client.request(
        case.method, case.path, params=case.query,
        headers=case.headers, data=case.body
    )
    case.validate_response(response)
    
    # For GET endpoints expecting JSON array
    if case.method == "GET" and "clubs" in case.path:
        assert isinstance(response.json(), list)
```

---

## 🎯 Testing Strategy

### 1. Happy Path Testing
```python
@schema.parametrize()
def test_api_compliance(case):
    """Valid requests return valid responses."""
    response = client.request(
        case.method, case.path, params=case.query,
        headers=case.headers, data=case.body
    )
    case.validate_response(response)
```

### 2. Edge Case Discovery
Schemathesis automatically generates edge cases:
- Boundary values (min/max integers, empty strings)
- Type variations
- Missing optional fields
- Null values

### 3. Filtering Tests
```python
@schema.parametrize(
    # Only test GET requests
    filters=[lambda case: case.method == "GET"]
)
def test_get_endpoints_only(case):
    response = client.request(case.method, case.path)
    case.validate_response(response)
```

### 4. Explicit Operation Testing
```python
@schema.parametrize(
    # Test only specific endpoints
    filters=[
        lambda case: case.path in ["/clubs", "/nations", "/leagues"]
    ]
)
def test_core_endpoints(case):
    response = client.request(case.method, case.path)
    case.validate_response(response)
```

---

## 🔄 API vs Contract Consistency

Contract tests ensure the **API implementation matches its OpenAPI schema**.

### If OpenAPI says endpoint returns:
```yaml
get:
  /clubs:
    responses:
      200:
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
```

### Contract test validates:
✅ Endpoint exists at `/clubs`  
✅ Accepts GET requests  
✅ Returns HTTP 200  
✅ Response is JSON array  
✅ Each item has `id` (integer) and `name` (string)  

If implementation deviates → **Test fails** → Fix implementation or update schema

---

## 📊 Property-Based Testing Benefits

Schemathesis performs **property-based testing** - generating hundreds of test variations:

```python
# Single test definition...
@schema.parametrize()
def test_api_compliance(case):
    response = client.request(case.method, case.path)
    case.validate_response(response)

# Runs with hundreds of generated test cases:
# - GET /clubs (default)
# - GET /clubs?limit=0
# - GET /clubs?limit=999999
# - GET /clubs?limit=-1
# - GET /clubs?limit="invalid"
# - GET /clubs with missing headers
# - GET /clubs with invalid content-type
# ... and many more edge cases
```

---

## 🐛 Common Issues & Solutions

### Issue: Test Fails with "Response does not match schema"
**Cause**: Implementation doesn't follow OpenAPI spec  
**Solution**: Either:
1. Fix implementation to match schema
2. Update OpenAPI schema to match implementation
3. Add response example to schema

### Issue: "Field missing in response"
**Cause**: API response missing required field defined in schema  
**Solution**: Add field to API response or remove from required fields in schema

### Issue: "Invalid type in response"
**Cause**: API returns wrong data type (e.g., string instead of integer)  
**Solution**: Fix API to return correct type or update schema

---

## 🧪 Integration with CI/CD

### Run Contract Tests Locally
```bash
pytest tests/contract/
```

### Run Specific Test File
```bash
pytest tests/contract/test_api_contract.py -v
```

### Run with Verbose Output
```bash
pytest tests/contract/ -vv --tb=short
```

### Expected Output
```
tests/contract/test_api_contract.py::test_api_compliance[GET-/clubs] PASSED
tests/contract/test_api_contract.py::test_api_compliance[GET-/nations] PASSED
tests/contract/test_api_contract.py::test_api_compliance[GET-/leagues] PASSED
```

---

## 📋 Quick Checklist

When adding new API endpoints:
- [ ] Add endpoint to FastAPI router
- [ ] Define request/response models with type hints
- [ ] Implement endpoint logic
- [ ] Run contract tests: `pytest tests/contract/`
- [ ] Fix any contract violations
- [ ] Run full test suite: `pytest tests/`
- [ ] Verify contract test passes
- [ ] Commit with both implementation and passing contract tests

### Before Committing Backend Changes
```bash
# 1. Run unit tests
pytest tests/unit/

# 2. Run integration tests
behave tests/integration

# 3. Run contract tests
pytest tests/contract/

# 4. Check coverage
pytest tests/ --cov=app --cov-report=term-missing
```

---

## 🔗 Further Reading

- **Schemathesis Docs**: https://schemathesis.io/
- **OpenAPI Specification**: https://swagger.io/specification/
- **Property-Based Testing**: https://hypothesis.readthedocs.io/
