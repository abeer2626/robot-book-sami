---
id: 001-fix-mcp-port-error
title: Fix MCP Port Configuration Error
stage: green
date: 2025-12-21
surface: agent
model: glm-4.5-air
feature: robotics-textbook
branch: 1-robotics-textbook
user: unknown
command: /sp.implement
labels: ["mcp", "port-fix", "error-resolution", "backend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - SYSTEM_RUNNING.md
  - PROJECT_SUMMARY.md
  - run-status.bat
tests:
  - curl http://localhost:8000/health
  - curl -X POST http://localhost:8000/api/v1/chat/completions
---

## Prompt

"fix mcp error"

## Response snapshot

I've successfully identified and fixed the MCP errors in the robotics textbook project. The system is now fully operational with the frontend (port 3004) correctly communicating with the MCP backend (port 8000).

### Issues Found and Fixed

1. **Port Configuration Mismatch**
   - **Problem**: Frontend components were configured to use port 8002 for MCP requests, but the MCP backend was running on port 8000
   - **Files Fixed**:
     - `C:\Users\User\OneDrive\Desktop\ROBOTIC-BOOK\src\components\MCPRAGInterface.tsx` (line 121)
     - `C:\Users\User\OneDrive\Desktop\ROBOTIC-BOOK\src\lib\mcp-rag-integration.ts` (line 275)
     - `C:\Users\User\OneDrive\Desktop\ROBOTIC-BOOK\src\components\MCPStatusIndicator.tsx` (lines 8 and 112)

2. **CORS Configuration Issue**
   - **Problem**: The MCP backend didn't include port 3004 in its allowed origins
   - **Fixed**: Updated the CORS middleware in `mcp_working_main.py` to include `http://localhost:3004`

### Current System Status

✅ **Backend API Health**: http://localhost:8000/health - Responding correctly
✅ **MCP Query Endpoint**: http://localhost:8000/api/v1/chat/completions - Working
✅ **CORS Configuration**: Properly configured for frontend on port 3004
✅ **Frontend**: Running on port 3004
✅ **API Communication**: Successfully tested with sample queries

### Recommended Actions

1. **Ensure MCP Backend Autostart**: The MCP backend needs to be running continuously. Consider:
   - Adding it to a startup script
   - Using a process manager like PM2 or systemd
   - Including it in the project's startup documentation

2. **Verify Main Backend**: The main backend on port 8002 appears to have its API routes commented out (lines 167-168 in `app/main.py`). If you need this backend, uncomment these lines:
   ```python
   app.include_router(api_router, prefix=settings.api_v1_prefix)
   ```

3. **Documentation Update**: Update any documentation that references the incorrect port (8002) to use the correct port (8000) for MCP requests.

### Test Results
Successfully tested MCP queries including:
- "What is a robot?" - Returned appropriate robotics content with citations
- "What are sensors in robotics?" - Returned relevant content with proper citations

The MCP system is now fully functional and ready for use with the robotics textbook frontend.

## Outcome

- ✅ Impact: Fixed port configuration mismatch between frontend and backend services, ensuring proper MCP RAG integration
- 🧪 Tests: Verified backend health check (200 OK), chat endpoint functionality, and API response structure
- 📁 Files: Updated SYSTEM_RUNNING.md, PROJECT_SUMMARY.md, and run-status.bat with correct port 8000 configuration
- 🔁 Next prompts: Consider implementing process management for MCP backend and documenting deployment procedures
- 🧠 Reflection: Port configuration consistency is critical for microservice architectures; always verify service endpoints match deployment reality

## Evaluation notes (flywheel)

- Failure modes observed: Port mismatch causing 404 errors and failed API calls
- Graders run and results: PASS - All endpoints now responding correctly
- Prompt variant: Applied port correction based on service discovery logs
- Next experiment: Implement health check monitoring across all services