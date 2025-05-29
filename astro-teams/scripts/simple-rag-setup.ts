#!/usr/bin/env tsx

/**
 * Simple RAG Setup
 * Discovers and processes documentation files for Vectorize
 */

import fs from 'fs';
import path from 'path';

interface DocumentInfo {
  id: string;
  title: string;
  content: string;
  category: string;
  filePath: string;
  agentRole?: string;
}

class SimpleRAGSetup {
  private workerUrl = 'http://localhost:8788';
  private documents: DocumentInfo[] = [];

  async setup() {
    console.log('🚀 Starting Simple RAG Setup...\n');

    try {
      // Step 1: Discover documentation
      await this.discoverDocs();
      console.log(`📁 Found ${this.documents.length} documents\n`);

      // Step 2: Test worker connection
      await this.testWorkerConnection();

      // Step 3: Process a few sample documents
      await this.processSampleDocuments();

      console.log('\n✅ Simple RAG setup complete!');
      console.log('\n📋 Next steps:');
      console.log('   1. Check worker is running on http://localhost:8788');
      console.log('   2. Run: npm run rag:test');
      console.log('   3. Try querying your documentation');

    } catch (error) {
      console.error('❌ Setup failed:', error.message);
    }
  }

  async discoverDocs() {
    console.log('🔍 Discovering documentation files...');

    const filesToCheck = [
      'README.md',
      'FEATURES.md',
      'PROJECT_OVERVIEW.md',
      'AI_ANALYSIS_REPORT.md',
      'CLOUDFLARE_AI_INTEGRATION_GUIDE.md',
      'R2_INFRASTRUCTURE_GUIDE.md',
      'CLOUDFLARE_RAG_SETUP_GUIDE.md',
      'src/content/docs/guides/cloudflare-deployment.mdx',
      'src/content/docs/architecture/typescript-improvements.mdx',
      'src/content/docs/tools/api-design.mdx',
      'src/content/docs/agent-prompts-architect-engineer.mdx'
    ];

    for (const file of filesToCheck) {
      try {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf-8');
          const title = this.extractTitle(content, file);
          const category = this.categorizeFile(file);
          const agentRole = this.determineAgentRole(file);

          this.documents.push({
            id: file.replace(/[^a-zA-Z0-9]/g, '-'),
            title,
            content: content.substring(0, 2000), // Limit content for testing
            category,
            filePath: file,
            agentRole
          });

          console.log(`   📄 ${file} → ${category}`);
        }
      } catch (error) {
        console.log(`   ⚠️  Skipping ${file}: ${error.message}`);
      }
    }
  }

  async testWorkerConnection() {
    console.log('🔗 Testing worker connection...');

    try {
      const response = await fetch(`${this.workerUrl}/api/models`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const models = await response.json();
        console.log(`   ✅ Worker connected - ${models.count} models available`);
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Worker connection failed: ${error.message}`);
      console.log('   📝 Make sure worker is running: wrangler dev --port 8788 --local');
      return false;
    }
  }

  async processSampleDocuments() {
    console.log('🔮 Processing sample documents...');

    // Process first 3 documents as examples
    const sampleDocs = this.documents.slice(0, 3);

    for (const doc of sampleDocs) {
      try {
        console.log(`   Processing: ${doc.title}`);

        // Test embedding generation
        const embeddingResponse = await fetch(`${this.workerUrl}/test-embedding`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: `${doc.title}. ${doc.content.substring(0, 500)}` })
        });

        if (embeddingResponse.ok) {
          const result = await embeddingResponse.json();
          console.log(`     ✅ Generated ${result.data?.length || 0}D embedding`);
        } else {
          console.log(`     ❌ Embedding failed: ${embeddingResponse.status}`);
        }

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.log(`     ❌ Error processing ${doc.title}: ${error.message}`);
      }
    }
  }

  private extractTitle(content: string, filePath: string): string {
    // Try to extract title from first heading
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) return headingMatch[1].trim();

    // Fallback to filename
    return path.basename(filePath, path.extname(filePath))
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private categorizeFile(filePath: string): string {
    const lower = filePath.toLowerCase();
    
    if (lower.includes('agent') || lower.includes('prompt')) return 'agent-system';
    if (lower.includes('guide') || lower.includes('deployment')) return 'platform-docs';
    if (lower.includes('architecture') || lower.includes('typescript')) return 'architecture';
    if (lower.includes('api') || lower.includes('tool')) return 'implementation';
    if (lower.includes('analysis') || lower.includes('report')) return 'reports-analysis';
    if (lower.includes('readme') || lower.includes('overview')) return 'project-overview';
    
    return 'documentation';
  }

  private determineAgentRole(filePath: string): string | undefined {
    const lower = filePath.toLowerCase();
    
    if (lower.includes('architect') || lower.includes('architecture')) return 'architect-engineer';
    if (lower.includes('test') || lower.includes('review')) return 'tester-reviewer';
    if (lower.includes('optimization') || lower.includes('performance')) return 'optimizer-watchdog';
    if (lower.includes('scrum') || lower.includes('workflow')) return 'scrum-knowledge';
    if (lower.includes('mcp') || lower.includes('integration')) return 'technical-enablement';
    
    return undefined;
  }
}

// Run the setup
const setup = new SimpleRAGSetup();
setup.setup().catch(console.error);