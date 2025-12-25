# Implementation Plan: Integrated RAG Chatbot

**Created**: 2025-01-14
**Status**: Draft
**Constitution Version**: 1.0.0
**Feature**: Integrated RAG Chatbot
**Source**: specs/rag.spec.md

## Constitution Check

### I. Spec-First Development ✅
- Specification ratified: specs/rag.spec.md
- User stories, functional requirements, and success criteria defined
- Specification includes error handling, GDPR compliance, and cost management

### II. Dual Architecture Integration ✅
- Frontend: Docusaurus with React TypeScript chatbot component (already implemented)
- Backend: FastAPI with RAG service (planned below)
- Clear separation maintained via REST API
- Integration points documented

### III. AI-Augmented Authoring ✅
- All content created using Spec-Kit Plus workflow
- Claude Code oversight maintained
- Content traceability ensured

### IV. RAG-Powered Interaction ✅
- Book content as sole knowledge base
- User-selected text context support
- Citations for all responses
- No external knowledge sources

### V. Continuous Deployment ✅
- GitHub Pages deployment workflow planned
- Automated validation checks
- Health checks for RAG service

### VI. Performance-First Standards ✅
- Target: <3s load time, <2s response time
- Bundle optimization planned
- Lazy loading for non-critical resources

### VII. Privacy and Analytics ✅
- GDPR compliance with anonymized sessions
- 7-day data retention with automatic cleanup
- No PII storage

## Technical Context

### Dependencies
- **External APIs**: OpenAI API (GPT-3.5-turbo, GPT-4, text-embedding-ada-002)
- **Infrastructure**: Neon PostgreSQL, Qdrant Cloud, Redis (for rate limiting)
- **Deployment**: Railway/Fly.io for backend, GitHub Pages for frontend

### Technology Stack
- **Backend**: FastAPI with Python 3.11+, async/await patterns
- **Database**: Neon Serverless Postgres with connection pooling
- **Vector DB**: Qdrant Cloud (free tier) with HNSW indexing
- **LLM**: OpenAI API with intelligent model routing
- **Monitoring**: Prometheus metrics, structured logging

### Integration Points
1. **Frontend-Backend**: REST API at `/api/chat` endpoint
2. **Content Ingestion**: MDX files → embeddings → Qdrant
3. **Analytics**: Anonymized event tracking to Neon
4. **Deployment**: GitHub Actions for CI/CD

## Research Findings

### OpenAI API Integration
**Decision**: Use intelligent model routing with GPT-3.5-turbo for 95% of queries
**Rationale**: Cost optimization while maintaining quality
**Alternatives considered**: GPT-4 only (too expensive), Claude API (compatibility issues)

### Qdrant Configuration
**Decision**: 1536 dimensions with HNSW indexing and scalar quantization
**Rationale**: Optimal balance of speed, accuracy, and memory efficiency
**Alternatives considered**: No quantization (more memory), different indexing (slower)

### Database Schema
**Decision**: Three-table design (sessions, messages, analytics)
**Rationale**: Clear separation of concerns, efficient querying
**Alternatives considered**: Single table (too complex), document store (limited querying)

### Deployment Strategy
**Decision**: Railway for backend deployment
**Rationale**: Simplified deployment, built-in PostgreSQL connection
**Alternatives considered**: Fly.io (more complex), self-hosted (maintenance overhead)

## Phase 0: Research Complete ✅

All research tasks completed and documented in `docs/rag-implementation-recommendations.md`

## Phase 1: Design & Contracts

### Data Model

#### Core Entities

```python
# Content Entities
class ContentChunk(BaseModel):
    """Individual chunk of book content"""
    id: str  # Unique identifier
    text: str  # Content text
    chapter_id: str
    section_id: Optional[str]
    page_number: Optional[int]
    chunk_index: int
    metadata: Dict[str, Any]
    title: str
    url: str
    snippet: str
    word_count: int

# Chat Entities
class ChatSession(BaseModel):
    """Anonymous chat session"""
    session_id: UUID
    created_at: datetime
    last_activity: datetime
    message_count: int
    metadata: Dict[str, Any]

class ChatMessage(BaseModel):
    """Individual chat message"""
    id: UUID
    session_id: UUID
    message_type: Literal["user", "assistant"]
    content: str
    context: Dict[str, Any]  # Selected text, page context
    citations: List[Dict[str, str]]
    tokens_used: Optional[int]
    model_used: Optional[str]
    response_time_ms: Optional[int]
    created_at: datetime

# Analytics Entities
class ChatEvent(BaseModel):
    """Analytics event"""
    id: UUID
    session_id: UUID
    event_type: str
    properties: Dict[str, Any]
    created_at: datetime
```

### API Contracts

#### /api/chat Endpoint
```yaml
post:
  summary: Submit chat query
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            query:
              type: string
              description: User's question
            context:
              type: object
              properties:
                selectedText:
                  type: string
                  description: User-selected text for context
                currentPage:
                  type: string
                  description: Current page URL
                conversationHistory:
                  type: array
                  items:
                    $ref: '#/components/schemas/ChatMessage'
  responses:
    '200':
      description: Successful response
      content:
        application/json:
          schema:
            type: object
            properties:
              answer:
                type: string
                description: Chatbot response
              citations:
                type: array
                items:
                  $ref: '#/components/schemas/Citation'
              relatedQuestions:
                type: array
                items:
                  type: string
    '429':
      description: Rate limit exceeded
    '500':
      description: Internal server error
```

#### /api/health Endpoint
```yaml
get:
  summary: Check service health
  responses:
    '200':
      description: Service healthy
      content:
        application/json:
          schema:
            type: object
            properties:
              status:
                type: string
                example: "healthy"
              services:
                type: object
                properties:
                  database:
                    type: string
                  vector_db:
                    type: string
                  openai:
                    type: string
```

