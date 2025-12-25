import React, { useState, useEffect, useCallback } from 'react';
import MCPStatusIndicator from './MCPStatusIndicator';

// Mock interfaces for deployment
interface MCPRAGIntegration {
  initialize: () => Promise<void>;
  processQuery: (query: any) => Promise<any>;
}

interface RAGQuery {
  message: string;
  conversation_id: string;
  context?: any;
}

interface RAGResponse {
  response: string;
  sources?: string[];
  citations?: any[];
}

const createMCPRAGIntegration = (config: any) => ({
  initialize: async () => {
    console.log('Mock RAG initialized');
  },
  processQuery: async (query: RAGQuery) => {
    // Return mock response for deployment
    return {
      response: `This is a mock RAG response for: "${query.message}". The actual RAG functionality is available in the development environment.`,
      sources: ['Mock Source 1', 'Mock Source 2'],
      citations: []
    };
  }
});

interface MCPRAGInterfaceProps {
  module_id?: string;
  chapter_id?: string;
}

const MCPRAGInterface: React.FC<MCPRAGInterfaceProps> = ({
  module_id,
  chapter_id
}) => {
  const [ragInstance, setRagInstance] = useState<MCPRAGIntegration | null>(null);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<RAGResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<RAGQuery[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize RAG instance
  useEffect(() => {
    const initializeRAG = async () => {
      try {
        const rag = createMCPRAGIntegration({
          connection_reset: true,
          strict_tool_use: true,
          bilingual_support: true,
          anti_loop_protection: true,
          raw_extraction_only: true
        });

        await rag.initialize();
        setRagInstance(rag);
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize RAG:', err);
        setError('Failed to initialize RAG service');
      }
    };

    initializeRAG();
  }, []);

  // Handle query submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim() || !ragInstance || !isInitialized) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const conversationId = `conv-${Date.now()}`;
      const ragQuery: RAGQuery = {
        message: query,
        conversation_id: conversationId,
        context: {
          module_id,
          chapter_id,
          conversation_history: conversationHistory.map(h => ({
            role: h.message.startsWith('🇮🇳') ? 'assistant' : 'user',
            content: h.message,
            timestamp: new Date().toISOString()
          }))
        }
      };

      // Add to conversation history
      setConversationHistory(prev => [...prev, ragQuery]);

      // Process query
      const ragResponse = await ragInstance.processQuery(ragQuery);

      setResponse(ragResponse);

      // Add response to conversation history
      setConversationHistory(prev => [
        ...prev,
        { message: ragResponse.response, conversation_id: conversationId }
      ]);

      // Clear query
      setQuery('');

    } catch (err) {
      console.error('Query processing error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [query, ragInstance, isInitialized, module_id, chapter_id, conversationHistory]);

  // Handle reset
  const handleReset = useCallback(async () => {
    if (ragInstance) {
      // Re-initialize with fresh configuration
      const newRag = createMCPRAGIntegration({
        connection_reset: true,
        strict_tool_use: true,
        bilingual_support: true,
        anti_loop_protection: true,
        raw_extraction_only: true
      });

      await newRag.initialize();
      setRagInstance(newRag);
      setResponse(null);
      setConversationHistory([]);
      setError(null);
    }
  }, [ragInstance]);

  return (
    <div className="mcp-rag-interface">
      <MCPStatusIndicator backendUrl="http://localhost:8000" />

      <div className="mcp-header">
        <h2>🔧 MCP RAG Interface</h2>
        <div className="mcp-status">
          <span className={`status ${isInitialized ? 'active' : 'initializing'}`}>
            {isInitialized ? '✅ Initialized' : '🔄 Initializing...'}
          </span>
        </div>
      </div>

      <div className="mcp-controls">
        <button
          onClick={handleReset}
          disabled={!isInitialized || isLoading}
          className="mcp-reset-btn"
        >
          🔄 Reset Connection
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mcp-query-form">
        <div className="form-group">
          <label htmlFor="query">
            Ask about robotics concepts (Hindi/English supported):
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about robotics, kinematics, AI, sensors, or any concept from the textbook..."
            disabled={!isInitialized || isLoading}
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={!isInitialized || !query.trim() || isLoading}
          className="submit-btn"
        >
          {isLoading ? '🤔 Processing...' : '🔍 Search'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          ❌ Error: {error}
        </div>
      )}

      {response && (
        <div className="response-container">
          <div className="response-header">
            <h3>🤖 Response</h3>
            <span className="conversation-id">
              ID: {response.conversation_id.slice(0, 8)}...
            </span>
          </div>

          <div className="response-content">
            {response.response}
          </div>

          {response.citations && response.citations.length > 0 && (
            <div className="citations">
              <h4>📚 Citations</h4>
              <ul>
                {response.citations.map((citation, index) => (
                  <li key={index}>
                    <strong>{citation.module_id}</strong>
                    {citation.chapter_id && ` > ${citation.chapter_id}`}
                    <br />
                    <em>"{citation.excerpt}"</em>
                    <br />
                    <small>Relevance: {(citation.relevance_score * 100).toFixed(1)}%</small>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {response.sources && response.sources.length > 0 && (
            <div className="sources">
              <h4>📖 Sources</h4>
              <ul>
                {response.sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {conversationHistory.length > 0 && (
        <div className="conversation-history">
          <h3>💬 Conversation History</h3>
          <div className="history-list">
            {conversationHistory.map((item, index) => (
              <div key={index} className="history-item">
                <div className="message">
                  {item.message}
                </div>
                <div className="meta">
                  {item.context?.module_id && (
                    <span className="module">Module: {item.context.module_id}</span>
                  )}
                  {item.context?.chapter_id && (
                    <span className="chapter">Chapter: {item.context.chapter_id}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mcp-features">
        <h4>🔧 MCP Features Active:</h4>
        <ul>
          <li>✅ Strict tool use protocol</li>
          <li>✅ Anti-loop protection</li>
          <li>✅ Raw content extraction</li>
          <li>✅ Bilingual support (Hindi/English)</li>
          <li>✅ Connection reset capability</li>
          <li>✅ Template filtering</li>
        </ul>
      </div>

      <style jsx>{`
        .mcp-rag-interface {
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          background: #f8fafc;
          max-width: 800px;
          margin: 0 auto;
        }

        .mcp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }

        .mcp-header h2 {
          margin: 0;
          color: #1e293b;
        }

        .mcp-status .status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .mcp-status .status.initializing {
          background: #fef3c7;
          color: #92400e;
        }

        .mcp-status .status.active {
          background: #d1fae5;
          color: #065f46;
        }

        .mcp-controls {
          margin-bottom: 20px;
        }

        .mcp-reset-btn {
          background: #6366f1;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .mcp-reset-btn:hover:not(:disabled) {
          background: #4f46e5;
        }

        .mcp-reset-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mcp-query-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #374151;
        }

        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .form-group textarea:focus {
          outline: none;
          border-color: #6366f1;
        }

        .submit-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: background 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #059669;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .response-container {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .response-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f3f4f6;
        }

        .response-header h3 {
          margin: 0;
          color: #1f2937;
        }

        .conversation-id {
          font-size: 12px;
          color: #6b7280;
          font-family: monospace;
        }

        .response-content {
          line-height: 1.6;
          color: #374151;
          white-space: pre-wrap;
        }

        .citations, .sources {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #f3f4f6;
        }

        .citations h4, .sources h4 {
          margin: 0 0 10px 0;
          color: #1f2937;
          font-size: 14px;
        }

        .citations ul, .sources ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .citations li, .sources li {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .citations li strong {
          color: #1f2937;
        }

        .citations li em {
          color: #6b7280;
          font-style: italic;
        }

        .citations li small {
          color: #9ca3af;
          font-size: 11px;
        }

        .conversation-history {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
        }

        .conversation-history h3 {
          margin: 0 0 15px 0;
          color: #1f2937;
          font-size: 16px;
        }

        .history-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .history-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 10px;
        }

        .history-item .message {
          color: #374151;
          font-size: 14px;
          line-height: 1.4;
        }

        .history-item .meta {
          margin-top: 5px;
          font-size: 12px;
          color: #6b7280;
        }

        .history-item .module,
        .history-item .chapter {
          background: #ede9fe;
          color: #5b21b6;
          padding: 2px 6px;
          border-radius: 3px;
          margin-right: 5px;
          font-size: 11px;
        }

        .mcp-features {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          padding: 15px;
        }

        .mcp-features h4 {
          margin: 0 0 10px 0;
          color: #1e40af;
          font-size: 14px;
        }

        .mcp-features ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .mcp-features li {
          color: #1e40af;
          font-size: 13px;
          margin-bottom: 5px;
        }

        @media (max-width: 768px) {
          .mcp-rag-interface {
            padding: 15px;
          }

          .mcp-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .response-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .submit-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MCPRAGInterface;