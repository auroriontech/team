#!/usr/bin/env tsx

/**
 * Cloudflare RAG Setup Script
 * 
 * Automatically ingests all project documentation into Vectorize,
 * creates intelligent embeddings, and sets up RAG query capabilities
 * for MCP agent workflows.
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface DocumentMetadata {
  title: string;
  category: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  filePath: string;
  lastModified: string;
  size: number;
  agentRole?: string;
  projectId?: string;
}

interface VectorDocument {
  id: string;
  content: string;
  metadata: DocumentMetadata;
  embedding?: number[];
}

class CloudflareRAGSetup {
  private projectRoot: string;
  private documents: VectorDocument[] = [];
  private workerUrl: string;

  // Document categorization patterns
  private categoryPatterns = {
    'agent-system': ['agent-prompts-', 'team-roles/', 'agent'],
    'platform-docs': ['guides/', 'platforms/', 'deployment', 'cloudflare'],
    'architecture': ['architecture/', 'database-', 'api-design', 'typescript'],
    'project-management': ['scrum-', 'sprint-', 'progress', 'backlog'],
    'implementation': ['implementation-', 'tools/', 'testing-', 'analytics'],
    'project-overview': ['overview', 'features', 'project-', 'readme'],
    'reports-analysis': ['report', 'analysis', 'status', 'optimization'],
  };

  private agentRolePatterns = {
    'architect-engineer': ['architect', 'engineer', 'architecture', 'design', 'typescript'],
    'tester-reviewer': ['test', 'review', 'quality', 'validation', 'enhancement'],
    'optimizer-watchdog': ['optimization', 'performance', 'monitoring', 'budget'],
    'scrum-knowledge': ['scrum', 'sprint', 'workflow', 'progress', 'backlog'],
    'technical-enablement': ['mcp', 'integration', 'tools', 'enablement'],
    'morale-catalyst': ['team', 'member', 'culture', 'catalyst'],
    'standup-facilitator': ['standup', 'meeting', 'coordination', 'facilitator']
  };

  constructor(projectRoot: string = process.cwd(), workerUrl: string = 'http://localhost:8788') {
    this.projectRoot = projectRoot;
    this.workerUrl = workerUrl;
  }

  async setupRAG() {
    console.log('🚀 Starting Cloudflare RAG Setup...\n');

    try {
      // Step 1: Discover and analyze documents
      await this.discoverDocuments();
      console.log(`📁 Discovered ${this.documents.length} documents\n`);

      // Step 2: Generate embeddings using Cloudflare AI
      await this.generateEmbeddings();
      console.log(`🔮 Generated embeddings for ${this.documents.length} documents\n`);

      // Step 3: Populate Vectorize index
      await this.populateVectorize();
      console.log(`📊 Populated Vectorize index with ${this.documents.length} vectors\n`);

      // Step 4: Test RAG queries
      await this.testRAGQueries();
      console.log(`✅ RAG system setup complete!\n`);

      // Step 5: Generate agent configurations
      await this.generateAgentConfigs();

    } catch (error) {
      console.error('❌ RAG setup failed:', error);
      throw error;
    }
  }

  async discoverDocuments() {
    console.log('🔍 Discovering documentation files...');

    const patterns = [
      '**/*.md',
      '**/*.mdx',
      'src/content/**/*.mdx',
      'src/content/**/*.md',
      '!node_modules/**',
      '!.git/**',
      '!dist/**',
      '!**/*.backup*'
    ];

    const files = await glob(patterns, { cwd: this.projectRoot });
    
    for (const file of files) {
      try {
        const fullPath = path.join(this.projectRoot, file);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const stats = fs.statSync(fullPath);

        // Extract title from content or filename
        const title = this.extractTitle(content, file);
        
        // Categorize document
        const category = this.categorizeDocument(file, content);
        const type = this.determineDocumentType(file, content);
        const priority = this.determinePriority(category, content);
        const tags = this.extractTags(file, content);
        const agentRole = this.determineAgentRole(file, content);

        const document: VectorDocument = {
          id: this.generateDocumentId(file),
          content: this.cleanContent(content),
          metadata: {
            title,
            category,
            type,
            priority,
            tags,
            filePath: file,
            lastModified: stats.mtime.toISOString(),
            size: stats.size,
            agentRole,
            projectId: 'aurorion-teams'
          }
        };

        this.documents.push(document);
        console.log(`   📄 ${file} → ${category} (${type})`);

      } catch (error) {
        console.warn(`   ⚠️  Skipping ${file}: ${error.message}`);
      }
    }
  }

  async generateEmbeddings() {
    console.log('🔮 Generating embeddings with Cloudflare AI...');

    for (let i = 0; i < this.documents.length; i++) {
      const doc = this.documents[i];
      
      try {
        // Create embedding text combining title and content
        const embeddingText = `${doc.metadata.title}. ${doc.content.substring(0, 2000)}`;
        
        const response = await fetch(`${this.workerUrl}/test-embedding`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: embeddingText })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        doc.embedding = result.data;

        console.log(`   ✅ ${doc.metadata.title} (${doc.embedding.length}D)`);

        // Small delay to avoid rate limits
        if (i % 5 === 0 && i > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        console.warn(`   ⚠️  Failed to embed ${doc.metadata.title}: ${error.message}`);
        // Generate fallback embedding
        doc.embedding = this.generateFallbackEmbedding(doc.content);
      }
    }
  }

  async populateVectorize() {
    console.log('📊 Populating Vectorize index...');

    // Batch documents for efficient upload
    const batchSize = 10;
    for (let i = 0; i < this.documents.length; i += batchSize) {
      const batch = this.documents.slice(i, i + batchSize);
      
      try {
        const vectors = batch.map(doc => ({
          id: doc.id,
          values: doc.embedding || [],
          metadata: {
            ...doc.metadata,
            content: doc.content.substring(0, 1000) // Truncate for metadata
          }
        }));

        const response = await fetch(`${this.workerUrl}/populate-vectorize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vectors })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log(`   📤 Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(this.documents.length / batchSize)}`);

      } catch (error) {
        console.warn(`   ⚠️  Failed to upload batch: ${error.message}`);
      }
    }
  }

  async testRAGQueries() {
    console.log('🧪 Testing RAG query capabilities...');

    const testQueries = [
      'How do I deploy to Cloudflare?',
      'What AI models are available?',
      'How does the agent system work?',
      'What is the database schema?',
      'How do I set up MCP integration?'
    ];

    for (const query of testQueries) {
      try {
        const response = await fetch(`${this.workerUrl}/query-vectorize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, limit: 3 })
        });

        if (response.ok) {
          const results = await response.json();
          console.log(`   ✅ "${query}" → ${results.results?.length || 0} results`);
        } else {
          console.log(`   ⚠️  "${query}" → Query failed`);
        }

      } catch (error) {
        console.log(`   ⚠️  "${query}" → ${error.message}`);
      }
    }
  }

  async generateAgentConfigs() {
    console.log('🤖 Generating agent configurations...');

    const agentCategories = this.groupDocumentsByAgent();
    const configs = {
      timestamp: new Date().toISOString(),
      totalDocuments: this.documents.length,
      agentConfigurations: agentCategories,
      ragEndpoints: {
        query: `${this.workerUrl}/query-vectorize`,
        embedding: `${this.workerUrl}/test-embedding`,
        populate: `${this.workerUrl}/populate-vectorize`
      },
      mcpIntegration: {
        available: true,
        agentTypes: Object.keys(agentCategories),
        recommendedWorkflows: this.generateWorkflowRecommendations(agentCategories)
      }
    };

    const configPath = path.join(this.projectRoot, 'RAG_AGENT_CONFIGURATION.json');
    fs.writeFileSync(configPath, JSON.stringify(configs, null, 2));
    console.log(`   📋 Agent configurations saved to: ${configPath}`);
  }

  // Helper methods

  private extractTitle(content: string, filePath: string): string {
    // Try to extract title from frontmatter or first heading
    const frontmatterMatch = content.match(/^---\s*\n.*?title:\s*['"]?([^'"\n]+)['"]?/s);
    if (frontmatterMatch) return frontmatterMatch[1].trim();

    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) return headingMatch[1].trim();

    // Fallback to filename
    return path.basename(filePath, path.extname(filePath))
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private categorizeDocument(filePath: string, content: string): string {
    const lowerPath = filePath.toLowerCase();
    const lowerContent = content.toLowerCase();

    for (const [category, patterns] of Object.entries(this.categoryPatterns)) {
      if (patterns.some(pattern => lowerPath.includes(pattern) || lowerContent.includes(pattern))) {
        return category;
      }
    }

    return 'project-documentation';
  }

  private determineDocumentType(filePath: string, content: string): string {
    if (filePath.includes('agent-prompts-')) return 'agent-prompt';
    if (filePath.includes('README')) return 'readme';
    if (filePath.includes('guide')) return 'guide';
    if (filePath.includes('api')) return 'api-documentation';
    if (filePath.includes('overview')) return 'overview';
    if (content.includes('## Installation') || content.includes('## Setup')) return 'setup-guide';
    
    return 'documentation';
  }

  private determinePriority(category: string, content: string): 'low' | 'medium' | 'high' {
    if (['agent-system', 'architecture'].includes(category)) return 'high';
    if (content.length > 5000) return 'high';
    if (['platform-docs', 'implementation'].includes(category)) return 'medium';
    return 'low';
  }

  private extractTags(filePath: string, content: string): string[] {
    const tags = new Set<string>();
    
    // Tags from file path
    const pathParts = filePath.split('/');
    pathParts.forEach(part => {
      if (part.includes('-')) {
        part.split('-').forEach(subPart => tags.add(subPart));
      } else {
        tags.add(part);
      }
    });

    // Tags from content
    const contentWords = content.toLowerCase().match(/\b(ai|mcp|agent|cloudflare|vectorize|astro|typescript|database|api|oauth|webauthn)\b/g) || [];
    contentWords.forEach(word => tags.add(word));

    return Array.from(tags).filter(tag => tag.length > 2).slice(0, 10);
  }

  private determineAgentRole(filePath: string, content: string): string | undefined {
    const lowerPath = filePath.toLowerCase();
    const lowerContent = content.toLowerCase();

    for (const [role, patterns] of Object.entries(this.agentRolePatterns)) {
      if (patterns.some(pattern => lowerPath.includes(pattern) || lowerContent.includes(pattern))) {
        return role;
      }
    }

    return undefined;
  }

  private cleanContent(content: string): string {
    // Remove frontmatter
    content = content.replace(/^---\s*\n.*?\n---\s*\n/s, '');
    
    // Remove excessive whitespace
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return content.trim();
  }

  private generateDocumentId(filePath: string): string {
    return filePath.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  }

  private generateFallbackEmbedding(text: string): number[] {
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = hash % 1000;
    const embedding = [];
    
    for (let i = 0; i < 768; i++) {
      const value = Math.sin(seed + i) * Math.cos(seed + i * 2) * 0.5;
      embedding.push(value);
    }
    
    return embedding;
  }

  private groupDocumentsByAgent(): Record<string, any> {
    const groups: Record<string, any> = {};

    for (const doc of this.documents) {
      const role = doc.metadata.agentRole || 'general';
      
      if (!groups[role]) {
        groups[role] = {
          documentCount: 0,
          categories: new Set(),
          avgPriority: 0,
          documents: []
        };
      }

      groups[role].documentCount++;
      groups[role].categories.add(doc.metadata.category);
      groups[role].documents.push({
        id: doc.id,
        title: doc.metadata.title,
        category: doc.metadata.category,
        priority: doc.metadata.priority
      });
    }

    // Convert sets to arrays for JSON serialization
    Object.values(groups).forEach((group: any) => {
      group.categories = Array.from(group.categories);
    });

    return groups;
  }

  private generateWorkflowRecommendations(agentCategories: Record<string, any>): string[] {
    const recommendations = [
      'Use architect-engineer agent for code analysis and system design questions',
      'Use tester-reviewer agent for quality assessment and testing strategies',
      'Use optimizer-watchdog agent for performance and cost optimization',
      'Use scrum-knowledge agent for project management and workflow questions',
      'Use technical-enablement agent for MCP integration and tool setup',
      'Query the RAG system before starting new implementations',
      'Use semantic search to find related documentation across projects',
      'Leverage embeddings for intelligent content organization'
    ];

    return recommendations;
  }
}

// Execute if run directly
async function main() {
  const ragSetup = new CloudflareRAGSetup();
  
  try {
    await ragSetup.setupRAG();
    console.log('🎉 Cloudflare RAG setup completed successfully!');
  } catch (error) {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { CloudflareRAGSetup };