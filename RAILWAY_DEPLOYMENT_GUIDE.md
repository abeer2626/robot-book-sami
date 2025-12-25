# Railway Deployment Log Access Guide

## Quick Access Links

1. **Railway Dashboard**: https://railway.app/dashboard
2. **Deploy from GitHub**: https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fabeer2626%2Frag-chatbot
3. **GitHub Repository**: https://github.com/abeer2626/rag-chatbot

## How to Check Deployment Logs

### Step 1: Deploy the Application
1. Visit the deployment link above
2. Click "Deploy Now"
3. Connect your GitHub account
4. Select the `abeer2626/rag-chatbot` repository

### Step 2: Configure Environment Variables
In Railway project settings, add:
```bash
OPENAI_API_KEY=sk-your-actual-key
NEON_DATABASE_URL=postgresql://user:password@host/db
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-key
SECRET_KEY=your-32-char-secret
PORT=8000
```

### Step 3: Access Logs
1. Go to Railway Dashboard
2. Click on your `rag-chatbot` project
3. Navigate to the **Services** tab
4. Click on your API service
5. Click on the **Logs** tab

## What to Look For in Logs

### Successful Build Should Show:
```
[Build] Installing Python 3.11...
[Build] Installing dependencies from requirements.txt...
[Build] Copying application code...
[Build] Build completed successfully
```

### Successful Runtime Should Show:
```
[Runtime] Starting uvicorn server...
[Runtime] Application startup complete
[Runtime] Database connection established
[Runtime] Qdrant connection established
[Runtime] OpenAI API configured
[Runtime] Server listening on http://0.0.0.0:8000
```

### Health Check Response Should Show:
```
GET /api/v1/health
Database health: OK
Qdrant health: OK
OpenAI health: OK
Response sent: 200 OK
```

## Common Error Patterns

### Build Errors:
- `ModuleNotFoundError: No module named 'xxx'`
- `Python version mismatch`
- `Failed to install dependencies`

### Runtime Errors:
- `Missing environment variable: OPENAI_API_KEY`
- `Database connection failed`
- `Port already in use`

### Solution Checklist:
1. Verify all environment variables are set
2. Check Python version (should be 3.11)
3. Ensure Neon and Qdrant URLs are correct
4. Make sure OpenAI API key is valid

## Current Status
- **GitHub Repository**: ✅ Ready at https://github.com/abeer2626/rag-chatbot
- **Deployment Configuration**: ✅ Dockerfile and railway.toml included
- **Environment Variables**: ❌ Need to be configured in Railway
- **Deployment Status**: ⚠️ Not deployed yet - requires manual trigger

## Next Steps
1. Deploy using the template link above
2. Configure environment variables
3. Check logs for any errors
4. Test health endpoint at `/api/v1/health`
5. Test API documentation at `/docs`