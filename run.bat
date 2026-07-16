@echo off
title F-Mine Backend Server
cd /d "%~dp0"
echo Starting F-Mine Backend Server...
echo Working directory: %CD%
echo.
start "" http://localhost:3000/lobby.html
node server.js
if %ERRORLEVEL% neq 0 (
  echo.
  echo Server exited with error code %ERRORLEVEL%
  pause
)
pause
