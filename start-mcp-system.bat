@echo off
echo ========================================
echo Starting MCP RAG Integration System
echo ========================================
echo.

echo [1/3] Starting Backend Server...
cd rag-backend
python -m uvicorn mcp_working_main:app --host 0.0.0.0 --port 8001
if errorlevel 1 (
    echo.
    echo ERROR: Failed to start backend server!
    echo Make sure Python and required packages are installed
    pause
    exit /b 1
)

echo.
echo [2/3] Starting Frontend Server...
cd ..
set PORT=3004
npm run start

echo.
echo [3/3] System Shutdown
echo ========================================
pause