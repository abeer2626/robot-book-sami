# Railway Deployment Logs Guide

## How to Access Railway Deployment Logs

### Step 1: Open Railway Dashboard
**URL**: https://railway.app/dashboard

### Step 2: Find Your RAG Chatbot Project
- Look for `rag-chatbot` in your projects list
- If you don't see it, the deployment hasn't been started yet

### Step 3: Access Logs
1. **Click on your rag-chatbot project**
2. **Select your service** (usually named `api` or `rag-chatbot-api`)
3. **Click on the "Logs" tab** at the top

---

## What to Look For in Logs

### ✅ Successful Deployment Logs

You should see these messages in order:

```
[Build] ===== Starting Build =====
[Build] Installing Python 3.11...
[Build] Installing dependencies from requirements.txt
[Build] Successfully installed fastapi-0.104.1 ...
[Build] Copying application code
[Build] Build completed successfully

[Runtime] ===== Starting Runtime =====
[Runtime] Starting uvicorn server...
[Runtime] INFO:     Started server process [1]
[Runtime] INFO:     Waiting for application startup.
[Runtime] INFO:     Application startup complete.
[Runtime] INFO:     Uvicorn running on http://0.0.0.0:8000
```

### ❌ Common Error Messages

#### Build Errors:
```
[Build] ERROR: Could not find a version that satisfies the requirement xxx
[Build] ERROR: No matching distribution found for xxx
[Build] ModuleNotFoundError: No module named 'app'
```

#### Runtime Errors:
```
[Runtime] ERROR: Missing environment variable: OPENAI_API_KEY
[Runtime] ERROR: Database connection failed
[Runtime] ERROR: Port 8000 is already in use
[Runtime] KeyError: 'OPENAI_API_KEY'
```

#### Application Errors:
```
[Runtime] AttributeError: 'NoneType' object has no attribute 'client'
[Runtime] ValueError: Invalid database URL
[Runtime] OpenAI API error: Invalid API key
```

---

## Troubleshooting Based on Logs

### If You See Build Errors:
1. **Missing Dependencies**: Check `requirements.txt`
2. **Python Version**: Ensure Python 3.11 is available
3. **Syntax Errors**: Look for Python syntax issues

### If You See Runtime Errors:
1. **Missing Environment Variables**:
   - Go to Project Settings → Variables
   - Add all required variables from `railway-env-vars.txt`

2. **Database Connection Errors**:
   - Verify `NEON_DATABASE_URL` format
   - Ensure Neon database is active

3. **OpenAI API Errors**:
   - Check `OPENAI_API_KEY` is valid
   - Verify API key has sufficient credits

### If You See Port Errors:
- Set `PORT=8000` in environment variables
- Railway automatically sets this, but ensure it's not conflicting

---

## Real-time Log Monitoring

### Watch Logs in Real-time:
1. In the Logs tab, logs will auto-scroll
2. Click the **"Pause"** button to stop scrolling
3. Use **"Clear"** to clear old logs
4. Filter by service if multiple services exist

### Log Timestamps:
- Railway shows timestamps in UTC
- Look for recent timestamps (within last few minutes)

---

## Environment Variables Check

In Railway, verify these are set:
```
OPENAI_API_KEY=sk-your-actual-key
OPENAI_ORG_ID=your-org-id
NEON_DATABASE_URL=postgresql://user:pass@host/db
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-key
SECRET_KEY=your-32-char-secret
ENVIRONMENT=production
PORT=8000
```

### To Add/Update Variables:
1. Project Settings → Variables
2. Click "New Variable"
3. Add key-value pair
4. Click "Save"
5. Railway will automatically redeploy

---

## Expected Log Pattern for Health Check

When you test `/api/v1/health`, you should see:
```
[Runtime] INFO:     10.0.0.1:12345 - "GET /api/v1/health HTTP/1.1" 200
[Runtime] Database health check: OK
[Runtime] Qdrant health check: OK
[Runtime] OpenAI health check: OK
```

---

## Quick Log Checklist

- [ ] Build completed without errors
- [ ] All Python packages installed
- [ ] Application started successfully
- [ ] No missing environment variable errors
- [ ] Database connection established
- [ ] Server listening on port 8000
- [ ] Health check endpoint responding

---

## If All Else Fails

### Check Deployment URL:
The actual deployment URL might be different:
- Check Railway dashboard for the exact URL
- It will be shown at the top of your project page

### Contact Support:
- Railway support: support@railway.app
- GitHub issues: https://github.com/railwayapp/railway/issues

### Recreate Deployment:
1. Delete the current project in Railway
2. Click the deployment link again
3. Start fresh with all environment variables