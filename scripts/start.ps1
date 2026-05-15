$root = Split-Path $PSScriptRoot -Parent

function Kill-Port {
    param([int]$Port)
    $pid = netstat -ano | Select-String ":$Port " | Where-Object { $_ -match 'LISTENING' } | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -First 1
    if ($pid) {
        Write-Host "Killing existing process on port $Port (PID $pid)"
        taskkill /PID $pid /F /T 2>$null
        Start-Sleep -Seconds 1
    }
}

Write-Host "Clearing ports 8000 and 3000..."
Kill-Port 8000
Kill-Port 3000

# Start backend in a new terminal window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; .\.venv\Scripts\Activate.ps1; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -WindowStyle Normal

# Start frontend in a new terminal window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\football-cards-ui'; npm start" -WindowStyle Normal

Write-Host "Starting backend on http://localhost:8000"
Write-Host "Starting frontend on http://localhost:3000"
