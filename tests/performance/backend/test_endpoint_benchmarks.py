"""Benchmark tests for the four main API endpoints.

Always runs against mock data (no external API dependency) via a real uvicorn
server on port 8001 to measure genuine HTTP stack latency.

Run commands:
    pytest tests/performance/backend/ -v
    pytest tests/performance/backend/ --benchmark-autosave
    pytest tests/performance/backend/ --benchmark-autosave \
        --benchmark-compare --benchmark-compare-fail=mean:+20%
"""

# pylint: disable=redefined-outer-name
import threading
import time
from unittest.mock import MagicMock, patch

import httpx
import pytest
import uvicorn

from app.main import app

BASE_URL = "http://127.0.0.1:8001"
MEAN_THRESHOLD = 0.05  # 50 ms — floor for catastrophic regressions (actual mean ~1-2 ms)


@pytest.fixture(scope="session")
def live_server():
    """Start a real uvicorn server on port 8001 with mock data forced on.

    Patches both app.main.settings (lifespan probe) and
    app.services.football_api.settings (service functions) so no external
    network calls are made regardless of FOOTBALL_DATA_API_KEY in the env.
    """
    mock_settings = MagicMock()
    mock_settings.football_data_api_key = ""

    with patch("app.main.settings", mock_settings), patch(
        "app.services.football_api.settings", mock_settings
    ):
        config = uvicorn.Config(app, host="127.0.0.1", port=8001, log_level="warning")
        server = uvicorn.Server(config)
        thread = threading.Thread(target=server.run, daemon=True)
        thread.start()

        for _ in range(50):
            try:
                httpx.get(f"{BASE_URL}/api/v1/health")
                break
            except httpx.ConnectError:
                time.sleep(0.1)

        yield BASE_URL

        server.should_exit = True
        thread.join(timeout=5)


@pytest.fixture(scope="session")
def http_client(live_server):
    """Persistent httpx.Client that reuses the connection pool."""
    with httpx.Client(base_url=live_server) as client:
        yield client


@pytest.mark.performance
def test_clubs_mean_response_time(benchmark, http_client):
    def call():
        r = http_client.get("/api/v1/clubs")
        assert r.status_code == 200

    benchmark(call)
    assert benchmark.stats["mean"] < MEAN_THRESHOLD


@pytest.mark.performance
def test_nations_mean_response_time(benchmark, http_client):
    def call():
        r = http_client.get("/api/v1/nations")
        assert r.status_code == 200

    benchmark(call)
    assert benchmark.stats["mean"] < MEAN_THRESHOLD


@pytest.mark.performance
def test_leagues_mean_response_time(benchmark, http_client):
    def call():
        r = http_client.get("/api/v1/leagues")
        assert r.status_code == 200

    benchmark(call)
    assert benchmark.stats["mean"] < MEAN_THRESHOLD


@pytest.mark.performance
def test_positions_mean_response_time(benchmark, http_client):
    def call():
        r = http_client.get("/api/v1/positions")
        assert r.status_code == 200

    benchmark(call)
    assert benchmark.stats["mean"] < MEAN_THRESHOLD
