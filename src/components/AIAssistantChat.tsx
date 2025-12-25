/**
 * AI Assistant Chat Component
 * A React component for interacting with the AI assistant
 */

import React, { useState, useEffect } from 'react';
import { askAssistant, AssistantResponse } from '../lib/gemini';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  error?: boolean;
}

export const AIAssistantChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ isConfigured: boolean; model?: string }>({
    isConfigured: false,
    model: undefined,
  });

  // Initialize status on mount
  useEffect(() => {
    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    setStatus({
      isConfigured: !!apiKey,
      model: apiKey ? 'gemini-1.5-flash' : undefined,
    });
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get AI response
      const response: AssistantResponse = await askAssistant(input);

      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response || 'Sorry, I couldn\'t process your request.',
        sender: 'ai',
        timestamp: response.timestamp,
        error: !response.success,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message || 'An unexpected error occurred.'}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        error: true,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!status.isConfigured) {
    return (
      <div className="ai-assistant-container">
        <div className="alert alert--warning">
          <strong>AI Assistant Not Configured</strong>
          <p>Please set the GEMINI_API_KEY environment variable to use the AI assistant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-assistant-container">
      <div className="ai-assistant-header">
        <h3>🤖 AI Assistant</h3>
        <small>Powered by Google Gemini ({status.model})</small>
      </div>

      <div className="ai-assistant-messages">
        {messages.length === 0 ? (
          <div className="ai-assistant-welcome">
            <p>Ask me anything about robotics, AI, programming, or any topic!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`ai-assistant-message ai-assistant-message--${message.sender} ${
                message.error ? 'ai-assistant-message--error' : ''
              }`}
            >
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="ai-assistant-message ai-assistant-message--ai">
            <div className="message-content">
              <em>Thinking...</em>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="ai-assistant-input-form">
        <div className="ai-assistant-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            disabled={isLoading}
            className="ai-assistant-input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="button button--primary ai-assistant-send-button"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .ai-assistant-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
        }

        .ai-assistant-header {
          text-align: center;
          margin-bottom: 1rem;
        }

        .ai-assistant-messages {
          min-height: 300px;
          max-height: 500px;
          overflow-y: auto;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          background-color: var(--ifm-background-color);
        }

        .ai-assistant-welcome {
          text-align: center;
          color: var(--ifm-color-emphasis-600);
          padding: 2rem;
        }

        .ai-assistant-message {
          margin-bottom: 1rem;
          padding: 0.75rem;
          border-radius: 8px;
          max-width: 80%;
        }

        .ai-assistant-message--user {
          margin-left: auto;
          background-color: var(--ifm-color-primary-lightest);
          text-align: right;
        }

        .ai-assistant-message--ai {
          margin-right: auto;
          background-color: var(--ifm-color-secondary-lightest);
        }

        .ai-assistant-message--error {
          background-color: var(--ifm-color-danger-lightest);
          border-left: 3px solid var(--ifm-color-danger);
        }

        .message-content {
          margin-bottom: 0.25rem;
        }

        .message-timestamp {
          font-size: 0.75rem;
          color: var(--ifm-color-emphasis-600);
        }

        .ai-assistant-input-form {
          display: flex;
          flex-direction: column;
        }

        .ai-assistant-input-container {
          display: flex;
          gap: 0.5rem;
        }

        .ai-assistant-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 8px;
          font-size: 1rem;
        }

        .ai-assistant-send-button {
          padding: 0 1.5rem;
        }
      `}</style>
    </div>
  );
};