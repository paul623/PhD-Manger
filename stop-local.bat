@echo off
setlocal

echo ==========================================
echo   PhD Workspace - Stop Local Proxy
echo ==========================================
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":9876" ^| findstr "LISTENING"') do (
  set PID=%%a
)

if not defined PID (
  echo [INFO] No process is listening on port 9876.
  pause
  exit /b 0
)

echo [INFO] Stopping process PID=%PID% on port 9876 ...
taskkill /PID %PID% /F >nul 2>nul

if errorlevel 1 (
  echo [ERROR] Failed to stop PID=%PID%.
  echo Try running this script as Administrator.
  pause
  exit /b 1
)

echo [OK] Port 9876 has been released.
pause
