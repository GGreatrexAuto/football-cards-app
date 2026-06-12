#!/usr/bin/env bash
# Runs the Locust load test against the backend in mock mode.
# Starts the backend on :8000 with FOOTBALL_DATA_API_KEY unset so the backend
# uses built-in mock data — no external Football-Data.org API calls are made.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

# Force mock mode by clearing the API key
export FOOTBALL_DATA_API_KEY=""

echo "Starting backend on :8000 (mock mode)..."
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
trap 'echo "Stopping backend..."; kill "$BACKEND_PID" 2>/dev/null; wait "$BACKEND_PID" 2>/dev/null || true' EXIT

# Health poll — wait up to 15 s for the backend to be ready
for i in $(seq 1 30); do
    if curl -sf http://localhost:8000/api/v1/clubs > /dev/null 2>&1; then
        echo "Backend ready."
        break
    fi
    if [ "$i" -eq 30 ]; then
        echo "ERROR: Backend did not start within 15 s." >&2
        exit 1
    fi
    sleep 0.5
done

echo "Running Locust load test (50 users, 5/s ramp, 120 s)..."
locust --headless -u 50 -r 5 --run-time 120s \
    --host http://localhost:8000 \
    -f tests/performance/backend/load/locustfile.py
