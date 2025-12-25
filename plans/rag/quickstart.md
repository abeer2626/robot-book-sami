# Quickstart Guide: Integrated RAG Chatbot

**Feature**: 002-rag-chatbot
**Version**: 1.0.0
**Last Updated**: 2025-01-13

## Prerequisites

- Python 3.11+ installed
- Qdrant Cloud account and API key
- Neon database account and connection string
- OpenAI API key with appropriate access
- Existing Docusaurus book project

## Initial Setup (10 minutes)

### 1. Clone RAG Service
```bash
# Clone the RAG service into your project
git clone <repository-url> api/rag-chatbot
cd api/rag-chatbot

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
# Create environment file
cp .env.example .env

# Edit .env with your credentials
OPENAI_API_KEY=sk-your-openai-key
QDRANT_URL=your-qdrant-url
QDRANT_API_KEY=your-qdrant-key
NEON_CONNECTION_STRING=postgresql://user:pass@host/db
```

### 4. Initialize Databases
```bash
# Run database migrations
python scripts/init_db.py

# Create Qdrant collection
python scripts/init_qdrant.py
```

## Ingesting Book Content (5 minutes)

### 1. Export Book Content
```bash
# From your Docusaurus root
npm run export-content

# This creates content/export.json with all book content
```

### 2. Process and Ingest
```bash
# From api/rag-chatbot directory
python scripts/ingest.py --source ../content/export.json

# This process:
# - Chunks content for optimal retrieval
# - Generates embeddings via OpenAI
# - Stores in Qdrant vector database
# - Updates Neon with metadata
```

### 3. Verify Ingestion
```bash
# Test search functionality
python scripts/test_search.py --query "robotics basics"

# Should return relevant content chunks with citations
```

## Integrating with Docusaurus (5 minutes)

### 1. Add Chat Widget to Docusaurus
```bash
# From Docusaurus root
npm install @rag-chatbot/react-widget

# Add to docusaurus.config.ts
{
  themeConfig: {
    // ... existing config
    customCss: [
      require.resolve('./src/css/integrations.css'),
    ],
  },
  plugins: [
    ['@rag-chatbot/docusaurus-plugin', {
      apiUrl: process.env.RAG_API_URL || 'http://localhost:8000',
      enableOnPages: ['**'], // All pages
    }],
  ],
}
```

### 2. Start Services
```bash
# Terminal 1: Start RAG API
cd api/rag-chatbot
uvicorn app.main:app --reload --port 8000

# Terminal 2: Start Docusaurus
cd ../../
npm start
```

### 3. Test Integration
- Navigate to your book
- Chat widget appears in bottom-right corner
- Ask questions about book content
- Verify citations link to correct sections

## Deployment (10 minutes)

### 1. Deploy RAG Service
```bash
# Using Fly.io (example)
fly launch
fly secrets set OPENAI_API_KEY=sk-...
fly secrets set QDRANT_URL=...
fly deploy

# Note down the deployed URL
```

### 2. Update Production Configuration
```bash
# Update Docusaurus config
process.env.RAG_API_URL = 'https://your-rag-app.fly.dev'

# Commit and push
git add .
git commit -m "Integrate RAG chatbot"
git push
```

### 3. Verify Production
- Deployed site should show chat widget
- Test with real book content
- Monitor logs for any issues

## Usage Examples

### Basic Question
**User**: "What are the main components of a robot?"
**Response**: "According to Section 2.1, robots typically consist of sensors, actuators, and controllers..."

### Selected Text Question
1. User selects text: "The PID controller is essential for robot motion control"
2. User asks: "How does this controller work?"
3. Response answers using only selected text context

### Citation Example
Response includes:
- Answer text with explanations
- [📖 Section 2.3] (clickable link)
- [📖 Chapter 5] (clickable link)

## Monitoring and Maintenance

### Health Checks
```bash
# API health endpoint
curl https://your-api.com/health

# Expected response
{"status": "healthy", "components": {...}}
```

### View Analytics
```python
# Check usage statistics
python scripts/analytics.py --period 7d

# Shows:
# - Number of queries
# - Average response time
# - User satisfaction ratings
```

### Common Updates
```bash
# Re-ingest content after book updates
python scripts/ingest.py --source ../content/export.json --update

# Clear old sessions
python scripts/cleanup_sessions.py --days 30
```

## Performance Optimization

### Vector Database
- Use quantization for large content sets
- Implement hybrid search for better relevance
- Regularly optimize HNSW index

### API Performance
- Enable response caching
- Use connection pooling for database
- Monitor query times and optimize slow queries

### Frontend Widget
- Lazy load chat interface
- Implement query debouncing
- Cache frequent responses

## Security and Privacy

### GDPR Compliance
- All session data anonymized
- Automatic data cleanup after retention period
- Users can request data deletion

### API Security
- Rate limiting implemented
- Input sanitization
- No PII stored in responses

### Monitoring
- Error logging for debugging
- Performance metrics collection
- Anomaly detection for unusual usage

## Troubleshooting

### Common Issues

**No responses from chatbot**
- Check OpenAI API quota
- Verify Qdrant connection
- Review API logs

**Incorrect citations**
- Re-ingest content with latest book
- Check chunking strategy
- Verify embedding model

**Slow responses**
- Check database connection pooling
- Monitor OpenAI API latency
- Consider response caching

### Debug Mode
```bash
# Enable debug logging
export DEBUG=true
uvicorn app.main:app --reload

# Check detailed logs for each query
```

## Next Steps

1. Set up automated monitoring
2. Configure alerts for API failures
3. Implement A/B testing for response quality
4. Add user feedback collection
5. Scale based on usage patterns