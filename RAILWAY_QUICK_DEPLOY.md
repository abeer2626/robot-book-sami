# 🚀 Quick Deploy RAG Chatbot to Railway

## Step 1: Deploy from GitHub Template

**Click this link (should already be open in your browser):**
https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fabeer2626%2Frag-chatbot&referralCode=CLAUDE

## Step 2: Configure Deployment Settings

When Railway opens:

1. ✅ **Repository**: `abeer2626/rag-chatbot` (should be pre-selected)
2. ✅ **Branch**: `master` (default)
3. ✅ **Builder**: `Nixpacks` (auto-detected from railway.toml)
4. ✅ **Service Name**: `rag-chatbot-api` (or keep default)

## Step 3: Add Environment Variables

In the project settings, add these **required** environment variables:

```bash
# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
OPENAI_ORG_ID=your-openai-org-id-here

# Database (REQUIRED)
NEON_DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require

# Vector Database (REQUIRED)
QDRANT_URL=https://your-qdrant-cluster.qdrant.tech
QDRANT_API_KEY=your-qdrant-api-key-here

# Application (REQUIRED)
SECRET_KEY=your-32-character-secret-key-here
ENVIRONMENT=production
PORT=8000
```

## Step 4: Deploy

1. Click **"Deploy Now"**
2. Wait for build (2-5 minutes)
3. Railway will provide a URL like: `https://rag-chatbot-api.up.railway.app`

## Step 5: Run Database Migrations

After deployment:

```bash
# Connect to your Neon database and run:
psql $NEON_DATABASE_URL -f rag-backend/migrations/001_initial_schema.sql
```

## Step 6: Verify Deployment

Test these endpoints:

- **Health Check**: `https://your-app.up.railway.app/api/v1/health`
- **API Docs**: `https://your-app.up.railway.app/docs`
- **Chat API**: `https://your-app.up.railway.app/api/v1/chat`

Expected health response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "checks": {
    "database": "connected",
    "qdrant": "connected",
    "openai": "connected"
  }
}
```

## ⚡ What You Get

✅ **Production-ready RAG Chatbot** with:
- Intelligent model routing (GPT-3.5/GPT-4)
- Citation system with ranking and analytics
- GDPR compliance (7-day data retention)
- Rate limiting (10 requests/minute)
- Cost controls ($500/month budget)
- Health monitoring and metrics
- Automatic HTTPS and SSL

## Troubleshooting

**If build fails:**
- Check logs in Railway dashboard
- Verify Python version is 3.11
- Ensure all dependencies are in requirements.txt

**If runtime errors:**
- Verify all environment variables are set
- Check database connection strings
- Ensure OpenAI API key is valid

## Get Help

- Railway Docs: https://docs.railway.app
- Repository: https://github.com/abeer2626/rag-chatbot
- Issues: https://github.com/abeer2626/rag-chatbot/issues

---

**Your RAG Chatbot will be live in 5 minutes! 🎉**