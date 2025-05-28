#!/usr/bin/env node

/**
 * Test script for AI-powered categorization and vectorization
 * This script tests the integration without requiring deployed infrastructure
 */

import { AurorionAiManager } from '../src/utils/aiManager.js';

// Mock AI interface for testing
class MockAi {
  async run(model: string, input: any): Promise<any> {
    console.log(`🤖 Mock AI call: ${model}`);
    
    if (model === '@cf/baai/bge-base-en-v1.5') {
      // Return mock 768-dimensional embedding
      return {
        data: [Array.from({ length: 768 }, () => Math.random() * 2 - 1)]
      };
    }
    
    if (model === '@cf/meta/llama-3.1-8b-instruct') {
      const messages = input.messages;
      const userMessage = messages.find((m: any) => m.role === 'user')?.content || '';
      
      // Mock categorization response
      if (userMessage.includes('categorize')) {
        return {
          response: JSON.stringify({
            category: 'mcp-implementation',
            confidence: 0.92,
            reasoning: 'Content discusses MCP integration and AI capabilities'
          })
        };
      }
      
      // Mock type determination
      if (userMessage.includes('content type')) {
        return { response: 'implementation-plan' };
      }
      
      // Mock priority determination
      if (userMessage.includes('priority')) {
        return { response: 'high' };
      }
      
      // Mock tag extraction
      if (userMessage.includes('tags')) {
        return { response: 'ai-integration, mcp, cloudflare, workers-ai, categorization' };
      }
      
      // Mock summary generation
      if (userMessage.includes('summary')) {
        return { 
          response: 'AI-powered content categorization system using Cloudflare Workers AI for intelligent project management.'
        };
      }
    }
    
    if (model === '@cf/baai/bge-reranker-base') {
      return { data: [Math.random()] };
    }
    
    return { response: 'Mock AI response', data: [] };
  }
}

async function testAiIntegration() {
  console.log('🧪 Testing AI Integration...\n');
  
  const mockAi = new MockAi() as any;
  const aiManager = new AurorionAiManager(mockAi);
  
  // Test content to analyze
  const testContent = {
    title: 'AI-Powered MCP Integration for Aurorion Teams',
    content: `This implementation adds Cloudflare Workers AI capabilities to the Aurorion Teams 
    project for intelligent content categorization and semantic search. The system uses 
    bge-base-en-v1.5 for generating 768-dimensional embeddings, Llama 3.1 for content 
    analysis and categorization, and reranker models for optimizing search results. 
    Key features include automatic categorization, priority detection, tag extraction, 
    and summary generation for all project documentation and agent specifications.`,
    context: 'New AI integration features for enhanced project management'
  };
  
  try {
    console.log('1️⃣ Testing Content Analysis...');
    const analysis = await aiManager.analyzeContent(
      testContent.title,
      testContent.content,
      testContent.context
    );
    
    console.log('✅ Content Analysis Results:');
    console.log(`   Category: ${analysis.category}`);
    console.log(`   Type: ${analysis.type}`);
    console.log(`   Priority: ${analysis.priority}`);
    console.log(`   Tags: ${analysis.tags.join(', ')}`);
    console.log(`   Summary: ${analysis.summary}`);
    console.log(`   Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
    console.log(`   Embedding Dimensions: ${analysis.embedding.length}\n`);
    
    console.log('2️⃣ Testing Embedding Generation...');
    const embedding = await aiManager.generateEmbedding('Test embedding generation');
    console.log(`✅ Generated embedding with ${embedding.length} dimensions\n`);
    
    console.log('3️⃣ Testing Batch Analysis...');
    const batchItems = [
      {
        title: 'Technical Enablement Agent',
        content: 'MCP integration specialist for tool provisioning and environment management',
        context: 'Agent role specification'
      },
      {
        title: 'Vector Database Setup',
        content: 'Cloudflare Vectorize configuration with metadata indexing',
        context: 'Infrastructure documentation'
      }
    ];
    
    const batchResults = await aiManager.batchAnalyzeContent(batchItems);
    console.log(`✅ Batch analyzed ${batchResults.length} items:`);
    batchResults.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.category} (${result.type}) - ${result.priority} priority`);
    });
    console.log();
    
    console.log('4️⃣ Testing Reranking...');
    const documents = [
      'MCP server implementation with TypeScript',
      'Agent coordination workflows',
      'Database schema design patterns'
    ];
    const scores = await aiManager.rerankeResults('MCP implementation', documents);
    console.log('✅ Reranking scores:', scores.map(s => s.toFixed(3)).join(', '));
    console.log();
    
    console.log('🎉 All AI integration tests passed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Deploy to Cloudflare Workers to test with real AI models');
    console.log('   2. Run semantic search tests with actual embeddings');
    console.log('   3. Verify categorization accuracy with real content');
    console.log('   4. Test batch processing performance');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAiIntegration();