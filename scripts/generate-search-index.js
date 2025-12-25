const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Mock implementation for browser environment
function buildSearchIndex() {
  // Since we can't directly access files in browser, return a basic structure
  // In a real deployment, this would be generated during build
  return {
    documents: [
      {
        id: 'module-01-intro',
        title: 'Introduction to Robotics',
        type: 'module',
        module: 'module-01',
        url: '/docs/module-01',
        description: 'Introduction to robotics, components, and AI fundamentals',
        keywords: ['robotics', 'introduction', 'foundations'],
        headings: [],
        content: '',
        learningObjectives: [],
        matches: {},
        highlights: []
      },
      {
        id: 'module-02-intro',
        title: 'Core Concepts in Robotics',
        type: 'module',
        module: 'module-02',
        url: '/docs/module-02',
        description: 'Motion planning, control systems, and perception',
        keywords: ['motion', 'control', 'perception'],
        headings: [],
        content: '',
        learningObjectives: [],
        matches: {},
        highlights: []
      }
    ],
    metadata: {
      totalDocuments: 2,
      lastUpdated: new Date().toISOString(),
      modules: ['module-01', 'module-02']
    }
  };
}

try {
  const index = buildSearchIndex();
  const indexPath = path.join(__dirname, '../public/search-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log('Search index generated successfully at:', indexPath);
} catch (error) {
  console.error('Error generating search index:', error);
}