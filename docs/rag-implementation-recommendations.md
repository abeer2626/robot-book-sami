# RAG Implementation Recommendations

Based on research and your current codebase, here are detailed implementation recommendations for your RAG system:

## 1. OpenAI API Integration

### Token Optimization Strategies

**Model Selection:**
- Use `gpt-3.5-turbo` for standard queries (95% of cases)
- Reserve `gpt-4` only for complex queries requiring deeper reasoning
- Implement query complexity detection to route to appropriate model

```python
# Example model routing logic
def select_model(query: str, context_length: int) -> str:
    """Select the most cost-effective model based on query characteristics"""
    complexity_indicators = ["explain", "analyze", "compare", "synthesize", "evaluate"]

    # Use GPT-4 for complex queries or when context is very detailed
    if any(indicator in query.lower() for indicator in complexity_indicators) or context_length > 3000:
        return "gpt-4-turbo-preview"

    # Default to GPT-3.5 for standard queries
    return "gpt-3.5-turbo"
```

**Token Budget Management:**
```python
class TokenBudgetManager:
    def __init__(self, monthly_limit: float = 500.0):
        self.monthly_limit = monthly_limit
        self.daily_limit = monthly_limit / 30
        self.current_usage = self.get_current_usage()

    def can_make_request(self, estimated_tokens: int) -> bool:
        """Check if request fits within budget"""
        estimated_cost = self.estimate_cost(estimated_tokens)
        daily_remaining = self.daily_limit - self.get_daily_usage()

        return estimated_cost <= daily_remaining

    def estimate_cost(self, tokens: int, model: str = "gpt-3.5-turbo") -> float:
        """Estimate cost in USD based on token count and model"""
        pricing = {
            "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015},  # per 1K tokens
            "gpt-4-turbo-preview": {"input": 0.01, "output": 0.03}
        }
        # Assume 60% input, 40% output split
        input_tokens = tokens * 0.6
        output_tokens = tokens * 0.4

        return (pricing[model]["input"] * input_tokens +
                pricing[model]["output"] * output_tokens) / 1000
```

**Rate Limiting Implementation:**
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Initialize limiter with Redis backend for distributed rate limiting
limiter = Limiter(key_func=get_remote_address, storage_uri="redis://localhost:6379")

# Apply rate limiting to chat endpoint
@app.post("/chat")
@limiter.limit("10/minute")  # 10 requests per minute per user
async def chat_endpoint(request: Request, chat_request: ChatRequest):
    # Process chat request
    pass
```

### Error Handling Patterns

```python
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential
from openai import AsyncOpenAI

class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI()

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        reraise=True
    )
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-3.5-turbo",
        max_tokens: int = 500,
        temperature: float = 0.7
    ) -> str:
        """Generate response with retry logic"""
        try:
            response = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                timeout=5.0  # 5 second timeout
            )
            return response.choices[0].message.content

        except asyncio.TimeoutError:
            # Log timeout and use cached response if available
            return self.get_fallback_response()

        except openai.RateLimitError:
            # Implement backoff and queue the request
            await self.handle_rate_limit()
            raise

        except openai.APIError as e:
            # Log error and return appropriate fallback
            return self.handle_api_error(e)
```

## 2. Qdrant Vector Database

### Optimal Configuration

```python
from qdrant_client import QdrantClient
from qdrant_client.http.models import (
    Distance, VectorParams, CollectionParams,
    HnswConfigDiff, ScalarQuantizationConfig,
    QuantizationSearchParams
)

