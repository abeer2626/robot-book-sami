const fs = require('fs');
const path = require('path');

// Build search index from documentation structure
function buildComprehensiveIndex() {
  const index = {
    documents: [
      // Module 1: Foundations
      {
        id: 'module-01-intro',
        title: 'Module 1: Foundations',
        type: 'module',
        module: 'module-01',
        url: '/docs/module-01',
        description: 'Introduction to robotics, components, and AI fundamentals',
        keywords: ['robotics', 'introduction', 'foundations', 'ai', 'components'],
        headings: ['Introduction to Robotics', 'Foundations'],
        content: 'Introduction to robotics, components, and AI fundamentals',
        learningObjectives: [
          'Understand what robotics is and its fundamental concepts',
          'Identify key components of robotic systems',
          'Learn about AI integration in modern robotics'
        ],
        matches: {},
        highlights: []
      },
      // Module 2: Core Concepts
      {
        id: 'module-02-intro',
        title: 'Module 2: Core Concepts',
        type: 'module',
        module: 'module-02',
        url: '/docs/module-02',
        description: 'Motion planning, control systems, and perception',
        keywords: ['motion', 'planning', 'control', 'systems', 'perception', 'kinematics'],
        headings: ['Core Concepts', 'Motion Planning', 'Control Systems'],
        content: 'Motion planning, control systems, and perception',
        learningObjectives: [
          'Understand motion planning algorithms',
          'Learn about control systems in robotics',
          'Implement basic perception systems'
        ],
        matches: {},
        highlights: []
      },
      // Module 3: Advanced Topics
      {
        id: 'module-03-intro',
        title: 'Module 3: Advanced Topics',
        type: 'module',
        module: 'module-03',
        url: '/docs/module-03',
        description: 'Machine learning, computer vision, and neural networks',
        keywords: ['machine', 'learning', 'computer', 'vision', 'neural', 'networks', 'ai', 'ml'],
        headings: ['Advanced Topics', 'Machine Learning', 'Computer Vision'],
        content: 'Machine learning, computer vision, and neural networks',
        learningObjectives: [
          'Apply machine learning to robotic systems',
          'Implement computer vision solutions',
          'Design neural networks for perception'
        ],
        matches: {},
        highlights: []
      },
      // Module 4: Applications
      {
        id: 'module-04-intro',
        title: 'Module 4: Applications',
        type: 'module',
        module: 'module-04',
        url: '/docs/module-04',
        description: 'Healthcare, manufacturing, autonomous vehicles, and service robots',
        keywords: ['healthcare', 'manufacturing', 'autonomous', 'vehicles', 'service', 'robots', 'applications'],
        headings: ['Applications', 'Healthcare Robotics', 'Manufacturing', 'Autonomous Systems'],
        content: 'Healthcare, manufacturing, autonomous vehicles, and service robots',
        learningObjectives: [
          'Explore robotics applications in healthcare',
          'Implement manufacturing automation solutions',
          'Design autonomous vehicle systems'
        ],
        matches: {},
        highlights: []
      },
      // Module 5: Capstone
      {
        id: 'module-05-intro',
        title: 'Module 5: Capstone',
        type: 'module',
        module: 'module-05',
        url: '/docs/module-05',
        description: 'Final project development, integration, and deployment',
        keywords: ['capstone', 'project', 'development', 'integration', 'deployment', 'final'],
        headings: ['Capstone Project', 'Project Guidelines', 'Development'],
        content: 'Final project development, integration, and deployment',
        learningObjectives: [
          'Design and implement a complete robotic system',
          'Integrate multiple technologies and concepts',
          'Deploy and evaluate robotic solutions'
        ],
        matches: {},
        highlights: []
      },
      // Sample content items
      {
        id: 'what-is-robotics',
        title: 'What is Robotics?',
        type: 'chapter',
        module: 'module-01',
        url: '/docs/module-01/what-is-robotics',
        description: 'Fundamental concepts and definitions in robotics',
        keywords: ['definition', 'robot', 'autonomy', 'automation', 'mechatronics'],
        headings: ['What is Robotics?', 'Definition', 'History'],
        content: 'Robotics is the interdisciplinary field that combines engineering and computer science to design, construct, and operate robots.',
        learningObjectives: [
          'Define robotics and its scope',
          'Understand the history of robotics',
          'Differentiate between robots and automated systems'
        ],
        matches: {},
        highlights: []
      },
      {
        id: 'robot-components',
        title: 'Robot Components',
        type: 'chapter',
        module: 'module-01',
        url: '/docs/module-01/robot-components',
        description: 'Hardware and software components of robots',
        keywords: ['hardware', 'software', 'sensors', 'actuators', 'processors', 'controller'],
        headings: ['Components', 'Hardware', 'Software', 'Sensors'],
        content: 'Robots consist of various hardware and software components including sensors, actuators, processors, and control systems.',
        learningObjectives: [
          'Identify key hardware components',
          'Understand software architecture',
          'Select appropriate sensors and actuators'
        ],
        matches: {},
        highlights: []
      },
      {
        id: 'kinematics',
        title: 'Kinematics',
        type: 'section',
        module: 'module-02',
        url: '/docs/module-02/kinematics',
        description: 'Forward and inverse kinematics',
        keywords: ['kinematics', 'forward', 'inverse', 'motion', 'transformation'],
        headings: ['Kinematics', 'Forward Kinematics', 'Inverse Kinematics'],
        content: 'Kinematics studies the motion of objects without considering the forces that cause motion.',
        learningObjectives: [
          'Calculate forward kinematics',
          'Solve inverse kinematics problems',
          'Understand joint and Cartesian space'
        ],
        matches: {},
        highlights: []
      },
      {
        id: 'control-systems',
        title: 'Control Systems',
        type: 'section',
        module: 'module-02',
        url: '/docs/module-02/control-systems',
        description: 'Feedback control and PID controllers',
        keywords: ['control', 'feedback', 'pid', 'stability', 'response'],
        headings: ['Control Systems', 'Feedback Control', 'PID Controllers'],
        content: 'Control systems use feedback to maintain desired output in the presence of disturbances.',
        learningObjectives: [
          'Understand feedback control principles',
          'Implement PID controllers',
          'Analyze system stability'
        ],
        matches: {},
        highlights: []
      }
    ],
    metadata: {
      totalDocuments: 10,
      lastUpdated: new Date().toISOString(),
      modules: ['module-01', 'module-02', 'module-03', 'module-04', 'module-05']
    }
  };

  return index;
}

async function build() {
  console.log('Building search index...');

  try {
    // Use our comprehensive index
    const index = buildComprehensiveIndex();

    // Save index to static directory
    const staticDir = path.join(__dirname, '../static');

    // Ensure static directory exists
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }

    // Write index file
    const indexPath = path.join(staticDir, 'search-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

    console.log(`Search index built successfully!`);
    console.log(`- Documents indexed: ${index.metadata.totalDocuments}`);
    console.log(`- Modules: ${index.metadata.modules.join(', ')}`);
    console.log(`- Output: ${indexPath}`);
  } catch (error) {
    console.error('Error building search index:', error);
    process.exit(1);
  }
}

build();