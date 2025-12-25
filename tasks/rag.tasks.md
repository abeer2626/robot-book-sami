---

description: "Task list for Integrated RAG Chatbot implementation"
---

# Tasks: Integrated RAG Chatbot

**Input**: Design documents from `specs/rag/plan.md`
**Prerequisites**: specs/rag/plan.md, specs/rag/data-model.md, specs/rag/quickstart.md, specs/rag/contracts/api.yaml

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend Service**: `rag-backend/` directory
- **Tests**: `rag-backend/tests/`
- **Frontend**: Already exists at `src/components/chatbot/`
- **Scripts**: `rag-backend/scripts/`

---

## Phase 1: Backend Service Setup

**Purpose**: Initialize FastAPI project and basic infrastructure

- [x] T001 Create rag-backend directory structure with FastAPI layout
  - Path: `rag-backend/app/{api,core,db,models,services,middleware,scripts}`
  - Create __init__.py files for all modules
  - Set up basic project structure

- [x] T002 Initialize Python project with dependencies
  - Path: `rag-backend/requirements.txt`
  - Include FastAPI, asyncpg, qdrant-client, openai, redis, slowapi
  - Include dev dependencies: pytest, pytest-asyncio, black, ruff

- [x] T003 [P] Configure development environment
  - Path: `rag-backend/.env.example`
  - Path: `rag-backend/pyproject.toml`
  - Set up pre-commit hooks with black and ruff
  - Create README with setup instructions

- [x] T004 Set up Qdrant Cloud collection and connection
  - Path: `rag-backend/app/db/qdrant.py`
  - Create collection with 1536 dimensions
  - Configure HNSW indexing with scalar quantization
  - Test connectivity and basic operations

- [x] T005 Set up Neon database and run migrations
  - Path: `rag-backend/migrations/001_initial_schema.sql`
  - Execute SQL from data-model.md
  - Test database connectivity
  - Verify tables created correctly

---

## Phase 2: Core Infrastructure

**Purpose**: Essential services that must exist before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Implement core configuration management
  - Path: `rag-backend/app/core/config.py`
  - Use Pydantic Settings for environment variables
  - Include OpenAI, Neon, Qdrant configurations
  - Add rate limiting and cost management settings

- [x] T007 [P] Set up database connection pooling
  - Path: `rag-backend/app/db/neon.py`
  - Implement asyncpg connection pool
  - Configure pooler URL for serverless optimization
  - Add connection retry logic

- [x] T008 [P] Configure Qdrant client wrapper
  - Path: `rag-backend/app/db/qdrant.py` (extend existing)
  - Add search with citations functionality
  - Implement batching for uploads
  - Add health check methods

- [x] T009 Set up OpenAI API client with intelligent routing
  - Path: `rag-backend/app/services/llm.py`
  - Implement model selection (GPT-3.5 vs GPT-4)
  - Add retry logic with exponential backoff
  - Include token usage tracking

- [x] T010 Implement GDPR compliance utilities
  - Path: `rag-backend/app/core/security.py`
  - Create session anonymization functions
  - Implement PII detection and removal
  - Add data retention helpers

- [x] T011 Create base FastAPI application structure
  - Path: `rag-backend/app/main.py`
  - Set up CORS middleware
  - Configure structured logging
  - Add lifespan handlers for resource management

- [x] T012 Set up monitoring and metrics infrastructure
  - Path: `rag-backend/app/middleware/metrics.py`
  - Implement Prometheus metrics collection
  - Add request/response logging
  - Create performance tracking

- [x] T013 Implement health check endpoints
  - Path: `rag-backend/app/api/health.py`
  - Check database connectivity
  - Check Qdrant connection
  - Check OpenAI API status
  - Return service health summary

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Reader Asks General Book Question (Priority: P1) 🎯 MVP

**Goal**: Enable readers to ask questions and receive answers with citations
**Acceptance Criteria**: 95% of answers accurately reflect book content, all responses include citations

### Tests for User Story 1

- [x] T014 [P] [US1] Unit test for embedding generation
  - Path: `rag-backend/tests/unit/test_embeddings.py`
  - Test OpenAI embedding API integration
  - Verify dimensionality (1536)
  - Test error handling

