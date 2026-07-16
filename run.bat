@echo off
title F-Mine Backend Server
cd /d "%~dp0"
echo Starting F-Mine Backend Server...
echo Working directory: %CD%
echo.
echo Starting ngrok tunnel on port 3000...
start "ngrok" ngrok http 3000
timeout /t 2 /nobreak >nul
start "" http://localhost:3000/lobby.html
node server.js
if %ERRORLEVEL% neq 0 (
  echo.
  echo Server exited with error code %ERRORLEVEL%
  pause
)
pause
