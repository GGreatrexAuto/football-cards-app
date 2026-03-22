from fastapi.testclient import TestClient

from app.main import app


def before_all(context):
    """
    Set up the test client before all tests.
    """
    context.client = TestClient(app)
    context.mock_patch = None


def after_scenario(context, _scenario):
    """
    Clean up after each scenario.
    """
    if context.mock_patch:
        context.mock_patch.stop()
        context.mock_patch = None
