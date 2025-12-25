import React, { useState, useEffect } from 'react';

interface MCPStatusIndicatorProps {
  backendUrl?: string;
}

const MCPStatusIndicator: React.FC<MCPStatusIndicatorProps> = ({
  backendUrl = 'http://localhost:8000'
}) => {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [lastChecked, setLastChecked] = useState<string>('');
  const [connectionIssues, setConnectionIssues] = useState<string[]>([]);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [backendUrl]);

  const checkConnection = async () => {
    setStatus('connecting');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setStatus('connected');
        setLastChecked(new Date().toLocaleTimeString());
        setConnectionIssues([]);
      } else {
        throw new Error(`Health check failed: ${response.status}`);
      }
    } catch (error) {
      setStatus('disconnected');
      setLastChecked(new Date().toLocaleTimeString());

      // Identify specific connection issues
      const issues: string[] = [];

      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          issues.push('Network unreachable');
        } else if (error.message.includes('ECONNREFUSED')) {
          issues.push('Server not running');
        } else if (error.message.includes('timeout')) {
          issues.push('Connection timeout');
        } else {
          issues.push(error.message);
        }
      } else {
        issues.push('Unknown connection error');
      }

      setConnectionIssues(issues);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      case 'disconnected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'MCP Server Connected';
      case 'connecting': return 'Connecting to MCP...';
      case 'disconnected': return 'MCP Disconnected';
      default: return 'Unknown Status';
    }
  };

  const handleReconnect = () => {
    checkConnection();
  };

  return (
    <div className="mcp-status-indicator">
      <div className="status-main">
        <div
          className="status-dot"
          style={{ backgroundColor: getStatusColor() }}
        />
        <span className="status-text">{getStatusText()}</span>
        <span className="last-checked">Last checked: {lastChecked}</span>
      </div>

      {connectionIssues.length > 0 && (
        <div className="connection-issues">
          <button
            onClick={handleReconnect}
            className="reconnect-btn"
          >
            🔄 Reconnect
          </button>
          <ul>
            {connectionIssues.map((issue, index) => (
              <li key={index}>❌ {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {status === 'connected' && (
        <div className="connection-success">
          ✅ MCP server is running perfectly on port 8000
          <br />
          <small>Ready to assist with robotics textbook queries</small>
        </div>
      )}

      <style jsx>{`
        .mcp-status-indicator {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .status-main {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
          }
        }

        .status-text {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .last-checked {
          font-size: 12px;
          color: #6b7280;
          margin-left: auto;
        }

        .connection-issues {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #f3f4f6;
        }

        .connection-issues ul {
          list-style: none;
          padding: 0;
          margin: 5px 0 0 0;
          font-size: 13px;
          color: #dc2626;
        }

        .reconnect-btn {
          background: #6366f1;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          margin-bottom: 5px;
          transition: background 0.2s;
        }

        .reconnect-btn:hover {
          background: #4f46e5;
        }

        .connection-success {
          color: #059669;
          font-size: 13px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #f3f4f6;
        }

        .connection-success small {
          color: #6b7280;
          font-size: 11px;
          margin-top: 2px;
          display: block;
        }

        @media (max-width: 640px) {
          .status-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .last-checked {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MCPStatusIndicator;