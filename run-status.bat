@echo off
echo ========================================
echo MCP RAG Integration - System Status
echo ========================================
echo.

echo Checking Frontend (http://localhost:3004)...
curl -s http://localhost:3004 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend: RUNNING (http://localhost:3004)
    echo    - MCP RAG Page: http://localhost:3004/mcp-rag
) else (
    echo ❌ Frontend: NOT RUNNING
)

echo.
echo Checking Backend (http://localhost:8000)...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend: RUNNING (http://localhost:8000)
    echo    - Health Check: http://localhost:8000/health
    echo    - API Endpoint: http://localhost:8000/api/v1/chat/completions
) else (
    echo ❌ Backend: NOT RUNNING
)

echo.
echo ========================================
echo Quick Access Links
echo ========================================
echo 🌐 Main Platform: http://localhost:3004
echo 🔧 MCP Interface: http://localhost:3004/mcp-rag
echo 🤖 Backend API: http://localhost:8000/api/v1/chat/completions
echo ❤️ Health Check: http://localhost:8000/health
echo.
echo ========================================
echo Test Commands
echo ========================================
echo Test Chat: curl -X POST http://localhost:8000/api/v1/chat/completions -H "Content-Type: application/json" -d "{\"message\": \"What is robotics?\", \"conversation_id\": \"test\"}"
echo.
pause