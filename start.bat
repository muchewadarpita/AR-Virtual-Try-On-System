@echo off
echo ========================================
echo AR Virtual Dress Try-On
echo ========================================
echo.
echo Starting local server...
echo.
echo The app will open at: http://localhost:8000
echo.
echo NOTE: Camera access requires HTTPS in production
echo For local testing, your browser may allow HTTP
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python server...
    python -m http.server 8000
) else (
    echo Python not found. Trying Node.js...
    REM Check if Node.js is available
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Using Node.js http-server...
        npx http-server -p 8000 -c-1
    ) else (
        echo.
        echo ERROR: Neither Python nor Node.js found!
        echo Please install one of them:
        echo - Python: https://www.python.org/downloads/
        echo - Node.js: https://nodejs.org/
        echo.
        pause
    )
)



