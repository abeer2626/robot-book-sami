import React, { useState, useEffect } from 'react';
import MCPRAGInterface from '../components/MCPRAGInterface';
import MCPAssistant from '../components/MCPAssistant';

export default function MCPRAGPage() {
  const [showAssistant, setShowAssistant] = useState(true);

  // Hide assistant after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAssistant(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh'
    }}>
      {showAssistant && <MCPAssistant />}

      <div style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            color: '#1e293b',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            🔧 MCP RAG Interface
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b',
            marginBottom: '20px'
          }}>
            Enhanced Robotics Textbook Search with Model Context Protocol
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              background: '#dbeafe',
              color: '#1e40af',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🤖 AI-Powered
            </span>
            <span style={{
              background: '#dcfce7',
              color: '#166534',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🌐 Bilingual (Hindi/English)
            </span>
            <span style={{
              background: '#fef3c7',
              color: '#92400e',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🔄 Anti-Loop Protection
            </span>
            <span style={{
              background: '#fce7f3',
              color: '#9f1239',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🔒 Strict Protocol
            </span>
          </div>
        </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        marginBottom: '40px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            color: '#1e293b',
            marginBottom: '15px',
            fontSize: '1.5rem'
          }}>
            📚 Ask About Robotics
          </h2>
          <p style={{
            color: '#64748b',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            Search through the entire robotics textbook content using advanced AI.
            Get accurate answers with proper citations and sources.
          </p>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            color: '#475569'
          }}>
            <li style={{ marginBottom: '10px' }}>🎯 Accurate content retrieval</li>
            <li style={{ marginBottom: '10px' }}>📖 Proper source citations</li>
            <li style={{ marginBottom: '10px' }}>💬 Conversation history</li>
            <li style={{ marginBottom: '10px' }}>🌐 Hindi/English support</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            color: '#1e293b',
            marginBottom: '15px',
            fontSize: '1.5rem'
          }}>
            🔧 MCP Features
          </h2>
          <p style={{
            color: '#64748b',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            Enhanced search capabilities with Model Context Protocol integration
            for maximum accuracy and performance.
          </p>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            color: '#475569'
          }}>
            <li style={{ marginBottom: '10px' }}>✅ Strict tool use validation</li>
            <li style={{ marginBottom: '10px' }}>🔄 Connection reset capability</li>
            <li style={{ marginBottom: '10px' }}>📄 Raw content extraction</li>
            <li style={{ marginBottom: '10px' }}>🚫 Template prevention</li>
          </ul>
        </div>
      </div>
    </div>

      <div style={{
        marginBottom: '30px',
        textAlign: 'center',
          padding: '20px',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px'
      }}>
        <p style={{
          color: '#475569',
          fontSize: '16px',
          margin: 0
        }}>
          💡 <strong>Tip:</strong> Ask questions like "What is robotics?",
          "Explain kinematics", or "How does AI work in robots?"
        </p>
      </div>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <MCPRAGInterface />
      </div>
    </div>
  );
}