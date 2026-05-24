#!/bin/bash
# Ensure backend (port 8000) and frontend (port 3000) are running.
# Starts them in the background if not already up.
# Exits 0 once both respond, or 1 after 90 s timeout.
# Intentionally does NOT kill processes on exit — servers stay up for E2E.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MAX_WAIT=90
INTERVAL=2

# Add venv python to PATH for health checks and uvicorn startup
if [ -d "$REPO_ROOT/venv/Scripts" ]; then
    export PATH="$REPO_ROOT/venv/Scripts:$PATH"
elif [ -d "$REPO_ROOT/venv/bin" ]; then
    export PATH="$REPO_ROOT/venv/bin:$PATH"
elif [ -d "$REPO_ROOT/.venv/Scripts" ]; then
    export PATH="$REPO_ROOT/.venv/Scripts:$PATH"
elif [ -d "$REPO_ROOT/.venv/bin" ]; then
    export PATH="$REPO_ROOT/.venv/bin:$PATH"
fi

backend_up() {
  python - 2>/dev/null <<'PYEOF'
import urllib.request, sys
try:
    urllib.request.urlopen('http://127.0.0.1:8000/api/v1/health', timeout=3)
    sys.exit(0)
except Exception:
    sys.exit(1)
PYEOF
}

frontend_up() {
  python - 2>/dev/null <<'PYEOF'
import urllib.request, sys
try:
    urllib.request.urlopen('http://127.0.0.1:3000', timeout=3)
    sys.exit(0)
except Exception:
    sys.exit(1)
PYEOF
}

if ! backend_up; then
    echo "[ensure-servers] Starting backend..."
    (cd "$REPO_ROOT" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 >/dev/null 2>&1) &
fi

if ! frontend_up; then
    echo "[ensure-servers] Starting frontend..."
    (cd "$REPO_ROOT/football-cards-ui" && npm start >/dev/null 2>&1) &
fi

elapsed=0
while [ "$elapsed" -lt "$MAX_WAIT" ]; do
    if backend_up && frontend_up; then
        echo "[ensure-servers] Both servers ready ✓"
        exit 0
    fi
    sleep "$INTERVAL"
    elapsed=$((elapsed + INTERVAL))
done

echo "[ensure-servers] Timeout: servers did not become ready within ${MAX_WAIT}s ✗"
exit 1
