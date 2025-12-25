// Test script to verify mock RAG client functionality
const { ChatRequest } = {
  message: "test message"
};

// Simulate the mock responses logic
const query = "kinematics".toLowerCase();
const mockResponses = {
  'robotics': {
    response: "Robotics is a multidisciplinary field that combines engineering, computer science, and artificial intelligence to design, construct, and operate robots. Robots are programmable machines capable of carrying out complex series of actions automatically.",
    conversation_id: 'mock-session-test',
    citations: [{
      id: '1',
      text: "A robot is a programmable machine capable of carrying out a complex series of actions automatically.",
      chapter: "Chapter 1: What is Robotics?",
      page: "1",
      url: "/module-01/1-what-is-robotics",
      relevance_score: 0.95,
    }],
    sources: ["Chapter 1: What is Robotics?"],
  },
  'sensor': {
    response: "Sensors are devices that detect and respond to physical stimuli, converting them into signals that can be processed by a robot's control system. Key types include cameras for vision, LiDAR for range sensing, IMUs for orientation, and tactile sensors for touch.",
    conversation_id: 'mock-session-test',
    citations: [{
      id: '2',
      text: "Sensors provide robots with the ability to perceive their environment.",
      chapter: "Chapter 2: Robot Components",
      page: "2",
      url: "/module-01/2-robot-components",
      relevance_score: 0.92,
    }],
    sources: ["Chapter 2: Robot Components"],
  },
  'kinematics': {
    response: "Kinematics is the study of motion without considering forces. Forward kinematics calculates end-effector position from joint angles, while inverse kinematics determines joint angles to reach a desired position. This is fundamental for robot motion planning.",
    conversation_id: 'mock-session-test',
    citations: [{
      id: '3',
      text: "Kinematics uses linear algebra and transformations to describe robot motion.",
      chapter: "Chapter 4: Mathematics for Robotics",
      page: "4",
      url: "/module-01/4-mathematics-for-robotics",
      relevance_score: 0.90,
    }],
    sources: ["Chapter 4: Mathematics for Robotics"],
  },
  'reinforcement learning': {
    response: "Reinforcement Learning (RL) is an approach where robots learn through interaction with their environment, receiving rewards for desired behaviors. It's particularly useful for tasks where explicit programming is difficult, such as walking locomotion or manipulation.",
    conversation_id: 'mock-session-test',
    citations: [{
      id: '4',
      text: "RL enables robots to learn optimal behaviors through trial and error.",
      chapter: "Chapter 3: AI Fundamentals",
      page: "3",
      url: "/module-01/3-ai-fundamentals",
      relevance_score: 0.88,
    }],
    sources: ["Chapter 3: AI Fundamentals"],
  },
};

// Find matching response
for (const [key, response] of Object.entries(mockResponses)) {
  if (query.includes(key)) {
    console.log("✅ Found matching mock response for:", key);
    console.log("Response:", response.response);
    console.log("Sources:", response.sources);
    console.log("Citations:", response.citations.length);
    break;
  }
}