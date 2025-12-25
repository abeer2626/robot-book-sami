import React, { useState, useEffect, useCallback } from 'react';
import { strictRAGController } from '../lib/strict-rag-config';

interface StrictRAGInterfaceProps {
  onQuery?: (query: string) => void;
  onResponse?: (response: string) => void;
}

export const StrictRAGInterface: React.FC<StrictRAGInterfaceProps> = ({
  onQuery,
  onResponse
}) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<Array<{ query: string; response: string; timestamp: Date }>>([]);
  const [config, setConfig] = useState(strictRAGController.getConfig());

  // Handle query submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim() || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setResponse('');

    try {
      // Call onQuery callback if provided
      onQuery?.(query);

      // Process query with strict RAG
      const result = await strictRAGController.processQuery(query);

      setResponse(result);

      // Call onResponse callback if provided
      onResponse?.(result);

      // Add to history
      setHistory(prev => [
        { query, response: result, timestamp: new Date() },
        ...prev.slice(0, 9) // Keep last 10 interactions
      ]);

    } catch (error) {
      setResponse('System Error: Query processing failed');
    } finally {
      setIsProcessing(false);
    }
  }, [query, isProcessing, onQuery, onResponse]);

  // Handle reset
  const handleReset = useCallback(() => {
    strictRAGController.reset();
    setQuery('');
    setResponse('');
    setHistory([]);
  }, []);

  // Test configuration
  const testConfig = useCallback(async () => {
    setIsProcessing(true);
    try {
      const testQuery = 'robot components';
      const result = await strictRAGController.processQuery(testQuery);
      setResponse(`Test Result: ${result}`);
    } catch (error) {
      setResponse('Test Failed: Configuration error');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <div className="strict-rag-interface">
      <div className="rag-header">
        <h3>Strict RAG Interface</h3>
        <div className="rag-controls">
          <button
            onClick={handleReset}
            disabled={isProcessing}
            className="reset-btn"
          >
            🔃 Reset
          </button>
          <button
            onClick={testConfig}
            disabled={isProcessing}
            className="test-btn"
          >
            🧪 Test
          </button>
        </div>
      </div>

      <div className="rag-configuration">
        <h4>Configuration Status</h4>
        <div className="config-details">
          <div className="config-item">
            <span className="config-label">Protocol:</span>
            <span className="config-value">{config.connection_protocol}</span>
          </div>
          <div className="config-item">
            <span className="config-label">Priority:</span>
            <span className="config-value">{config.server_priority}</span>
          </div>
          <div className="config-item">
            <span className="config-label">Mode:</span>
            <span className="config-value">{config.retrieval_rules.mode}</span>
          </div>
          <div className="config-item">
            <span className="config-label">Intro/Outro Removal:</span>
            <span className="config-value">
              {config.retrieval_rules.intro_outro_removal ? '✅ Enabled' : '❌ Disabled'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rag-query-form">
        <div className="form-group">
          <label htmlFor="query">Enter Query:</label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about robotics, components, AI, control systems..."
            disabled={isProcessing}
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || isProcessing}
          className="submit-btn"
        >
          {isProcessing ? '⏳ Processing...' : '🔍 Search'}
        </button>
      </form>

      {response && (
        <div className="rag-response">
          <h4>Response:</h4>
          <div className="response-content">
            <pre>{response}</pre>
          </div>
          {response === 'NO_DATA_FOUND' && (
            <div className="no-data-warning">
              ⚠️ No data found. Query may be blocked by anti-loop mechanisms or content not available.
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="rag-history">
          <h4>Recent History:</h4>
          <div className="history-list">
            {history.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-query">
                  <strong>Q:</strong> {item.query}
                </div>
                <div className="history-response">
                  <strong>A:</strong> {item.response}
                </div>
                <div className="history-time">
                  {item.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .strict-rag-interface {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border: 2px solid var(--ifm-color-primary);
          border-radius: 8px;
          background: var(--ifm-background-surface-color);
        }

        .rag-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .rag-header h3 {
          margin: 0;
          color: var(--ifm-color-primary);
        }

        .rag-controls {
          display: flex;
          gap: 10px;
        }

        .reset-btn, .test-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .reset-btn {
          background: #ff6b6b;
          color: white;
        }

        .test-btn {
          background: #4ecdc4;
          color: white;
        }

        .rag-controls button:hover {
          opacity: 0.9;
        }

        .rag-configuration {
          background: var(--ifm-color-emphasis-100);
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .config-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .config-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .config-label {
          font-weight: 600;
          color: var(--ifm-color-emphasis-700);
        }

        .rag-query-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 4px;
          font-family: inherit;
          resize: vertical;
        }

        .submit-btn {
          background: var(--ifm-color-primary);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: background-color 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--ifm-color-primary-dark);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .rag-response {
          background: var(--ifm-color-emphasis-50);
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .response-content pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          margin: 0;
          font-family: inherit;
          line-height: 1.5;
        }

        .no-data-warning {
          margin-top: 10px;
          padding: 10px;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          color: #856404;
        }

        .rag-history {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 6px;
          padding: 10px;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          padding: 10px;
          background: var(--ifm-background-surface-color);
          border-radius: 4px;
          border-left: 3px solid var(--ifm-color-primary);
        }

        .history-query, .history-response {
          margin-bottom: 5px;
        }

        .history-time {
          font-size: 12px;
          color: var(--ifm-color-emphasis-500);
        }

        @media (max-width: 768px) {
          .strict-rag-interface {
            padding: 15px;
          }

          .rag-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .config-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};