class QdrantManager:
    def __init__(self):
        self.client = QdrantClient(
            url= os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )

    async def create_collection(self, collection_name: str):
        """Create optimized collection for book content"""
        # Create collection with optimal parameters
        await self.client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(
                size=1536,  # OpenAI's text-embedding-ada-002 dimension
                distance=Distance.COSINE,
                hnsw_config=HnswConfigDiff(
                    m=16,  # Number of bi-directional links
                    ef_construct=100,  # Size of dynamic candidate list
                    full_scan_threshold=10000,  # Use brute-force for small collections
                    max_indexing_threads=4  # Number of threads for indexing
                )
            ),
            quantization_config=ScalarQuantizationConfig(
                scalar=ScalarType.INT8,
                quantile=0.99,  # Quantile to use for quantization bounds
                always_ram=False  # Keep quantized vectors on disk
            )
        )

    async def search_with_citations(
        self,
        collection_name: str,
        query_vector: List[float],
        limit: int = 5,
        score_threshold: float = 0.7
    ) -> List[SearchResult]:
        """Search with optimized parameters for citation retrieval"""
        results = await self.client.search(
            collection_name=collection_name,
            query_vector=query_vector,
            query_filter=None,  # No filter for general search
            limit=limit,
            score_threshold=score_threshold,
            with_payload=True,
            with_vectors=False,
            search_params=SearchParams(
                hnsw=HnswSearchParams(
                    ef=128  # Higher ef for better recall at cost of speed
                ),
                exact=False,  # Use approximate search for speed
                quantization=QuantizationSearchParams(
                    ignore=False,
                    rescore=True  # Rescore with original vectors for better accuracy
                )
            )
        )

        return [self.format_search_result(r) for r in results]
```

### Collection Schema Design

```python
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ContentChunk(BaseModel):
    """Schema for book content chunks"""
    id: str
    text: str
    chapter_id: str
    section_id: Optional[str]
    page_number: Optional[int]
    chunk_index: int
    metadata: Dict[str, Any]

    # For tracking content hierarchy
    parent_id: Optional[str] = None
    child_ids: List[str] = []

    # For citation purposes
    title: str
    url: str
    snippet: str
    word_count: int

class CollectionManager:
    def __init__(self):
        self.indexed_chunks = {}

    async def ingest_content(self, content: List[ContentChunk]):
        """Batch ingest content with optimal batch size"""
        batch_size = 100

        for i in range(0, len(content), batch_size):
            batch = content[i:i + batch_size]

            # Generate embeddings for batch
            embeddings = await self.generate_embeddings([c.text for c in batch])

            # Prepare points for Qdrant
            points = [
                PointStruct(
                    id=chunk.id,
                    vector=embedding,
                    payload={
                        "text": chunk.text,
                        "chapter_id": chunk.chapter_id,
                        "section_id": chunk.section_id,
                        "page_number": chunk.page_number,
                        "title": chunk.title,
                        "url": chunk.url,
                        "snippet": chunk.snippet,
                        "metadata": chunk.metadata
                    }
                )
                for chunk, embedding in zip(batch, embeddings)
            ]

            # Upsert batch
            await self.client.upsert(
                collection_name="book_content",
                points=points
            )
```

## 3. Neon PostgreSQL Integration

### Schema Design

```sql
-- Chat sessions table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,  -- Anonymous session identifier
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL REFERENCES chat_sessions(session_id),
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    context JSONB DEFAULT '{}'::jsonb,  -- Selected text, page context, etc.
    citations JSONB DEFAULT '[]'::jsonb,  -- Array of citation objects
    tokens_used INTEGER,
    model_used VARCHAR(50),
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE chat_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255),
    event_type VARCHAR(50) NOT NULL,
    properties JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX idx_chat_sessions_last_activity ON chat_sessions(last_activity);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_analytics_session_id ON chat_analytics(session_id);
CREATE INDEX idx_chat_analytics_created_at ON chat_analytics(created_at);
```

### Connection Pooling with asyncpg

```python
import asyncpg
from asyncpg import Pool
from typing import Optional
import os

class NeonDB:
    def __init__(self):
        self.pool: Optional[Pool] = None

    async def connect(self):
        """Initialize connection pool with optimal settings"""
        self.pool = await asyncpg.create_pool(
            # Use pooler endpoint for serverless optimization
            os.getenv("NEON_POOLER_URL"),
            min_size=5,  # Minimum connections to maintain
            max_size=20,  # Maximum connections
            max_queries=50000,  # Queries per connection before recycling
            max_inactive_connection_lifetime=300,  # 5 minutes
            command_timeout=60,  # 60 second query timeout
            server_settings={
                "application_name": "rag-chatbot",
                "jit": "off"  # Disable JIT for shorter queries
            }
        )

    async def execute_query(self, query: str, *args):
        """Execute query with automatic retry"""
        async with self.pool.acquire() as conn:
            try:
                return await conn.fetch(query, *args)
            except asyncpg.PostgresConnectionError:
                # Retry once on connection error
                await asyncio.sleep(0.5)
                return await conn.fetch(query, *args)

    async def store_message(
        self,
        session_id: str,
        message_type: str,
        content: str,
        context: dict = None,
        citations: list = None,
        tokens_used: int = None,
        model_used: str = None,
        response_time_ms: int = None
    ):
        """Store chat message with all metadata"""
        query = """
            INSERT INTO chat_messages (
                session_id, message_type, content, context, citations,
                tokens_used, model_used, response_time_ms
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, created_at
        """

        return await self.execute_query(
            query,
            session_id,
            message_type,
            content,
            json.dumps(context or {}),
            json.dumps(citations or []),
            tokens_used,
            model_used,
            response_time_ms
        )
