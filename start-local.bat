@echo off
setlocal

REM Ensure this script always runs from project directory
cd /d "%~dp0"

echo ==========================================
echo   PhD Workspace - One Click Start
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found.
  echo Please install Node.js first: https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\http-proxy" (
  echo [INFO] Dependencies missing, running npm install...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo [INFO] Opening app in browser...
start "" "http://localhost:9876"

echo [INFO] Starting local proxy server...
echo [INFO] Keep this window open while using WebDAV sync.
echo.
node proxy.js

echo.
echo [INFO] Proxy stopped.
pause
