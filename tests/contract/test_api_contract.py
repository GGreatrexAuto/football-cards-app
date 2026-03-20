"""API Contract Tests using Schemathesis"""

import schemathesis
from fastapi.testclient import TestClient
from schemathesis.core import NotSet

from app.main import app

# Create a test client
client = TestClient(app)

# Load schema directly from FastAPI app instance
schema = schemathesis.openapi.from_dict(app.openapi())


@schema.parametrize()
def test_api_compliance(case):
    """Test that API responses match the OpenAPI schema"""
    data = None if isinstance(case.body, NotSet) else case.body
    response = client.request(
        case.method, case.path, params=case.query, headers=case.headers, data=data
    )
    case.validate_response(response)