```

### GDPR Compliance Implementation

```python
from datetime import datetime, timedelta
import asyncio

class GDPRManager:
    def __init__(self, db: NeonDB):
        self.db = db

    async def cleanup_expired_data(self):
        """Automatically clean up data older than retention period"""
        retention_days = 7
        cutoff_date = datetime.utcnow() - timedelta(days=retention_days)

        # Delete old sessions and their messages
        await self.db.execute_query("""
            DELETE FROM chat_sessions
            WHERE last_activity < $1
        """, cutoff_date)

    async def anonymize_sessions(self):
        """Ensure all sessions are properly anonymized"""
        # Check for any potential PII in session data
        suspicious_sessions = await self.db.execute_query("""
            SELECT session_id, metadata
            FROM chat_sessions
            WHERE metadata::text LIKE '%email%'
            OR metadata::text LIKE '%name%'
            OR metadata::text LIKE '%phone%'
        """)

        # Remove any PII found
        for session in suspicious_sessions:
            cleaned_metadata = {
                k: v for k, v in session['metadata'].items()
                if k not in ['email', 'name', 'phone', 'ip']
            }

            await self.db.execute_query("""
                UPDATE chat_sessions
                SET metadata = $1
                WHERE session_id = $2
            """, json.dumps(cleaned_metadata), session['session_id'])

    async def start_cleanup_job(self):
        """Start periodic cleanup job"""
        while True:
            try:
                await self.cleanup_expired_data()
                await self.anonymize_sessions()
                await asyncio.sleep(86400)  # Run daily
            except Exception as e:
                logger.error(f"GDPR cleanup failed: {e}")
                await asyncio.sleep(3600)  # Retry in an hour
```

## 4. FastAPI Architecture

### Async Request Handling

```python
from fastapi import FastAPI, Request, BackgroundTasks, HTTPException
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.concurrency import run_in_threadpool
import asyncio
from contextlib import asynccontextmanager

# Global resources
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.openai_service = OpenAIService()
    app.state.qdrant_manager = QdrantManager()
    app.state.neon_db = NeonDB()
    app.state.gdpr_manager = GDPRManager(app.state.neon_db)

    # Initialize connections
    await app.state.neon_db.connect()

    # Start background tasks
    asyncio.create_task(app.state.gdpr_manager.start_cleanup_job())

    yield

    # Cleanup
    await app.state.neon_db.pool.close()

app = FastAPI(
    title="RAG Chatbot API",
    description="Retrieval-Augmented Generation chatbot for book content",
    version="1.0.0",
    lifespan=lifespan,
    middleware=[
        Middleware(CORSMiddleware, allow_origins=["*"]),
        Middleware(GzipMiddleware, minimum_size=1000),
        Middleware(RequestLoggingMiddleware),
        Middleware(RateLimitMiddleware)
    ]
)
```

### Custom Middleware for Request Logging

```python
import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Generate unique request ID
        request_id = str(uuid.uuid4())

        # Add request ID to state
        request.state.request_id = request_id

        # Log request start
        start_time = time.time()
        logger.info(
            f"Request started: {request.method} {request.url.path}",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "query_params": str(request.query_params)
            }
        )

        # Process request
        response = await call_next(request)

        # Calculate duration
        duration = time.time() - start_time

        # Log request completion
        logger.info(
            f"Request completed: {response.status_code} in {duration:.3f}s",
            extra={
                "request_id": request_id,
                "status_code": response.status_code,
                "duration_ms": int(duration * 1000)
            }
        )

        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id

        return response
