# Quickstart Guide: RAG Chatbot Integration

This guide will help you set up and deploy the RAG chatbot backend for the ROBOTIC-BOOK project.

## Prerequisites

### Required Accounts
- [OpenAI API account](https://platform.openai.com/) with API key
- [Neon database](https://neon.tech/) account
- [Qdrant Cloud](https://cloud.qdrant.io/) account (free tier)
- [Railway](https://railway.app/) account for deployment

### Local Development
- Python 3.11+ installed
- Git installed
- Redis (optional, for local rate limiting)

## Step 1: Clone and Set Up

```bash
# Clone the repository
git clone https://github.com/your-username/ROBOTIC-BOOK.git
cd ROBOTIC-BOOK

# Navigate to the RAG backend directory
mkdir -p rag-backend
cd rag-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

## Step 2: Install Dependencies

```bash
# Create requirements.txt
cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
asyncpg==0.29.0
qdrant-client==1.6.9
openai==1.3.7
redis==5.0.1
slowapi==0.1.9
python-multipart==0.0.6
pydantic==2.5.0
pydantic-settings==2.0.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
prometheus-client==0.19.0
tenacity==8.2.3
structlog==23.2.0
python-dotenv==1.0.0
httpx==0.25.2
pytest==7.4.3
pytest-asyncio==0.21.1
EOF

# Install dependencies
pip install -r requirements.txt
```

## Step 3: Configure Environment Variables

```bash
# Create .env file
cat > .env << EOF
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORG_ID=your_openai_org_id_here

# Database Configuration
NEON_DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
NEON_POOLER_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Qdrant Configuration
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key

# Redis Configuration (optional for local)
REDIS_URL=redis://localhost:6379

# Application Configuration
APP_NAME=RAG Chatbot API
APP_VERSION=1.0.0
ENVIRONMENT=development
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60

# Cost Management
MONTHLY_BUDGET=500
DAILY_BUDGET=16.67

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
EOF
```

## Step 4: Set Up Database

### Neon PostgreSQL Setup

1. [Create a new Neon project](https://neon.tech/docs/get-started-with-neon)
2. Get the connection string from the Neon dashboard
3. Update `NEON_DATABASE_URL` in your `.env` file

### Run Database Migrations

```bash
# Create migration script
cat > migrations/001_initial_schema.sql << 'EOF'
-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    order_index INTEGER NOT NULL,
    module_id VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sections table
CREATE TABLE IF NOT EXISTS sections (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    order_index INTEGER NOT NULL,
    chapter_id VARCHAR(255) NOT NULL REFERENCES chapters(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(session_id),
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    context JSONB DEFAULT '{}'::jsonb,
    citations JSONB DEFAULT '[]'::jsonb,
    tokens_used INTEGER,
    model_used VARCHAR(50),
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS chat_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID,
    event_type VARCHAR(50) NOT NULL,
    properties JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_activity ON chat_sessions(last_activity);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_events_session_id ON chat_events(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_events_created_at ON chat_events(created_at);
EOF

# Run migration
psql $NEON_DATABASE_URL -f migrations/001_initial_schema.sql
```

## Step 5: Set Up Qdrant

### Create Collection

```python
# Run this Python script to set up Qdrant
cat > setup_qdrant.py << 'EOF'
import os
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, HnswConfigDiff, ScalarQuantizationConfig, ScalarType

# Initialize client
client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

async def setup_collection():
    """Create the book content collection"""
    collection_name = "book_content"

    # Check if collection exists
    collections = client.get_collections().collections
    if collection_name in [c.name for c in collections]:
        print(f"Collection '{collection_name}' already exists")
        return

    # Create collection with optimal configuration
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(
            size=1536,  # OpenAI's text-embedding-ada-002 dimension
            distance=Distance.COSINE,
            hnsw_config=HnswConfigDiff(
                m=16,
                ef_construct=100,
                full_scan_threshold=10000,
                max_indexing_threads=4
            ),
            quantization_config=ScalarQuantizationConfig(
                scalar=ScalarType.INT8,
                quantile=0.99,
                always_ram=False
            )
        )
    )

    print(f"Collection '{collection_name}' created successfully")

if __name__ == "__main__":
    import asyncio
    asyncio.run(setup_collection())
EOF

# Run the setup script
python setup_qdrant.py
```

## Step 6: Create the FastAPI Application

```bash
# Create main application file
cat > main.py << 'EOF'
from fastapi import FastAPI
from contextlib import asynccontextmanager
import os
from app.core.config import settings
from app.api.v1.api import api_router
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_logging import RequestLoggingMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic here
    print(f"Starting {settings.app_name} v{settings.app_version}")
    yield
    # Cleanup logic here
    print("Shutting down...")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Retrieval-Augmented Generation chatbot for book content",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "vector_db": "connected",
            "openai": "connected"
        }
    }
EOF

# Create application structure
mkdir -p app/{api/v1,core,services,middleware,models}

# Create configuration
cat > app/core/config.py << 'EOF'
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # App settings
    app_name: str = "RAG Chatbot API"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = False

    # API settings
    api_v1_prefix: str = "/api/v1"

    # CORS settings
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001"
    ]

    # OpenAI settings
    openai_api_key: str
    openai_org_id: str = None
    openai_model_default: str = "gpt-3.5-turbo"
    openai_model_advanced: str = "gpt-4-turbo-preview"

    # Database settings
    neon_database_url: str
    neon_pooler_url: str = None

    # Qdrant settings
    qdrant_url: str
    qdrant_api_key: str

    # Redis settings
    redis_url: str = "redis://localhost:6379"

    # Rate limiting
    rate_limit_requests: int = 10
    rate_limit_window: int = 60

    # Cost management
    monthly_budget: float = 500.0
    daily_budget: float = 16.67

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
EOF

# Run the application
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Step 7: Test the API

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test chat endpoint
curl -X POST "http://localhost:8000/api/v1/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "What is robotics?",
       "context": {
         "currentPage": "/intro"
       }
     }'
```

## Step 8: Deploy to Railway

### Prepare for Deployment

```bash
# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port $PORT" > Procfile

# Create railway.toml
cat > railway.toml << EOF
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[[services]]
name = "app"

[services.variables]
PORT = "8000"
PYTHON_VERSION = "3.11"
EOF

# Create nixpacks.toml
cat > nixpacks.toml << EOF
[phases.setup]
nixPkgs = ["...", "python311"]

[phases.install]
cmds = ["python -m venv /opt/venv && . /opt/venv/bin/activate && pip install -r requirements.txt"]

[start]
cmd = ". /opt/venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000"
EOF
```

### Deploy

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Set environment variables in Railway dashboard
# - OPENAI_API_KEY
# - NEON_DATABASE_URL
# - QDRANT_URL
# - QDRANT_API_KEY

# Deploy
railway up
```

## Step 9: Connect Frontend

Update your Docusaurus configuration to use the real backend:

```typescript
// src/config/chatbot.ts
export const chatbotConfig = {
  api: {
    local: 'http://localhost:8000/api/v1/chat',
    production: 'https://your-rag-api.railway.app/api/v1/chat',
    current: typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:8000/api/v1/chat'
      : 'https://your-rag-api.railway.app/api/v1/chat',
  },
  // ... rest of config
};
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify Neon database URL is correct
   - Check if SSL is required (usually yes)
   - Ensure connection pooling URL is configured

2. **Qdrant Connection Issues**
   - Verify API key and cluster URL
   - Check if collection exists
   - Ensure vector dimensions match (1536)

3. **OpenAI API Errors**
   - Verify API key and organization ID
   - Check if you have sufficient credits
   - Monitor token usage to avoid rate limits

4. **Deployment Issues**
   - Check Railway logs for errors
   - Verify all environment variables are set
   - Ensure health check endpoint is accessible

### Monitoring

1. **Check Logs**
   ```bash
   # Railway logs
   railway logs

   # Local logs
   tail -f logs/app.log
   ```

2. **Monitor Metrics**
   - Visit `/metrics` endpoint
   - Set up Prometheus to scrape metrics
   - Create Grafana dashboards

3. **Health Checks**
   ```bash
   # Service health
   curl https://your-app.railway.app/health

   # Check specific services
   curl https://your-app.railway.app/health/services
   ```

## Next Steps

1. **Content Ingestion**: Implement the content pipeline to ingest book content
2. **Testing**: Write comprehensive tests for all endpoints
3. **Monitoring**: Set up comprehensive monitoring and alerting
4. **Scaling**: Configure autoscaling based on traffic
5. **Security**: Add authentication and authorization if needed

## Support

- Check the [API documentation](http://localhost:8000/docs) for detailed endpoint information
- Review the [implementation plan](../plan.md) for architecture details
- Open an issue on GitHub for bugs or feature requests