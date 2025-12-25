import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatBot.module.css';
import { chatbotConfig, findDefaultResponse, getSuggestions } from '@site/src/config/chatbot';
import { getRAGClient, ChatRequest, MockRAGClient } from '@site/src/lib/rag-client';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  citations?: string[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 10) {
        setSelectedText(text);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() && !selectedText) return;

    const userMessage = input.trim() || selectedText;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare the request
    const request: ChatRequest = {
      message: userMessage,
      conversation_id: 'chat-session-' + Date.now(),
      context: {
        selectedText: selectedText || undefined,
        currentPage: window.location.pathname,
        conversationHistory: messages
          .slice(-chatbotConfig.settings.contextWindow)
          .map(msg => ({
            role: msg.isUser ? 'user' as const : 'assistant' as const,
            content: msg.text,
          })),
      },
    };

    try {
      // Get the RAG client (will use mock if backend not available)
      const client = await getRAGClient();

      // Get response from RAG system
      const response = await client.chat(request);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        citations: response.sources,
      };

      setMessages(prev => [...prev, botMessage]);
      setSelectedText('');
    } catch (error) {
      console.error('Error getting response:', error);
      // Try to get a mock response as fallback
      try {
        const mockClient = new MockRAGClient();
        const mockResponse = await mockClient.chat(request);

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: mockResponse.response,
          isUser: false,
          timestamp: new Date(),
          citations: mockResponse.sources,
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (mockError) {
        console.error('Mock client also failed:', mockError);
        // Fallback to a user-friendly message if mock also fails
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm having trouble connecting to my knowledge base right now. You can still explore the book content, or try asking your question again in a moment.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useSelectedText = () => {
    if (selectedText) {
      setInput(selectedText);
      setSelectedText('');
    }
  };

  return (
    <div className={styles.chatBot}>
      {!isOpen && (
        <button
          className={styles.chatButton}
          onClick={() => setIsOpen(true)}
          aria-label="Open chat assistant"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>ROBOTIC-BOOK Assistant</h3>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className={styles.chatMessages}>
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <p>👋 Welcome to ROBOTIC-BOOK!</p>
                <p>I can help you understand concepts from the book. Ask me any question!</p>
                {selectedText && (
                  <div className={styles.selectedTextPrompt}>
                    <p>You've selected: "{selectedText}"</p>
                    <button
                      className={styles.useSelectionButton}
                      onClick={useSelectedText}
                    >
                      Ask about this
                    </button>
                  </div>
                )}
              </div>
            )}

            {messages.map(message => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.isUser ? styles.userMessage : styles.botMessage
                }`}
              >
                <div className={styles.messageContent}>
                  <p>{message.text}</p>
                  {message.citations && (
                    <div className={styles.citations}>
                      <small>References: {message.citations.join(', ')}</small>
                    </div>
                  )}
                </div>
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInput}>
            {selectedText && (
              <div className={styles.selectedTextBar}>
                <small>Selected: {selectedText.slice(0, 50)}...</small>
              </div>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about the book..."
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || (!input.trim() && !selectedText)}
              className={styles.sendButton}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;