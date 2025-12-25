// Chatbot configuration
export const chatbotConfig = {
  // API endpoints
  api: {
    // Local development endpoint
    local: 'http://localhost:8000/api/v1/chat/completions',

    // Production endpoint - will be updated with Railway deployment URL
    production: 'https://robotic-book-railway.up.railway.app/api/v1/chat/completions',

    // Current endpoint (changes based on environment)
    current: typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:8000/api/v1/chat/completions'
      : 'https://robotic-book-railway.up.railway.app/api/v1/chat/completions',
  },

  // Chat behavior settings
  settings: {
    // Maximum number of messages to keep in memory
    maxMessages: 50,

    // Context window for conversation history
    contextWindow: 10,

    // Minimum length of selected text to prompt about asking
    minSelectedLength: 10,

    // Typing indicator delay (ms)
    typingDelay: 500,

    // Auto-hide suggestions after (ms)
    suggestionTimeout: 5000,
  },

  // UI settings
  ui: {
    // Animation duration (ms)
    animationDuration: 300,

    // Max width for chat window on mobile
    mobileMaxWidth: 480,

    // Number of typing indicator dots
    typingIndicatorDots: 3,
  },

  // RAG configuration
  rag: {
    // Number of documents to retrieve for context
    topK: 5,

    // Minimum similarity score for retrieved documents
    similarityThreshold: 0.7,

    // Maximum context length for LLM input
    maxContextLength: 4000,

    // Whether to include page URLs in citations
    includePageUrls: true,
  },

  // Analytics (optional)
  analytics: {
    // Whether to track user interactions
    enabled: false,

    // Analytics endpoint
    endpoint: null,

    // Sample rate for analytics (0-1)
    sampleRate: 0.1,
  },
};

// Default responses for offline/development mode
export const defaultResponses = [
  {
    id: 'intro',
    keywords: ['hello', 'hi', 'hey', 'welcome'],
    response: "Welcome to ROBOTIC-BOOK! I'm your AI assistant, here to help you understand robotics concepts. What would you like to learn about today?",
    suggestions: [
      "What is robotics?",
      "Tell me about robot components",
      "How do sensors work?",
    ],
  },
  {
    id: 'robotics',
    keywords: ['robotics', 'robot', 'what is'],
    response: "Robotics is a multidisciplinary field that combines engineering, computer science, and artificial intelligence to design, construct, and operate robots. Robots are programmable machines capable of carrying out complex actions autonomously or with human guidance.",
    citations: ["Chapter 1: What is Robotics?"],
  },
  {
    id: 'components',
    keywords: ['components', 'parts', 'sensors', 'actuators'],
    response: "Robots consist of several key components: 1) Sensors for perceiving the environment (cameras, LiDAR, IMUs), 2) Actuators for movement (motors, servos, hydraulic systems), 3) Control systems for processing and decision-making, and 4) Power systems for energy.",
    citations: ["Chapter 2: Robot Components"],
  },
  {
    id: 'ai',
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'neural networks'],
    response: "AI enables robots to learn, adapt, and make intelligent decisions. Key AI approaches in robotics include machine learning for pattern recognition, neural networks for perception, and reinforcement learning for learning through interaction with the environment.",
    citations: ["Chapter 3: AI Fundamentals"],
  },
  {
    id: 'mathematics',
    keywords: ['math', 'mathematics', 'kinematics', 'calculus'],
    response: "Mathematics provides the foundation for robotics, including: 1) Linear algebra for transformations and rotations, 2) Calculus for motion and dynamics, 3) Probability for uncertainty handling, and 4) Optimization for path planning.",
    citations: ["Chapter 4: Mathematics for Robotics"],
  },
  {
    id: 'help',
    keywords: ['help', 'how to', 'use'],
    response: "I can help you understand concepts from ROBOTIC-BOOK. You can:\n• Ask me questions about any topic in the book\n• Select text on a page and ask me about it\n• Request explanations of specific concepts\n• Get clarification on complex topics\n\nFeel free to explore any of the modules and chapters!",
    suggestions: [
      "Explain forward kinematics",
      "How does reinforcement learning work?",
      "What are the types of sensors?",
    ],
  },
  {
    id: 'default',
    keywords: [],
    response: "Based on ROBOTIC-BOOK, I can help you with topics including robotics fundamentals, AI applications, and mathematical foundations. Could you provide more specific context or rephrase your question?",
    citations: ["Module 1: Foundations"],
  },
];

// Helper functions
export const findDefaultResponse = (query: string): typeof defaultResponses[0] => {
  const lowerQuery = query.toLowerCase();

  // Find matching response based on keywords
  for (const response of defaultResponses) {
    if (response.id === 'default') continue;

    if (response.keywords.some(keyword => lowerQuery.includes(keyword))) {
      return response;
    }
  }

  // Return default if no match found
  return defaultResponses[defaultResponses.length - 1];
};

// Get suggestions based on current context
export const getSuggestions = (currentPath: string): string[] => {
  const pathSuggestions: Record<string, string[]> = {
    '/intro': [
      "What will I learn in this book?",
      "How is the book structured?",
      "What are the prerequisites?",
    ],
    '/module-01/': [
      "What's in Module 1?",
      "Why start with fundamentals?",
      "Do I need math background?",
    ],
    '/module-01/what-is-robotics': [
      "What's the definition of a robot?",
      "What are the types of robots?",
      "How has robotics evolved?",
    ],
    '/module-01/robot-components': [
      "How do sensors work?",
      "What are actuators?",
      "How do control systems work?",
    ],
    '/module-01/ai-fundamentals': [
      "How is AI used in robotics?",
      "What is reinforcement learning?",
      "How do neural networks help robots?",
    ],
    '/module-01/mathematics-for-robotics': [
      "Why is linear algebra important?",
      "How is calculus used in robotics?",
      "What are homogeneous transformations?",
    ],
  };

  return pathSuggestions[currentPath] || [
    "What is robotics?",
    "Explain robot components",
    "How does AI apply to robotics?",
  ];
};