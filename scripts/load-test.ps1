# Runs the Locust load test against the backend in mock mode.
# Starts the backend on :8000 with FOOTBALL_DATA_API_KEY cleared so the backend
# uses built-in mock data -- no external Football-Data.org API calls are made.

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

# Force mock mode by clearing the API key
$env:FOOTBALL_DATA_API_KEY = ''

Write-Host 'Starting backend on :8000 (mock mode)...'
$backend = Start-Process python -ArgumentList '-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000' -PassThru

try {
    # Health poll -- wait up to 15 s for the backend to be ready
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        try {
            $null = Invoke-WebRequest -Uri 'http://localhost:8000/api/v1/clubs' -UseBasicParsing -ErrorAction Stop
            Write-Host 'Backend ready.'
            $ready = $true
            break
        } catch {
            Start-Sleep -Milliseconds 500
        }
    }
    if (-not $ready) {
        Write-Error 'Backend did not start within 15 s.'
        exit 1
    }

    Write-Host 'Running Locust load test (50 users, 5/s ramp, 120 s)...'
    locust --headless -u 50 -r 5 --run-time 120s `
        --host http://localhost:8000 `
        -f tests/performance/backend/load/locustfile.py
} finally {
    Write-Host 'Stopping backend...'
    if (-not $backend.HasExited) {
        Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
    }
}
