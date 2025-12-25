import React, { useState, useEffect } from 'react';

const MCPAssistant: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  const tips = [
    {
      title: "🤖 Ask About Robotics Concepts",
      content: "Try asking: 'What is robotics?', 'Explain kinematics', or 'How do sensors work in robots?'",
      icon: "🤖"
    },
    {
      title: "🌐 Use Hindi or English",
      content: "The MCP interface supports both languages. Try: 'Robotics kya hai?' or 'कृत्रिम बुद्धिमत्ता कैसे काम करती है?'",
      icon: "🌐"
    },
    {
      title: "📚 Get Exact Citations",
      content: "All responses include proper citations from the robotics textbook with page numbers and sources.",
      icon: "📚"
    },
    {
      title: "🔄 Anti-Loop Protection",
      content: "The MCP system prevents repetitive queries to ensure you always get fresh, relevant information.",
      icon: "🔄"
    },
    {
      title: "🔧 Reset Connection",
      content: "Use the reset button to clear conversation history and start fresh with a clean connection.",
      icon: "🔧"
    }
  ];

  const dismissWelcome = () => {
    setShowWelcome(false);
  };

  useEffect(() => {
    if (!showWelcome) {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [showWelcome, tips.length]);

  if (showWelcome) {
    return (
      <div className="mcp-welcome-assistant">
        <div className="welcome-card">
          <div className="welcome-header">
            <h3>🎉 Welcome to MCP RAG Assistant!</h3>
            <p>Your robotics textbook expert is ready to help</p>
          </div>

          <div className="quick-start">
            <h4>Quick Start Examples:</h4>
            <div className="example-grid">
              <button className="example-btn" onClick={() => dismissWelcome()}>
                🤖 "What is robotics?"
              </button>
              <button className="example-btn" onClick={() => dismissWelcome()}>
                ⚙️ "Explain kinematics"
              </button>
              <button className="example-btn" onClick={() => dismissWelcome()}>
                🌐 "Robotics kya hai?"
              </button>
              <button className="example-btn" onClick={() => dismissWelcome()}>
                🔌 "How do sensors work?"
              </button>
            </div>
          </div>

          <div className="features-list">
            <h4>Features Available:</h4>
            <ul>
              <li>✅ AI-powered robotics knowledge</li>
              <li>✅ Bilingual support (Hindi/English)</li>
              <li>✅ Precise textbook citations</li>
              <li>✅ Anti-loop query protection</li>
              <li>✅ Conversation history tracking</li>
            </ul>
          </div>

          <button className="get-started-btn" onClick={dismissWelcome}>
            Let's Start Learning! 🚀
          </button>
        </div>
      </div>
    );
  }

  const tip = tips[currentTip];

  return (
    <div className="mcp-assistant-tip">
      <div className="tip-header">
        <span className="tip-icon">{tip.icon}</span>
        <h4>{tip.title}</h4>
      </div>
      <p className="tip-content">{tip.content}</p>

      <div className="tip-navigation">
        <span className="tip-indicator">
          {currentTip + 1} / {tips.length}
        </span>
      </div>

      <style jsx>{`
        .mcp-welcome-assistant {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          max-width: 500px;
          width: 90%;
        }

        .welcome-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 30px;
          color: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .welcome-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .welcome-header h3 {
          margin: 0 0 10px 0;
          font-size: 24px;
          font-weight: bold;
        }

        .welcome-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }

        .quick-start {
          margin-bottom: 25px;
        }

        .quick-start h4 {
          margin: 0 0 15px 0;
          font-size: 18px;
        }

        .example-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .example-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .example-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .features-list {
          margin-bottom: 25px;
        }

        .features-list h4 {
          margin: 0 0 10px 0;
          font-size: 18px;
        }

        .features-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .features-list li {
          padding: 5px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .get-started-btn {
          width: 100%;
          background: white;
          color: #667eea;
          border: none;
          padding: 15px;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .get-started-btn:hover {
          transform: scale(1.02);
        }

        .mcp-assistant-tip {
          position: fixed;
          bottom: 20px;
          right: 20px;
          max-width: 350px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.5s ease-out;
          z-index: 999;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tip-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .tip-icon {
          font-size: 20px;
        }

        .tip-header h4 {
          margin: 0;
          color: #1f2937;
          font-size: 16px;
        }

        .tip-content {
          color: #4b5563;
          line-height: 1.5;
          margin: 0 0 15px 0;
        }

        .tip-navigation {
          display: flex;
          justify-content: flex-end;
        }

        .tip-indicator {
          background: #f3f4f6;
          color: #6b7280;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .mcp-assistant-tip {
            bottom: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }

          .example-grid {
            grid-template-columns: 1fr;
          }

          .welcome-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default MCPAssistant;