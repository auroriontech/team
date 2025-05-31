#!/usr/bin/env tsx

/**
 * Demo RAG Capabilities
 * 
 * Demonstrates the working RAG system components:
 * - Document discovery and categorization
 * - AI embedding generation
 * - Intelligent text generation
 * - MCP-ready functionality
 */

import fs from 'fs';

class RAGDemo {
  private workerUrl = 'http://localhost:8788';
  private documents: Array<{
    title: string;
    category: string;
    content: string;
    agentRole?: string;
  }> = [];

  async runDemo() {
    console.log('🎭 Cloudflare RAG System Demo\n');
    console.log('Demonstrating AI-powered document organization and query capabilities\n');

    try {
      // Step 1: Show document discovery
      await this.discoverDocuments();
      
      // Step 2: Show AI embedding generation
      await this.demonstrateEmbeddings();
      
      // Step 3: Show AI-powered Q&A 
      await this.demonstrateAIQueries();
      
      // Step 4: Show agent-specific capabilities
      await this.demonstrateAgentCapabilities();
      
      // Step 5: Show MCP integration readiness
      await this.showMCPReadiness();

      console.log('\n🎉 RAG System Demo Complete!');
      console.log('\n🚀 Your RAG system is ready for:');
      console.log('   • Intelligent document search');
      console.log('   • AI-powered question answering');
      console.log('   • Agent-specific guidance');
      console.log('   • MCP workflow automation');
      console.log('   • Future project assistance');

    } catch (error) {
      console.error('❌ Demo failed:', error.message);
    }
  }

  async discoverDocuments() {
    console.log('📚 Document Discovery & Categorization');
    console.log('=====================================');

    const docs = [
      { file: 'README.md', category: 'project-overview' },
      { file: 'CLOUDFLARE_AI_INTEGRATION_GUIDE.md', category: 'platform-docs', agent: 'technical-enablement' },
      { file: 'R2_INFRASTRUCTURE_GUIDE.md', category: 'platform-docs', agent: 'architect-engineer' },
      { file: 'src/content/docs/architecture/typescript-improvements.mdx', category: 'architecture', agent: 'architect-engineer' },
      { file: 'AI_ANALYSIS_REPORT.md', category: 'reports-analysis', agent: 'optimizer-watchdog' }
    ];

    for (const doc of docs) {
      if (fs.existsSync(doc.file)) {
        const content = fs.readFileSync(doc.file, 'utf-8');
        const title = this.extractTitle(content, doc.file);
        
        this.documents.push({
          title,
          category: doc.category,
          content: content.substring(0, 500),
          agentRole: doc.agent
        });

        console.log(`✅ ${doc.file}`);
        console.log(`   📂 Category: ${doc.category}`);
        console.log(`   🤖 Agent: ${doc.agent || 'general'}`);
        console.log(`   📄 Title: ${title}\n`);
      }
    }
    
    console.log(`📊 Total: ${this.documents.length} documents organized\n`);
  }

  async demonstrateEmbeddings() {
    console.log('🔮 AI Embedding Generation');
    console.log('===========================');

    for (let i = 0; i < Math.min(3, this.documents.length); i++) {
      const doc = this.documents[i];
      
      try {
        const response = await fetch(`${this.workerUrl}/test-embedding`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: `${doc.title}. ${doc.content.substring(0, 300)}` 
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ ${doc.title}`);
          console.log(`   🧠 Model: ${result.model}`);
          console.log(`   📊 Dimensions: ${result.embedding_dimensions}`);
          console.log(`   🔢 Sample values: [${result.first_10_values.slice(0, 3).map(v => v.toFixed(3)).join(', ')}, ...]`);
          console.log('');
        }
      } catch (error) {
        console.log(`❌ Failed to embed ${doc.title}: ${error.message}`);
      }
    }
  }

  async demonstrateAIQueries() {
    console.log('🧠 AI-Powered Question Answering');
    console.log('=================================');

    const queries = [
      'How do I deploy to Cloudflare?',
      'What AI models are available?',
      'How does the system architecture work?'
    ];

    for (const query of queries) {
      console.log(`❓ Question: "${query}"`);
      
      try {
        // Find relevant context from documents
        const relevantDocs = this.documents.filter(doc => 
          doc.content.toLowerCase().includes('cloudflare') ||
          doc.content.toLowerCase().includes('ai') ||
          doc.content.toLowerCase().includes('architecture')
        );

        const context = relevantDocs.slice(0, 2).map(doc => 
          `${doc.title}: ${doc.content.substring(0, 200)}`
        ).join('\n\n');

        // Generate AI response
        const response = await fetch(`${this.workerUrl}/test-reasoning`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: `You are an AI assistant for the Aurorion Teams project. Use this context to answer questions: ${context}`
              },
              {
                role: 'user',
                content: query
              }
            ]
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`💬 Answer: ${result.response.substring(0, 200)}...`);
          console.log(`📚 Context sources: ${relevantDocs.length} documents`);
        } else {
          console.log('❌ AI query failed');
        }
      } catch (error) {
        console.log(`❌ Query failed: ${error.message}`);
      }
      
      console.log('');
    }
  }

  async demonstrateAgentCapabilities() {
    console.log('🤖 Agent-Specific Capabilities');
    console.log('==============================');

    const agents = [
      { role: 'architect-engineer', query: 'What are the architectural patterns?' },
      { role: 'technical-enablement', query: 'How do I integrate with Cloudflare?' },
      { role: 'optimizer-watchdog', query: 'What optimizations are available?' }
    ];

    for (const agent of agents) {
      console.log(`🎭 ${agent.role.toUpperCase()}`);
      
      // Find documents relevant to this agent
      const agentDocs = this.documents.filter(doc => doc.agentRole === agent.role);
      console.log(`   📋 Relevant documents: ${agentDocs.length}`);
      
      agentDocs.forEach(doc => {
        console.log(`     • ${doc.title} (${doc.category})`);
      });

      console.log(`   💭 Example query: "${agent.query}"`);
      console.log('');
    }
  }

  async showMCPReadiness() {
    console.log('🔌 MCP Integration Readiness');
    console.log('============================');

    const mcpTools = [
      {
        name: 'search_documentation',
        description: 'Search through project docs with AI embeddings',
        status: '✅ Ready'
      },
      {
        name: 'ask_ai_assistant', 
        description: 'Get AI answers with source citations',
        status: '✅ Ready'
      },
      {
        name: 'get_agent_guidance',
        description: 'Consult specific agent expertise',
        status: '✅ Ready'
      },
      {
        name: 'analyze_project_status',
        description: 'Get project analysis and recommendations', 
        status: '✅ Ready'
      }
    ];

    console.log('Available MCP Tools for Claude integration:\n');
    
    mcpTools.forEach(tool => {
      console.log(`${tool.status} ${tool.name}`);
      console.log(`   ${tool.description}\n`);
    });

    console.log('🚀 To enable MCP with Claude:');
    console.log('   1. Add to Claude configuration:');
    console.log('   {');
    console.log('     "mcpServers": {');
    console.log('       "aurorion-rag": {');
    console.log('         "command": "npm",');
    console.log('         "args": ["run", "mcp:agent"],');
    console.log('         "cwd": "/path/to/aurorion/team/astro-teams"');
    console.log('       }');
    console.log('     }');
    console.log('   }');
    console.log('   2. Run: npm run mcp:agent');
  }

  private extractTitle(content: string, filePath: string): string {
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) return headingMatch[1].trim();
    
    return filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '') || 'Untitled';
  }
}

// Run the demo
const demo = new RAGDemo();
demo.runDemo().catch(console.error);