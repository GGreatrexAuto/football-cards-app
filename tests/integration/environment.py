import os

from fastapi.testclient import TestClient

from app.main import app


def before_all(context):
    """Set up the test client before all tests."""
    context.client = TestClient(app)
    context.mock_patch = None


def before_scenario(_context, scenario):
    """Skip @external scenarios when no API key is configured."""
    if "external" in scenario.tags and not os.environ.get("FOOTBALL_DATA_API_KEY"):
        scenario.skip(
            "FOOTBALL_DATA_API_KEY not set — skipping external API smoke test"
        )


def after_scenario(context, _scenario):
    """Clean up after each scenario."""
    if context.mock_patch:
        context.mock_patch.stop()
        context.mock_patch = None
