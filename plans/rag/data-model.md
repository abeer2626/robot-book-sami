# Data Model: Integrated RAG Chatbot

**Feature**: 002-rag-chatbot
**Date**: 2025-01-13
**Source**: [rag.spec.md](../../specs/rag.spec.md)

## Core Entities

### ChatSession
Conversation instance between a reader and the chatbot.

**Attributes**:
- sessionId: Unique identifier (UUID)
- createdAt: Session start timestamp
- lastActivity: Last interaction timestamp
- status: Session status (active/closed/expired)
- userAgent: Browser information (anonymized)
- language: User language preference (ISO 639-1)

**Validation Rules**:
- sessionId: Required, UUID format
- lastActivity: Must be >= createdAt
- status: Must be valid enum value
- userAgent: Anonymized, no identifiable information

### Query
User question with optional selected-text context.

**Attributes**:
- queryId: Unique identifier (UUID)
- sessionId: Reference to parent session
- text: Question text (string)
- selectedText: User-selected context (string, optional)
- selectedTextLocation: Location of selected text (JSON)
- timestamp: Query timestamp
- processingTime: Time to generate response (milliseconds)

**Validation Rules**:
- text: Required, max 1000 characters
- selectedText: Optional, max 5000 characters if present
- selectedTextLocation: Required if selectedText provided

### Response
Chatbot answer with citations and sources.

**Attributes**:
- responseId: Unique identifier (UUID)
- queryId: Reference to parent query
- text: Answer text (string)
- citations: List of citation objects
- confidenceScore: Answer confidence (0.0-1.0)
- usedOnlySelectedText: Boolean indicating constraint adherence
- timestamp: Response timestamp
- modelInfo: AI model information used

**Validation Rules**:
- text: Required, max 2000 characters
- citations: Required, at least one for factual answers
- confidenceScore: Required, 0.0 to 1.0

### Citation
Reference to specific location in the book.

**Attributes**:
- citationId: Unique identifier (UUID)
- responseId: Reference to parent response
- chapterId: Reference to book chapter
- fragmentId: Specific content fragment ID
- text: Quoted passage (string)
- location: Location within chapter (JSON)
- relevanceScore: Citation relevance (0.0-1.0)

**Validation Rules**:
- chapterId: Required, must exist in book
- text: Required, exact quote from source
- relevanceScore: Required, 0.0 to 1.0

### ContentChunk
Processed piece of book content with embedding.

**Attributes**:
- chunkId: Unique identifier (UUID)
- chapterId: Reference to source chapter
- text: Content text (string)
- embedding: Vector embedding (array of floats)
- metadata: Chunk metadata (JSON)
- createdAt: Processing timestamp
- lastUpdated: Last update timestamp

**Validation Rules**:
- text: Required, optimized chunk size (200-500 words)
- embedding: Required, 1536 dimensions for text-embedding-ada-002
- metadata: Includes position, section, keywords

### UserFeedback
User ratings and feedback for responses.

**Attributes**:
- feedbackId: Unique identifier (UUID)
- responseId: Reference to response
- rating: User rating (1-5)
- comment: Optional feedback text (string)
- category: Feedback category (JSON)
- timestamp: Feedback timestamp

**Validation Rules**:
- rating: Required, integer 1-5
- comment: Optional, max 500 characters
- category: Required enum (helpful/incorrect/unclear/offensive)

## Relationships

```
ChatSession (1) -----> (*) Query
Query (1) -----------> (1) Response
Response (1) -------> (*) Citation
Chapter (1) --------> (*) ContentChunk
Response (1) -------> (0..1) UserFeedback
```

## State Transitions

### ChatSession Status Flow
```
created -> active -> closed
    |          |
    v          v
expired    inactive
```

### Query Processing Flow
```
received -> processing -> completed
    |           |
    v           v
failed    timeout
```

## Vector Storage Schema (Qdrant)

### Collection: content_chunks
```json
{
  "vectors": {
    "size": 1536,
    "distance": "Cosine"
  },
  "payload_schema": {
    "chunkId": "keyword",
    "chapterId": "keyword",
    "text": "text",
    "metadata": "json"
  }
}
```

### Points Structure
```json
{
  "id": "chunk_uuid",
  "vector": [0.1, 0.2, ...],
  "payload": {
    "chunkId": "uuid",
    "chapterId": "uuid",
    "text": "Content text",
    "metadata": {
      "position": 123,
      "section": "Introduction",
      "keywords": ["robotics", "ai"]
    }
  }
}
```

## Relational Schema (Neon)

### Tables

#### sessions
```sql
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL,
    user_agent TEXT,
    language VARCHAR(5),
    INDEX idx_sessions_status (status),
    INDEX idx_sessions_last_activity (last_activity)
);
```

#### queries
```sql
CREATE TABLE queries (
    query_id UUID PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(session_id),
    text TEXT NOT NULL,
    selected_text TEXT,
    selected_text_location JSONB,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    processing_time INTEGER,
    INDEX idx_queries_session (session_id),
    INDEX idx_queries_timestamp (timestamp)
);
```

#### responses
```sql
CREATE TABLE responses (
    response_id UUID PRIMARY KEY,
    query_id UUID NOT NULL REFERENCES queries(query_id),
    text TEXT NOT NULL,
    citations JSONB NOT NULL,
    confidence_score DECIMAL(3,2) NOT NULL,
    used_only_selected_text BOOLEAN NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    model_info JSONB,
    INDEX idx_responses_query (query_id),
    INDEX idx_responses_confidence (confidence_score)
);
```

#### feedback
```sql
CREATE TABLE feedback (
    feedback_id UUID PRIMARY KEY,
    response_id UUID NOT NULL REFERENCES responses(response_id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    category JSONB,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    INDEX idx_feedback_response (response_id),
    INDEX idx_feedback_rating (rating)
);
```

## Privacy and GDPR Compliance

### Data Anonymization
- Session IDs: UUID only, no IP addresses
- User agents: Strip unique identifiers, keep browser family
- Queries: Remove potential PII before storage
- Feedback: Store without user identification

### Data Retention
- Session data: 90 days after last activity
- Query/Response pairs: 180 days for analytics
- Feedback: 365 days for service improvement
- Vector data: Retained until content changes

### Right to Erasure
- All personal data deletable via session ID
- Automated cleanup jobs for expired data
- Export functionality for user data requests