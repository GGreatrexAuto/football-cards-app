"""Locust load test for the four main API endpoints.

Run via the helper scripts (which start the backend in mock mode):
    bash scripts/load-test.sh          # Bash / Git Bash / WSL
    .\\scripts\\load-test.ps1           # PowerShell

Or manually (backend must already be running without FOOTBALL_DATA_API_KEY):
    locust --headless -u 50 -r 5 --run-time 120s --host http://localhost:8000 \\
           -f tests/performance/backend/load/locustfile.py

Web UI (interactive):
    locust --host http://localhost:8000 -f tests/performance/backend/load/locustfile.py
    # then open http://localhost:8089

Pass criteria (enforced here — non-zero exit on breach):
    p95 response time < 50 ms  (5-run local baseline: 12–20 ms;
                                 50 ms gives ~2.5× headroom for CI runner variance)
    error rate < 1%
"""

from locust import HttpUser, between, events, task


class CardApiUser(HttpUser):
    """Simulates a user hitting the four read-only card data endpoints."""

    wait_time = between(1, 3)

    @task
    def get_clubs(self):
        """GET /api/v1/clubs."""
        self.client.get("/api/v1/clubs")

    @task
    def get_nations(self):
        """GET /api/v1/nations."""
        self.client.get("/api/v1/nations")

    @task
    def get_leagues(self):
        """GET /api/v1/leagues."""
        self.client.get("/api/v1/leagues")

    @task
    def get_positions(self):
        """GET /api/v1/positions."""
        self.client.get("/api/v1/positions")


@events.quitting.add_listener
def check_pass_criteria(environment, **_kwargs):
    """Fail the run if p95 > 500 ms or error rate > 1%."""
    stats = environment.runner.stats.total
    p95 = stats.get_response_time_percentile(0.95)
    failure_rate = stats.fail_ratio

    failures = []
    if p95 > 50:
        failures.append(f"p95 {p95:.0f} ms > 50 ms threshold")
    if failure_rate > 0.01:
        failures.append(f"error rate {failure_rate:.1%} > 1% threshold")

    if failures:
        print(f"\nLOAD TEST FAILED: {', '.join(failures)}")
        environment.process_exit_code = 1
