@echo off
setlocal

set "ROOT=%~dp0"
set "PORT=4173"

where python >nul 2>&1
if %errorlevel%==0 (
  echo Starting Spotifer on http://localhost:%PORT% ...
  start "Spotifer" cmd /c "python -m http.server %PORT% --directory \"%ROOT%\""
  timeout /t 2 >nul
  start "" "http://localhost:%PORT%/index.html"
  exit /b 0
)

echo Python not found. Opening the local HTML file instead.
start "" "%ROOT%index.html"
