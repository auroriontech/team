#!/usr/bin/env tsx

/**
 * Test RAG System
 * 
 * Quick test script to verify Cloudflare RAG functionality
 * and demonstrate agent capabilities
 */

async function testRAGSystem() {
  const workerUrl = 'http://localhost:8788';
  
  console.log('🧪 Testing Cloudflare RAG System...\n');

  // Test 1: Basic RAG Query
  console.log('1. Testing basic RAG query...');
  try {
    const response = await fetch(`${workerUrl}/rag-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'How do I set up Cloudflare AI models?',
        limit: 3
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`   ✅ Query successful`);
      console.log(`   📝 Answer: ${result.answer.substring(0, 200)}...`);
      console.log(`   📚 Sources: ${result.sources.length} documents`);
      result.sources.forEach((source, i) => {
        console.log(`      ${i + 1}. ${source.title} (${source.category}) - ${(source.similarity * 100).toFixed(1)}%`);
      });
    } else {
      console.log(`   ❌ Query failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n2. Testing agent-specific queries...');
  
  const agentQueries = [
    { agent: 'architect-engineer', query: 'What is the system architecture?' },
    { agent: 'tester-reviewer', query: 'What testing strategies are available?' },
    { agent: 'optimizer-watchdog', query: 'How can I optimize performance?' },
    { agent: 'scrum-knowledge', query: 'What is the project workflow?' }
  ];

  for (const { agent, query } of agentQueries) {
    try {
      const response = await fetch(`${workerUrl}/rag-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          limit: 2,
          filter: { agentRole: agent }
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`   🤖 ${agent}: ${result.sources.length} relevant docs found`);
      } else {
        console.log(`   ❌ ${agent}: Query failed`);
      }
    } catch (error) {
      console.log(`   ❌ ${agent}: ${error.message}`);
    }
  }

  console.log('\n3. Testing model availability...');
  try {
    const response = await fetch(`${workerUrl}/api/models`);
    if (response.ok) {
      const models = await response.json();
      console.log(`   ✅ ${models.count} AI models available`);
      models.models.forEach(model => {
        console.log(`      📦 ${model.name} (${model.type})`);
      });
    }
  } catch (error) {
    console.log(`   ❌ Models check failed: ${error.message}`);
  }

  console.log('\n🎉 RAG system test complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Run: npm run setup-rag (to populate with all docs)');
  console.log('   2. Test MCP integration');
  console.log('   3. Create agent workflows');
}

testRAGSystem().catch(console.error);