### Quickstart Guide

1. **Clone repository**
   ```bash
   git clone https://github.com/username/ROBOTIC-BOOK.git
   cd ROBOTIC-BOOK
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Run locally**
   ```bash
   uvicorn main:app --reload
   ```

5. **Deploy to Railway**
   ```bash
   railway login
   railway link
   railway up
   ```

## Phase 2: Implementation Tasks

### 2.1 Backend Service Setup

#### 2.1.1 Initialize FastAPI Project
- [ ] Create project structure
- [ ] Set up virtual environment
- [ ] Install dependencies (FastAPI, asyncpg, qdrant-client, openai)
- [ ] Configure environment variables
- [ ] Set up logging configuration

#### 2.1.2 Database Setup
- [ ] Create Neon PostgreSQL database
- [ ] Run migration scripts for schema
- [ ] Set up connection pooling
- [ ] Test database connectivity

#### 2.1.3 Vector Database Setup
- [ ] Create Qdrant Cloud collection
- [ ] Configure HNSW indexing
- [ ] Test vector operations
- [ ] Set up API authentication

### 2.2 Content Ingestion Pipeline

#### 2.2.1 Content Processing
- [ ] Create MDX parser for book content
- [ ] Implement chunking strategy (1000 words with overlap)
- [ ] Extract metadata (chapter, section, page)
- [ ] Generate content previews/snippets

#### 2.2.2 Embedding Generation
- [ ] Implement OpenAI embedding generation
- [ ] Batch process content chunks
- [ ] Store embeddings in Qdrant with metadata
- [ ] Create re-ingestion pipeline for updates

#### 2.2.3 Search Implementation
- [ ] Implement semantic search with Qdrant
- [ ] Add hybrid search (semantic + keyword)
- [ ] Implement citation extraction
- [ ] Add context ranking and filtering

### 2.3 Chat API Implementation

#### 2.3.1 Core Chat Endpoint
- [ ] Implement request/response models
- [ ] Add OpenAI client with retry logic
- [ ] Implement model routing (GPT-3.5 vs GPT-4)
- [ ] Add conversation history management

#### 2.3.2 Context Handling
- [ ] Process selected-text context
- [ ] Implement context window management
- [ ] Add content filtering for selected text
- [ ] Handle context insufficient scenarios

#### 2.3.3 Response Generation
- [ ] Implement prompt engineering
- [ ] Add citation formatting
- [ ] Generate related questions
- [ ] Handle out-of-scope queries

### 2.4 Middleware & Cross-cutting Concerns

#### 2.4.1 Rate Limiting
- [ ] Implement Redis-based rate limiting
- [ ] Add per-IP request tracking
- [ ] Configure rate limit headers
- [ ] Handle rate limit exceeded gracefully

#### 2.4.2 Privacy & GDPR
- [ ] Implement session anonymization
- [ ] Add 7-day data retention job
- [ ] Create opt-out mechanism
- [ ] Log privacy events

#### 2.4.3 Monitoring & Observability
- [ ] Add Prometheus metrics
- [ ] Implement structured logging
- [ ] Create health check endpoints
- [ ] Set up error tracking

### 2.5 Frontend Integration

#### 2.5.1 API Client Update
- [ ] Update RAG client to use real backend
- [ ] Add error handling for API failures
- [ ] Implement retry logic in frontend
- [ ] Add loading states and indicators

#### 2.5.2 UI Enhancements
- [ ] Add "English Only" badge
- [ ] Implement privacy notice
- [ ] Add clear chat functionality
- [ ] Improve citation display

### 2.6 Deployment & CI/CD

#### 2.6.1 Backend Deployment
- [ ] Configure Railway deployment
- [ ] Set up environment variables
- [ ] Configure health checks
- [ ] Enable automatic rollbacks

#### 2.6.2 GitHub Actions
- [ ] Add backend testing workflow
- [ ] Configure deployment pipeline
- [ ] Add integration tests
- [ ] Set up monitoring alerts

#### 2.6.3 Performance Optimization
- [ ] Implement response caching
- [ ] Optimize bundle size
- [ ] Add CDN configuration
- [ ] Tune database queries

## Risk Analysis

### High Risk
1. **OpenAI API costs exceeding budget**
   - Mitigation: Strict token budget management, intelligent caching
   - Kill switch: Disable GPT-4 routing

2. **Performance degradation at scale**
   - Mitigation: Connection pooling, caching, query optimization
   - Monitoring: Real-time performance metrics

### Medium Risk
1. **Qdrant rate limits on free tier**
   - Mitigation: Implement caching, batch operations
   - Backup: Self-hosted Qdrant instance

2. **GDPR compliance gaps**
   - Mitigation: Regular audits, automated PII detection
   - Monitoring: Compliance checks

### Low Risk
1. **Content ingestion failures**
   - Mitigation: Error logging, manual override
   - Recovery: Re-run ingestion pipeline

## Success Criteria Check

- [ ] 95% of answers accurately reflect book content
- [ ] 100% of responses include proper citations
- [ ] Response time under 2 seconds for 95% of queries
- [ ] Zero hallucinated information in responses
- [ ] Selected-text queries answered using only provided context
- [ ] Chat interface loads within 1 second
- [ ] System supports 100 concurrent conversations
- [ ] Zero PII stored (GDPR compliant)
- [ ] All chat data purged within 7 days
- [ ] Monthly costs under $500

## Next Steps

1. Review and approve this implementation plan
2. Create detailed task breakdown in `specs/rag/tasks.md`
3. Set up development environment
4. Begin Phase 1: Backend service setup