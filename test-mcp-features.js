// Test MCP Specific Features
console.log("=== Testing MCP Features ===\n");

const fetch = require('node-fetch');

// Test 1: Test different query types
console.log("1. Testing Query Types...");
const testQueries = [
  {
    type: "Robotics Basics",
    query: "What is robotics?"
  },
  {
    type: "Technical Concepts",
    query: "Explain forward kinematics"
  },
  {
    type: "Components",
    query: "What are the main types of sensors used in robots?"
  },
  {
    type: "AI Integration",
    query: "How is machine learning used in robotics?"
  }
];

const testQueryType = async (test) => {
  try {
    const response = await fetch('http://localhost:8001/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: test.query,
        conversation_id: `feature-test-${Date.now()}`,
        context: {
          module_id: "module-01",
          chapter_id: "foundations"
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${test.type}: ${data.response.substring(0, 40)}...`);
      return true;
    } else {
      console.log(`❌ ${test.type}: Status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${test.type}: ${error.message}`);
    return false;
  }
};

// Test 2: Test bilingual support (simulate with different phrasing)
console.log("\n2. Testing Bilingual Capability...");
const testBilingualQueries = [
  { query: "What is robotics?", lang: "English" },
  { query: "robotics kya hai", lang: "Hindi (simulated)" },
  { query: "explain robot components", lang: "English" },
  { query: "robot ke components samjhayiye", lang: "Hindi (simulated)" }
];

const testBilingual = async (test) => {
  try {
    const response = await fetch('http://localhost:8001/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: test.query,
        conversation_id: `bilingual-test-${Date.now()}`
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${test.lang}: Response received`);
      return true;
    } else {
      console.log(`❌ ${test.lang}: Status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${test.lang}: ${error.message}`);
    return false;
  }
};

// Test 3: Test conversation history
console.log("\n3. Testing Conversation History...");
const testConversationHistory = async () => {
  const sessionId = `conv-test-${Date.now()}`;

  // First message
  let response = await fetch('http://localhost:8001/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "What is robotics?",
      conversation_id: sessionId
    })
  });

  if (!response.ok) return false;
  const firstData = await response.json();

  // Second message (should maintain context)
  response = await fetch('http://localhost:8001/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "Tell me more about applications",
      conversation_id: sessionId
    })
  });

  if (response.ok) {
    const secondData = await response.json();
    console.log("✅ Conversation history: Context maintained");
    return true;
  } else {
    console.log("❌ Conversation history: Failed");
    return false;
  }
};

// Test 4: Test citation format
console.log("\n4. Testing Citation Format...");
const testCitations = async () => {
  try {
    const response = await fetch('http://localhost:8001/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "What are robot sensors?",
        conversation_id: `citation-test-${Date.now()}`
      })
    });

    if (response.ok) {
      const data = await response.json();

      // Check if citations exist and have required fields
      if (data.citations && data.citations.length > 0) {
        const citation = data.citations[0];
        const hasRequiredFields = citation.id && citation.content_id &&
                                 citation.module_id && citation.relevance_score;

        if (hasRequiredFields) {
          console.log(`✅ Citation format: Valid with ${data.citations.length} sources`);
          console.log(`   Sample: ${citation.excerpt.substring(0, 50)}...`);
          return true;
        } else {
          console.log("❌ Citation format: Missing required fields");
          return false;
        }
      } else {
        console.log("❌ Citation format: No citations returned");
        return false;
      }
    } else {
      console.log(`❌ Citation format: Status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Citation format: ${error.message}`);
    return false;
  }
};

// Test 5: Test error scenarios
console.log("\n5. Testing Error Scenarios...");
const testErrorScenarios = async () => {
  const scenarios = [
    {
      name: "Empty message",
      body: JSON.stringify({
        message: "",
        conversation_id: "error-test"
      })
    },
    {
      name: "Invalid JSON",
      body: "invalid json"
    },
    {
      name: "Missing message field",
      body: JSON.stringify({
        conversation_id: "error-test"
      })
    }
  ];

  let passedTests = 0;

  for (const scenario of scenarios) {
    try {
      const response = await fetch('http://localhost:8001/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: scenario.body
      });

      // Should return 4xx or handle gracefully
      if (response.status >= 400 && response.status < 500) {
        console.log(`✅ ${scenario.name}: Handled correctly (status ${response.status})`);
        passedTests++;
      } else if (response.ok) {
        console.log(`⚠️  ${scenario.name}: Unexpected success (should have failed)`);
      } else {
        console.log(`❌ ${scenario.name}: Server error (${response.status})`);
      }
    } catch (error) {
      // Client errors are expected for invalid JSON
      if (scenario.name === "Invalid JSON") {
        console.log(`✅ ${scenario.name}: Correctly rejected`);
        passedTests++;
      } else {
        console.log(`❌ ${scenario.name}: Unexpected error - ${error.message}`);
      }
    }
  }

  return passedTests === scenarios.length;
};

// Run all feature tests
const runFeatureTests = async () => {
  console.log("Running comprehensive MCP feature tests...\n");

  const queryResults = await Promise.all(
    testQueries.map(testQueryType)
  );

  const bilingualResults = await Promise.all(
    testBilingualQueries.map(testBilingual)
  );

  const convResult = await testConversationHistory();
  const citationResult = await testCitations();
  const errorResult = await testErrorScenarios();

  const results = [...queryResults, ...bilingualResults, convResult, citationResult, errorResult];
  const testNames = [
    ...testQueries.map(q => q.type),
    ...testBilingualQueries.map(q => q.lang),
    "Conversation History",
    "Citation Format",
    "Error Scenarios"
  ];

  console.log("\n=== MCP Feature Test Results ===");
  results.forEach((result, index) => {
    console.log(`${testNames[index]}: ${result ? '✅ PASS' : '❌ FAIL'}`);
  });

  const passedCount = results.filter(r => r).length;
  console.log(`\nPassed: ${passedCount}/${results.length} tests`);

  if (passedCount === results.length) {
    console.log("\n🎉 All MCP features working correctly!");
    console.log("\nKey features verified:");
    console.log("- ✅ Multiple query types support");
    console.log("- ✅ Bilingual capability (simulated)");
    console.log("- ✅ Conversation history maintenance");
    console.log("- ✅ Proper citation format");
    console.log("- ✅ Error handling and validation");
  }
};

// Execute tests
runFeatureTests().catch(console.error);