- [x] T015 [P] [US1] Integration test for RAG pipeline
  - Path: `rag-backend/tests/integration/test_rag_pipeline.py`
  - Test end-to-end query processing
  - Verify citation extraction
  - Test with sample book content

### Implementation for User Story 1

- [x] T016 [P] [US1] Create Pydantic models for chat
  - Path: `rag-backend/app/models/chat.py`
  - Define ChatRequest and ChatResponse models
  - Include validation rules from API spec
  - Add context and citation models

- [x] T017 [P] [US1] Implement content chunking and embedding
  - Path: `rag-backend/app/services/content_service.py`
  - Parse MDX files for book content
  - Implement chunking strategy (1000 words with overlap)
  - Generate and store embeddings in Qdrant

- [x] T018 [P] [US1] Build vector search functionality
  - Path: `rag-backend/app/db/qdrant.py`
  - Implement semantic search with similarity threshold
  - Return top-k relevant chunks
  - Include metadata for citations

- [x] T019 [US1] Implement RAG processing pipeline
  - Path: `rag-backend/app/services/chat_service.py`
  - Combine retrieval and generation
  - Build prompt with retrieved context
  - Generate response using OpenAI

- [x] T020 [US1] Create chat API endpoint
  - Path: `rag-backend/app/api/v1/endpoints/chat.py`
  - Implement /api/v1/chat/completions endpoint
  - Add request validation
  - Include rate limiting middleware

- [x] T021 [US1] Implement citation generation
  - Path: `rag-backend/app/services/chat_service.py`
  - Extract source information from chunks
  - Format citations according to spec
  - Include URLs and snippets

- [x] T022 [US1] Add conversation context management
  - Path: `rag-backend/app/services/session_service.py`
  - Store chat history in Neon
  - Implement 10-message context window
  - Handle session expiration

**Checkpoint**: 95% of answers accurately reflect book content

---

## Phase 4: User Story 2 - Reader Queries Selected Text (Priority: P1) 🎯 MVP

**Goal**: Enable focused answers using only user-selected text
**Acceptance Criteria**: Selected-text queries answered using only provided context 100% of time

### Tests for User Story 2

- [x] T023 [P] [US2] Unit test for selected-text processing
  - Path: `rag-backend/tests/unit/test_selected_text.py`
  - Test context validation
  - Verify text extraction
  - Test insufficient text scenarios

### Implementation for User Story 2

- [x] T024 [P] [US2] Extend chat models for selected text
  - Path: `rag-backend/app/models/chat.py` (extend)
  - Add selectedText field to context
  - Include validation for minimum length
  - Add page context support

- [x] T025 [P] [US2] Implement selected-text validation
  - Path: `rag-backend/app/services/validation.py`
  - Validate selected text exists in book
  - Check minimum length requirements
  - Extract page/section context

- [x] T026 [P] [US2] Build context-constrained retrieval
  - Path: `rag-backend/app/services/constrained_search.py`
  - Search only within selected text context
  - Implement relevance scoring
  - Fall back gracefully if text insufficient

- [x] T027 [US2] Update RAG pipeline for selected-text mode
  - Path: `rag-backend/app/services/chat_service.py` (modified)
  - Detect selected-text queries
  - Constrain context to provided text
  - Adjust prompt engineering

- [x] T028 [US2] Handle insufficient selected-text scenarios
  - Path: `rag-backend/app/services/fallbacks.py`
  - Detect when selected text is insufficient
  - Provide helpful error messages
  - Suggest broader context selection

**Checkpoint**: Selected-text queries answered using only provided context 100% of time

---

## Phase 5: User Story 3 - Chatbot Provides Citations (Priority: P2)

**Goal**: Ensure all answers include clickable citations
**Acceptance Criteria**: 100% of responses include proper citations with clickable links

### Tests for User Story 3

- [x] T029 [P] [US3] Unit test for citation formatting
  - Path: `rag-backend/tests/unit/test_citations.py`
  - Test citation link generation
  - Verify snippet extraction
  - Test multiple citations

### Implementation for User Story 3

- [x] T030 [P] [US3] Enhance citation model with location data
  - Path: `rag-backend/app/models/chat.py` (extend)
  - Add page numbers and section IDs
  - Include anchor links for direct navigation
  - Store citation metadata

- [x] T031 [P] [US3] Implement citation ranking algorithm
  - Path: `rag-backend/app/services/citation_ranking.py`
  - Rank citations by relevance
  - Limit to top 5 citations
  - Avoid duplicate citations