```

### Rate Limiting Middleware

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import redis
from fastapi import Request, HTTPException
import time

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, calls: int = 10, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.redis_client = redis.Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            decode_responses=True
        )

    async def dispatch(self, request: Request, call_next):
        # Get client IP (use X-Forwarded-For if behind proxy)
        client_ip = request.headers.get("X-Forwarded-For", request.client.host)

        # Check rate limit
        current_time = int(time.time())
        window_start = current_time - self.period

        # Remove old entries
        self.redis_client.zremrangebyscore(
            f"rate_limit:{client_ip}",
            0,
            window_start
        )

        # Count current requests
        current_requests = self.redis_client.zcard(f"rate_limit:{client_ip}")

        if current_requests >= self.calls:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded",
                headers={"Retry-After": str(self.period)}
            )

        # Add current request
        self.redis_client.zadd(
            f"rate_limit:{client_ip}",
            {str(current_time): current_time}
        )

        # Set expiry on the key
        self.redis_client.expire(f"rate_limit:{client_ip}", self.period)

        # Process request
        return await call_next(request)
```

### OpenAPI Documentation Configuration

```python
from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

def custom_openapi(app: FastAPI):
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="RAG Chatbot API",
        version="1.0.0",
        description="""
        ## Retrieval-Augmented Generation Chatbot API

        This API provides intelligent question-answering capabilities based on book content.

        ### Features
        - Semantic search through book content
        - Citations for all responses
        - Selected-text context queries
        - GDPR compliant anonymous sessions
        - Rate limiting (10 requests/minute)

        ### Authentication
        Currently no authentication required (subject to change).

        ### Rate Limits
        - 10 requests per minute per IP address
        - Responses include `Retry-After` header when rate limited
        """,
        routes=app.routes,
    )

    # Add custom schemas for error responses
    openapi_schema["components"]["schemas"]["HTTPError"] = {
        "type": "object",
        "properties": {
            "detail": {"type": "string"},
            "error_code": {"type": "string"},
            "request_id": {"type": "string"}
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema

# Apply to app
app.openapi = lambda: custom_openapi(app)
```

### Deployment Configuration

```yaml
# fly.toml (for Fly.io deployment)
app = "rag-chatbot-api"
primary_region = "iad"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"
  PYTHON_VERSION = "3.11"

[http_service]
  internal_port = 8080
  processes = ["app"]

  [http_service.concurrency]
    type = "connections"
    hard_limit = 1000
    soft_limit = 500

  [[http_service.checks]]
    interval = "30s"
    timeout = "10s"
    grace_period = "5s"
    method = "GET"
    path = "/health"

[[vm]]
  cpu_kind = "shared"
  cpus = 2
  memory_mb = 1024

[experimental]
  auto_rollback = true

# Dockerfile (for containerization)
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Performance Monitoring

```python
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from fastapi import Response
import psutil
import time

# Metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint']
)

ACTIVE_CONNECTIONS = Gauge(
    'active_connections',
    'Active connections'
)

OPENAI_API_REQUESTS = Counter(
    'openai_api_requests_total',
    'OpenAI API requests',
    ['model', 'status']
)

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()

    # Track active connections
    ACTIVE_CONNECTIONS.inc()

    try:
        response = await call_next(request)

        # Record metrics
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=request.url.path,
            status=response.status_code
        ).inc()

        REQUEST_DURATION.labels(
            method=request.method,
            endpoint=request.url.path
        ).observe(time.time() - start_time)

        return response

    finally:
        ACTIVE_CONNECTIONS.dec()

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return Response(
        generate_latest(),
        media_type="text/plain"
    )
```

## Summary of Key Recommendations

1. **OpenAI Integration**:
   - Use model routing based on query complexity
   - Implement strict token budget management
   - Add retry logic with exponential backoff
   - Rate limit at 10 requests/minute per user

2. **Qdrant Configuration**:
   - Use 1536 dimensions for OpenAI embeddings
   - Enable quantization for memory efficiency
   - Configure HNSW for optimal recall/speed balance
   - Store rich metadata for citations

3. **Neon PostgreSQL**:
   - Use connection pooling with serverless-optimized settings
   - Implement 7-day data retention with automatic cleanup
   - Store anonymized session data only
   - Add proper indexing for performance

4. **FastAPI Architecture**:
   - Implement async patterns throughout
   - Add custom middleware for logging and rate limiting
   - Configure OpenAPI documentation
   - Use Prometheus metrics for monitoring

This implementation provides a robust, scalable RAG system that meets your requirements while staying within budget constraints.