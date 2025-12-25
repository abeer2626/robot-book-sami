# Railway Deployment Errors Reference

## Quick Access Links
- **Railway Dashboard**: https://railway.app/dashboard
- **Deploy Template**: https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fabeer2626%2Frag-chatbot&referralCode=CLAUDE

---

## How to Check for Errors

### 1. In Railway Dashboard:
1. Find your project (`rag-chatbot` or similar)
2. Look at the status badge:
   - 🟢 **RUNNING** = No errors
   - 🟡 **BUILDING** = Still deploying
   - 🔴 **FAILED** = Error occurred

### 2. If Failed:
1. Click on your project
2. Click on your service
3. Click **"Logs"** tab
4. Scroll to the bottom for latest errors

---

## Common Railway Errors and Solutions

### 🏗️ Build Errors

#### Error: `Could not find a version that satisfies the requirement xxx`
**Solution**:
- Check `requirements.txt` in your repo
- Ensure all package names are correct
- Example: `fastapi==0.104.1` (not `fastapi` alone)

#### Error: `ModuleNotFoundError: No module named 'app'`
**Solution**:
- Verify `app/main.py` exists
- Check directory structure matches expectations
- Ensure `app/` directory is in the repository

#### Error: `Python version not supported`
**Solution**:
- Check `railway.toml` has: `PYTHON_VERSION = "3.11"`
- Railway supports Python 3.11 by default

### ⚙️ Runtime Errors

#### Error: `Missing environment variable: OPENAI_API_KEY`
**Solution**:
1. Go to Project → Settings → Variables
2. Add: `OPENAI_API_KEY=sk-your-actual-key`
3. Click "Save" and wait for redeploy

#### Error: `Database connection failed`
**Solution**:
1. Verify `NEON_DATABASE_URL` format:
   ```
   postgresql://user:password@host:port/dbname?sslmode=require
   ```
2. Ensure Neon database is active
3. Test connection locally first

#### Error: `OpenAI API error: Invalid API key`
**Solution**:
1. Check API key from https://platform.openai.com/api-keys
2. Ensure key has credits
3. Verify organization ID if required

#### Error: `Qdrant connection timeout`
**Solution**:
1. Check `QDRANT_URL` format: `https://your-cluster.qdrant.tech`
2. Verify `QDRANT_API_KEY` is correct
3. Ensure Qdrant cluster is running

### 🔧 Configuration Errors

#### Error: `Port already in use`
**Solution**:
- Set `PORT=8000` in environment variables
- Railway handles port mapping automatically

#### Error: `SECRET_KEY not set`
**Solution**:
1. Generate: `openssl rand -hex 32` (or use any 32-char string)
2. Add: `SECRET_KEY=your-generated-key`
3. Keep it secret!

---

## Environment Variables Checklist

Go to Railway → Your Project → Variables and verify:

```bash
# Required
✅ OPENAI_API_KEY=sk-your-actual-key
✅ OPENAI_ORG_ID=your-org-id
✅ NEON_DATABASE_URL=postgresql://user:pass@host/db
✅ QDRANT_URL=https://your-cluster.qdrant.io
✅ QDRANT_API_KEY=your-api-key
✅ SECRET_KEY=your-32-char-secret
✅ ENVIRONMENT=production
✅ PORT=8000

# Optional
✅ REDIS_URL=redis://localhost:6379
✅ RATE_LIMIT_REQUESTS_PER_MINUTE=10
✅ LOG_LEVEL=INFO
```

---

## Error Log Examples

### ✅ Successful Build:
```
[Build] ===== Starting Build =====
[Build] Python 3.11 detected
[Build] Installing dependencies...
[Build] Successfully installed fastapi-0.104.1...
[Build] Build completed successfully
```

### ❌ Failed Build:
```
[Build] ERROR: Could not install packages due to an EnvironmentError
[Build] Failed building wheel for xxx
[Build] Build failed with exit code 1
```

### ✅ Successful Runtime:
```
[Runtime] Starting application...
[Runtime] INFO: Application startup complete.
[Runtime] INFO: Uvicorn running on http://0.0.0.0:8000
```

### ❌ Failed Runtime:
```
[Runtime] ERROR: Missing environment variable: OPENAI_API_KEY
[Runtime] Application failed to start
[Runtime] Process exited with code 1
```

---

## Quick Fix Steps

### If Build Fails:
1. Check `requirements.txt` for correct package versions
2. Verify Python 3.11 is specified
3. Ensure all files are in Git repository

### If Runtime Fails:
1. Add missing environment variables
2. Verify API keys and database URLs
3. Check if external services are accessible

### If Everything Fails:
1. Delete the Railway project
2. Start fresh with the deployment link
3. Add all environment variables BEFORE deploying
4. Click Deploy

---

## Getting Help

1. **Railway Docs**: https://docs.railway.app
2. **Create GitHub Issue**: https://github.com/abeer2626/rag-chatbot/issues
3. Include in issue:
   - Full error log
   - Environment variables (without secrets)
   - Steps you took

---

## After Fixing Errors

1. Railway will automatically redeploy after saving variables
2. Wait 2-5 minutes for deployment
3. Test at: `https://your-app.up.railway.app/api/v1/health`
4. Expected response:
```json
{
  "status": "healthy",
  "checks": {
    "database": "connected",
    "qdrant": "connected",
    "openai": "connected"
  }
}
```