- [x] T032 [US3] Create citation click tracking
  - Path: `rag-backend/app/api/v1/analytics.py`
  - Track citation click events
  - Store anonymized analytics
  - Generate citation heatmaps

**Checkpoint**: 100% of responses include proper citations

---

## Phase 6: Performance & Cost Management

**Purpose**: Optimize performance and control costs

- [ ] T033 [P] Implement response caching
  - Path: `rag-backend/app/services/cache.py`
  - Cache identical queries for 24 hours
  - Use Redis for distributed caching
  - Implement cache invalidation

- [ ] T034 [P] Add query deduplication
  - Path: `rag-backend/app/services/deduplication.py`
  - Detect similar queries
  - Reuse cached responses
  - Maintain cache hit metrics

- [ ] T035 [P] Implement rate limiting middleware
  - Path: `rag-backend/app/middleware/rate_limit.py`
  - Use Redis for distributed rate limiting
  - Set 10 requests/minute per IP
  - Include Retry-After headers

- [ ] T036 [P] Build cost tracking system
  - Path: `rag-backend/app/services/cost_manager.py`
  - Track token usage per request
  - Implement daily/monthly budgets
  - Add alerts for threshold breaches

- [ ] T037 [P] Optimize OpenAI model selection
  - Path: `rag-backend/app/services/model_router.py`
  - Route 95% to GPT-3.5-turbo
  - Use GPT-4 only for complex queries
  - Track cost savings

- [ ] T038 [P] Add performance monitoring
  - Path: `rag-backend/app/middleware/performance.py`
  - Track response times
  - Monitor database query performance
  - Alert on degradations

---

## Phase 7: Content Ingestion Pipeline

**Purpose**: Process book content for RAG (can run in parallel with user stories)

- [ ] T039 [P] Create MDX content parser
  - Path: `rag-backend/scripts/content_parser.py`
  - Extract text from MDX files
  - Preserve heading hierarchy
  - Extract code blocks and metadata

- [ ] T040 [P] Implement smart chunking algorithm
  - Path: `rag-backend/scripts/chunker.py`
  - Chunk by semantic boundaries
  - Maintain 1000-word targets
  - Add 100-word overlap for context

- [ ] T041 [P] Create metadata extraction
  - Path: `rag-backend/scripts/metadata_extractor.py`
  - Extract chapter/section info
  - Generate page URLs
  - Create searchable snippets

- [ ] T042 [P] Build batch embedding generation
  - Path: `rag-backend/scripts/embeddings.py`
  - Process chunks in batches of 100
  - Handle API rate limits
  - Track progress and errors

- [ ] T043 [P] Create ingestion pipeline
  - Path: `rag-backend/scripts/ingest.py`
  - Orchestrate full pipeline
  - Handle incremental updates
  - Generate ingestion reports

- [ ] T044 Set up automatic re-indexing
  - Path: `rag-backend/scripts/watch.py`
  - Monitor content changes
  - Trigger re-ingestion on updates
  - Maintain version history

---

## Phase 8: Privacy & Compliance

**Purpose**: Ensure GDPR compliance and privacy protection

- [ ] T045 [P] Build anonymization pipeline
  - Path: `rag-backend/app/core/anonymize.py`
  - Anonymize IP addresses
  - Generate random session IDs
  - Scrub PII from messages

- [ ] T046 [P] Implement data retention jobs
  - Path: `rag-backend/scripts/cleanup.py`
  - Delete sessions after 7 days
  - Aggregate analytics data
  - Schedule daily cleanup

- [ ] T047 [P] Add privacy audit logging
  - Path: `rag-backend/app/core/audit.py`
  - Log all data access
  - Track data deletions
  - Generate compliance reports

- [ ] T048 [P] Create opt-out mechanism
  - Path: `rag-backend/app/api/v1/privacy.py`
  - Add privacy settings endpoint
  - Handle Do-Not-Track headers
  - Provide data export

- [ ] T049 [P] Implement language detection
  - Path: `rag-backend/app/services/language_detection.py`
  - Detect non-English queries
  - Return polite English-only response
  - Log language preferences

---

## Phase 9: Deployment & Operations

**Purpose**: Deploy service and ensure operational readiness

