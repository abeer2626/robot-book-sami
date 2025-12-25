# Vercel Deployment Guide

This project is configured for deployment on Vercel.

## Prerequisites

1. Vercel account: https://vercel.com
2. OpenAI API key: https://platform.openai.com/api-keys
3. Neon database: https://neon.tech
4. Qdrant Cloud account: https://cloud.qdrant.io

## Environment Variables

Set these in your Vercel project settings:

```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORG_ID=your_openai_org_id_here
NEON_DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NEON_DATABASE_URL_DIRECT=postgresql://user:password@host:port/database?sslmode=require
QDRANT_URL=https://your-cluster-url.qdrant.tech
QDRANT_API_KEY=your_qdrant_api_key_here
REDIS_URL=redis://localhost:6379
```

## Deployment Steps

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Set the build command: `npm run build`
   - Set the output directory: `build`

2. **Configure Environment Variables**
   - Add all environment variables from above
   - Make sure to use the production values

3. **Deploy**
   - Click "Deploy" button
   - Monitor the deployment logs

## Project Structure

```
├── vercel.json              # Vercel configuration
├── package.json            # Frontend dependencies
├── rag-backend/            # Python backend
│   ├── requirements.txt    # Python dependencies
│   └── app/
│       └── main.py        # FastAPI application
└── docs/                  # Docusaurus book content
```

## API Endpoints

The RAG chatbot API will be available at:
- `/api/v1/chat/completions` - Chat completion endpoint
- `/api/v1/health` - Health check endpoint

## Development

To run locally:
```bash
# Frontend
npm start

# Backend (from rag-backend directory)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Scaling

Vercel automatically scales the application based on demand. The Python backend will run on serverless functions.

## Monitoring

Check Vercel dashboard for:
- Build logs
- Function execution times
- Error rates
- Environment variables status