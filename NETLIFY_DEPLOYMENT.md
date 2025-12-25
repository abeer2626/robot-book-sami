# Deploy RAG Chatbot to Netlify

## ⚠️ Important Considerations

**Netlify is primarily for static sites and has limitations for backend applications like our RAG Chatbot:**

1. **Function Timeout**: 10-second limit (may not be enough for complex RAG queries)
2. **Cold Starts**: First request may be slow
3. **Database Connections**: Each function creates a new connection
4. **Cost**: Pay-per-invocation can be expensive for chatbots

## Better Alternative: Railway

For production use, **Railway** is recommended because:
- ✅ Designed for full backend applications
- ✅ No function timeout limits
- ✅ Persistent database connections
- ✅ Better performance for AI/ML workloads
- ✅ Fixed monthly pricing

## Netlify Deployment Instructions

If you still want to deploy on Netlify:

### 1. Create Netlify Account

1. Visit https://netlify.com
2. Sign up with GitHub

### 2. Deploy via Git

1. Push the `netlify` folder to your GitHub repository
2. In Netlify dashboard:
   - Click "New site from Git"
   - Connect your GitHub account
   - Select the `abeer2626/rag-chatbot` repository
   - Set "Build command" to `echo "No build needed"`
   - Set "Publish directory" to `netlify`
   - Click "Deploy site"

### 3. Configure Environment Variables

In Netlify dashboard → Site settings → Environment variables:

```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-key
OPENAI_ORG_ID=your-org-id

# Database
NEON_DATABASE_URL=postgresql://user:password@host/db
QDRANT_URL=https://your-qdrant-cluster.io
QDRANT_API_KEY=your-qdrant-key

# Application
SECRET_KEY=your-32-char-secret
ENVIRONMENT=production
```

### 4. Limitations

- **Response Time**: Maximum 10 seconds per request
- **Memory**: Limited to 1024MB per function
- **Concurrent Requests**: Limited by Netlify's plan
- **Database Pooling**: No persistent connections

### 5. Test Deployment

After deployment, test:
- Health: `https://your-site.netlify.app/api/v1/health`
- Docs: `https://your-site.netlify.app/docs`
- Chat: `https://your-site.netlify.app/api/v1/chat`

## Recommended Deployment: Railway

For a production-ready RAG Chatbot, use Railway:

1. Visit: https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fabeer2626%2Frag-chatbot
2. Configure environment variables
3. Deploy (2-5 minutes)

**Benefits:**
- ✅ No timeout limits
- ✅ Persistent database connections
- ✅ Better performance
- ✅ Full FastAPI support
- ✅ Cost-effective for AI applications

## Summary

While Netlify deployment is possible with serverless functions, **Railway is strongly recommended** for the RAG Chatbot due to its backend-first architecture and better support for AI/ML workloads.