import React from 'react';
import { StrictRAGInterface } from '../components/StrictRAGInterface';

export default function RAGPage() {
  return (
    <div className="rag-page-container">
      <div className="rag-page-header">
        <h1>Strict RAG Interface</h1>
        <p className="rag-description">
          Advanced Query Interface with Anti-Loop Mechanisms and Raw Extraction Mode
        </p>
      </div>

      <div className="rag-content-wrapper">
        <StrictRAGInterface
          onQuery={(query) => console.log('RAG Query:', query)}
          onResponse={(response) => console.log('RAG Response:', response)}
        />
      </div>

      <div className="rag-footer">
        <div className="footer-section">
          <h3>Features</h3>
          <ul>
            <li>Anti-loop mechanisms prevent repetitive queries</li>
            <li>Raw extraction mode for direct content retrieval</li>
            <li>Strict validation ensures quality responses</li>
            <li>Query history tracking and management</li>
            <li>Configuration reset and testing capabilities</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Configuration</h3>
          <ul>
            <li>MCP Connection Protocol</li>
            <li>Highest Server Priority</li>
            <li>Intro/Outro Removal</li>
            <li>Direct Quote Response Format</li>
            <li>Forbidden Template Blocking</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Usage</h3>
          <ul>
            <li>Enter queries in the text area</li>
            <li>Click "Search" to process</li>
            <li>View responses with raw extracted content</li>
            <li>Monitor query history</li>
            <li>Use "Reset" to clear all state</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .rag-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .rag-page-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-light) 100%);
          border-radius: 12px;
          color: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .rag-page-header h1 {
          margin: 0 0 15px 0;
          font-size: 2.5rem;
          font-weight: 700;
        }

        .rag-description {
          margin: 0;
          font-size: 1.1rem;
          opacity: 0.95;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .rag-content-wrapper {
          margin-bottom: 40px;
        }

        .rag-footer {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 50px;
          padding-top: 30px;
          border-top: 2px solid var(--ifm-color-emphasis-200);
        }

        .footer-section {
          background: var(--ifm-background-surface-color);
          padding: 25px;
          border-radius: 8px;
          border-left: 4px solid var(--ifm-color-primary);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .footer-section h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: var(--ifm-color-primary);
          font-size: 1.3rem;
        }

        .footer-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .footer-section li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .rag-page-container {
            padding: 15px;
          }

          .rag-page-header {
            padding: 20px;
            margin-bottom: 30px;
          }

          .rag-page-header h1 {
            font-size: 2rem;
          }

          .rag-footer {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-top: 30px;
          }

          .footer-section {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}