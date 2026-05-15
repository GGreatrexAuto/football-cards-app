#!/bin/bash
set -e
cd "$(dirname "$0")/.."

kill_port() {
  local port=$1
  local pid
  pid=$(netstat -ano 2>/dev/null | grep ":$port " | grep LISTENING | awk '{print $NF}' | head -1)
  if [ -n "$pid" ]; then
    echo "Killing existing process on port $port (PID $pid)"
    taskkill //PID "$pid" //F //T 2>/dev/null || true
    sleep 1
  fi
}

echo "Clearing ports 8000 and 3000..."
kill_port 8000
kill_port 3000

source .venv/Scripts/activate

echo "Starting backend on http://localhost:8000"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:3000"
cd football-cards-ui
npm start &
FRONTEND_PID=$!

trap "echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