- [ ] T050 Create deployment configuration
  - Path: `rag-backend/railway.toml`
  - Path: `rag-backend/Dockerfile`
  - Configure health checks
  - Set environment variables

- [ ] T051 [P] Set up environment-specific configs
  - Path: `rag-backend/app/core/environments.py`
  - Support dev/staging/production
  - Configure feature flags
  - Set appropriate log levels

- [ ] T052 [P] Configure monitoring dashboards
  - Path: `rag-backend/grafana/dashboards/`
  - Create metrics dashboards
  - Set up alerting rules
  - Monitor cost metrics

- [ ] T053 [P] Implement error tracking
  - Path: `rag-backend/app/core/errors.py`
  - Capture error contexts
  - Integrate with monitoring
  - Provide error recovery

- [ ] T054 Set up CI/CD pipeline
  - Path: `.github/workflows/deploy-rag.yml`
  - Run tests on PR
  - Deploy on merge to main
  - Include rollback capability

- [ ] T055 Create operations documentation
  - Path: `rag-backend/docs/operations.md`
  - Document runbooks
  - Include troubleshooting guides
  - Define escalation procedures

---

## Phase 10: Frontend Integration Updates

**Purpose**: Connect existing chatbot to real backend

- [ ] T056 Update chatbot configuration for production
  - Path: `src/config/chatbot.ts` (modify existing)
  - Replace mock endpoint with real API
  - Update error handling
  - Add production API URL

- [ ] T057 Enhance error handling in chat widget
  - Path: `src/components/chatbot/ChatBot.tsx` (modify)
  - Handle API errors gracefully
  - Add retry mechanism
  - Show helpful error messages

- [ ] T058 Add privacy notice to chat widget
  - Path: `src/components/chatbot/ChatBot.tsx` (extend)
  - Show privacy notice on first use
  - Add "English Only" indicator
  - Include clear chat button

- [ ] T059 Implement citation display enhancements
  - Path: `src/components/chatbot/ChatBot.module.css` (extend)
  - Style citations as clickable links
  - Add hover effects
  - Show snippet previews

- [ ] T060 Add rate limiting feedback
  - Path: `src/components/chatbot/ChatBot.tsx` (extend)
  - Handle 429 responses
  - Show countdown timer
  - Queue subsequent requests

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies - can start immediately
2. **Core Infrastructure (Phase 2)**: Depends on Setup - BLOCKS all user stories
3. **User Stories (Phase 3-5)**: All depend on Core Infrastructure
4. **Performance & Cost (Phase 6)**: Depends on User Stories 1-3
5. **Content Ingestion (Phase 7)**: Can run in parallel with user stories
6. **Privacy & Compliance (Phase 8)**: Depends on core functionality
7. **Deployment (Phase 9)**: Final phase after all features
8. **Frontend Updates (Phase 10)**: Can run after backend API is ready

### Parallel Opportunities

- All tasks marked [P] can run in parallel
- Content ingestion (Phase 7) can run while user stories are developed
- Frontend components already exist - just need updates
- Tests can be written alongside implementation

### MVP Implementation Order

1. **Week 1**: Phase 1 (Setup) + Phase 2 (Core Infrastructure)
2. **Week 2**: Phase 3 (User Story 1) + Phase 7 (Content Ingestion)
3. **Week 3**: Phase 4 (User Story 2) + Phase 10 (Frontend Updates)
4. **Week 4**: Phase 6 (Performance) + Phase 8 (Privacy)
5. **Week 5**: Phase 9 (Deployment) + Phase 5 (User Story 3)

### Success Criteria Check

After completing phases 3-5:
- [ ] 95% of answers accurately reflect book content
- [ ] 100% of responses include proper citations
- [ ] Response time under 2 seconds for 95% of queries
- [ ] Selected-text queries answered using only provided context
- [ ] Zero hallucinated information in responses
- [ ] Chat interface loads within 1 second
- [ ] System supports 100 concurrent conversations
- [ ] Zero PII stored (GDPR compliant)
- [ ] All chat data purged within 7 days
- [ ] Monthly costs under $500

### Risk Mitigation

- **Technical**: Comprehensive testing at each phase
- **Performance**: Load testing before deployment
- **Cost**: Real-time cost tracking with alerts
- **Privacy**: Regular GDPR compliance audits
- **Operations**: Monitoring and automated alerts