import type { Ai } from '@cloudflare/workers-types';

/**
 * AI-Powered Content Categorization and Embedding Manager
 * Integrates Cloudflare Workers AI for intelligent content processing
 */

export interface AiEnvironment {
  AI: Ai;
}

export interface ContentAnalysis {
  category: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  summary: string;
  embedding: number[];
  confidence: number;
}

export interface CategoryClassification {
  category: string;
  confidence: number;
  reasoning: string;
}

export class AurorionAiManager {
  private ai: Ai;

  constructor(ai: Ai) {
    this.ai = ai;
  }

  /**
   * Generate semantic embeddings using Workers AI
   * Using bge-base-en-v1.5 (768 dimensions) - perfect for our Vectorize setup
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.ai.run('@cf/baai/bge-base-en-v1.5', {
        text: [text]
      });

      // Workers AI returns nested array, extract first embedding
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }

      throw new Error('Invalid embedding response format');
    } catch (error) {
      console.error('Embedding generation failed:', error);
      // Fallback to deterministic embedding if AI fails
      return this.generateFallbackEmbedding(text);
    }
  }

  /**
   * Intelligent content categorization using Llama for analysis
   */
  async categorizeContent(title: string, content: string, context?: string): Promise<CategoryClassification> {
    const prompt = `Analyze the following content and categorize it for an AI agent team management system.

Title: ${title}
Content: ${content.substring(0, 1000)}...
${context ? `Context: ${context}` : ''}

Categories available:
- agent-system: Agent roles, capabilities, workflows
- project-documentation: Project overviews, architecture, guides  
- mcp-implementation: Model Context Protocol implementation
- infrastructure: Database, deployment, system setup
- team-coordination: Workflows, communication, handoffs
- testing-quality: Testing strategies, quality assurance
- performance-optimization: Performance, security, monitoring
- knowledge-management: Documentation, processes, standards

Respond with ONLY a JSON object:
{
  "category": "exact_category_name",
  "confidence": 0.95,
  "reasoning": "Brief explanation of categorization"
}`;

    try {
      const response = await this.ai.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are an expert content categorizer for AI agent systems. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.1
      });

      const result = JSON.parse(response.response);
      return {
        category: result.category,
        confidence: result.confidence,
        reasoning: result.reasoning
      };
    } catch (error) {
      console.error('Categorization failed:', error);
      // Fallback categorization
      return this.fallbackCategorization(title, content);
    }
  }

  /**
   * Determine content type using AI analysis
   */
  async determineContentType(title: string, content: string): Promise<string> {
    const prompt = `Determine the content type for: "${title}"

Content preview: ${content.substring(0, 500)}...

Available types:
- agent-role: Specific AI agent specifications
- overview: High-level project documentation
- implementation-plan: Technical implementation roadmaps
- implementation-task: Specific implementation tasks
- database-setup: Database configuration and schema
- workflow: Process and coordination patterns
- documentation: General documentation
- configuration: System configuration files
- architecture: System architecture designs
- testing-strategy: Testing approaches and frameworks

Respond with just the type name:`;

    try {
      const response = await this.ai.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a content type classifier. Respond with just the type name, no explanation.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.1
      });

      return response.response.trim().toLowerCase().replace(/[^a-z-]/g, '');
    } catch (error) {
      console.error('Type determination failed:', error);
      return this.fallbackTypeDetection(title, content);
    }
  }

  /**
   * Determine priority level using AI analysis
   */
  async determinePriority(title: string, content: string, category: string): Promise<'low' | 'medium' | 'high'> {
    const prompt = `Determine the priority level for this ${category} content:

Title: ${title}
Content: ${content.substring(0, 300)}...

Priority guidelines:
- HIGH: Core system components, critical implementations, agent specifications, security
- MEDIUM: Implementation tasks, documentation, workflows, testing
- LOW: Supporting documentation, examples, tutorials

Respond with: high, medium, or low`;

    try {
      const response = await this.ai.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a priority assessor. Respond with just: high, medium, or low' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 10,
        temperature: 0.1
      });

      const priority = response.response.trim().toLowerCase();
      if (['high', 'medium', 'low'].includes(priority)) {
        return priority as 'low' | 'medium' | 'high';
      }
      return 'medium'; // Default fallback
    } catch (error) {
      console.error('Priority determination failed:', error);
      return this.fallbackPriorityDetection(category);
    }
  }

  /**
   * Extract relevant tags using AI analysis
   */
  async extractTags(title: string, content: string, category: string): Promise<string[]> {
    const prompt = `Extract 3-5 relevant tags for this ${category} content:

Title: ${title}
Content: ${content.substring(0, 500)}...

Generate tags that would help with search and organization. Focus on:
- Technical concepts (mcp, vectorize, typescript, etc.)
- Functional areas (architecture, testing, documentation, etc.)
- Process keywords (implementation, planning, coordination, etc.)

Respond with a comma-separated list of tags:`;

    try {
      const response = await this.ai.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a tag extractor. Respond with comma-separated tags only.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.2
      });

      return response.response
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0)
        .slice(0, 5);
    } catch (error) {
      console.error('Tag extraction failed:', error);
      return this.fallbackTagExtraction(title, content, category);
    }
  }

  /**
   * Generate content summary using AI
   */
  async generateSummary(title: string, content: string): Promise<string> {
    const prompt = `Create a concise 1-2 sentence summary of this content:

Title: ${title}
Content: ${content.substring(0, 800)}...

Focus on the main purpose and key information:`;

    try {
      const response = await this.ai.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a content summarizer. Create concise, informative summaries.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.3
      });

      return response.response.trim();
    } catch (error) {
      console.error('Summary generation failed:', error);
      return `${title}: ${content.substring(0, 200)}...`;
    }
  }

  /**
   * Comprehensive content analysis combining all AI capabilities
   */
  async analyzeContent(title: string, content: string, context?: string): Promise<ContentAnalysis> {
    try {
      // Run AI analysis in parallel for efficiency
      const [
        categorization,
        contentType,
        embedding,
        summary
      ] = await Promise.all([
        this.categorizeContent(title, content, context),
        this.determineContentType(title, content),
        this.generateEmbedding(`${title}. ${content}`),
        this.generateSummary(title, content)
      ]);

      // Get priority and tags based on category
      const [priority, tags] = await Promise.all([
        this.determinePriority(title, content, categorization.category),
        this.extractTags(title, content, categorization.category)
      ]);

      return {
        category: categorization.category,
        type: contentType,
        priority,
        tags,
        summary,
        embedding,
        confidence: categorization.confidence
      };
    } catch (error) {
      console.error('Content analysis failed:', error);
      // Return fallback analysis
      return this.fallbackAnalysis(title, content);
    }
  }

  /**
   * Batch analyze multiple pieces of content
   */
  async batchAnalyzeContent(items: Array<{ title: string; content: string; context?: string }>): Promise<ContentAnalysis[]> {
    const results: ContentAnalysis[] = [];
    
    // Process in batches of 5 to avoid rate limits
    for (let i = 0; i < items.length; i += 5) {
      const batch = items.slice(i, i + 5);
      const batchResults = await Promise.all(
        batch.map(item => this.analyzeContent(item.title, item.content, item.context))
      );
      results.push(...batchResults);
      
      // Small delay between batches
      if (i + 5 < items.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  /**
   * Smart content similarity using reranker model
   */
  async rerankeResults(query: string, documents: string[]): Promise<number[]> {
    try {
      const scores: number[] = [];
      
      for (const doc of documents) {
        const response = await this.ai.run('@cf/baai/bge-reranker-base', {
          query,
          documents: [doc]
        });
        
        scores.push(response.data[0]);
      }
      
      return scores;
    } catch (error) {
      console.error('Reranking failed:', error);
      return documents.map(() => Math.random()); // Fallback random scores
    }
  }

  // Fallback methods for when AI fails

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

  private fallbackCategorization(title: string, content: string): CategoryClassification {
    const text = `${title} ${content}`.toLowerCase();
    
    if (text.includes('agent') || text.includes('role')) {
      return { category: 'agent-system', confidence: 0.7, reasoning: 'Contains agent/role keywords' };
    }
    if (text.includes('mcp') || text.includes('protocol')) {
      return { category: 'mcp-implementation', confidence: 0.7, reasoning: 'Contains MCP/protocol keywords' };
    }
    if (text.includes('database') || text.includes('vectorize')) {
      return { category: 'infrastructure', confidence: 0.7, reasoning: 'Contains database/infrastructure keywords' };
    }
    
    return { category: 'project-documentation', confidence: 0.5, reasoning: 'Default categorization' };
  }

  private fallbackTypeDetection(title: string, content: string): string {
    const text = `${title} ${content}`.toLowerCase();
    
    if (text.includes('overview')) return 'overview';
    if (text.includes('plan') || text.includes('roadmap')) return 'implementation-plan';
    if (text.includes('task') || text.includes('phase')) return 'implementation-task';
    if (text.includes('agent') && text.includes('role')) return 'agent-role';
    if (text.includes('workflow')) return 'workflow';
    
    return 'documentation';
  }

  private fallbackPriorityDetection(category: string): 'low' | 'medium' | 'high' {
    if (['agent-system', 'infrastructure', 'mcp-implementation'].includes(category)) {
      return 'high';
    }
    return 'medium';
  }

  private fallbackTagExtraction(title: string, content: string, category: string): string[] {
    const text = `${title} ${content}`.toLowerCase();
    const tags: string[] = [category];
    
    if (text.includes('mcp')) tags.push('mcp');
    if (text.includes('vector')) tags.push('vectorize');
    if (text.includes('typescript')) tags.push('typescript');
    if (text.includes('agent')) tags.push('agent');
    if (text.includes('implementation')) tags.push('implementation');
    
    return tags.slice(0, 5);
  }

  private fallbackAnalysis(title: string, content: string): ContentAnalysis {
    const categorization = this.fallbackCategorization(title, content);
    
    return {
      category: categorization.category,
      type: this.fallbackTypeDetection(title, content),
      priority: this.fallbackPriorityDetection(categorization.category),
      tags: this.fallbackTagExtraction(title, content, categorization.category),
      summary: `${title}: ${content.substring(0, 100)}...`,
      embedding: this.generateFallbackEmbedding(`${title} ${content}`),
      confidence: 0.5
    };
  }
}

/**
 * Utility functions for AI-powered content management
 */
export const AiUtils = {
  /**
   * Validate AI analysis results
   */
  validateAnalysis(analysis: ContentAnalysis): boolean {
    return (
      analysis.category &&
      analysis.type &&
      analysis.priority &&
      analysis.embedding.length === 768 &&
      analysis.confidence >= 0 &&
      analysis.confidence <= 1
    );
  },

  /**
   * Merge AI analysis with existing metadata
   */
  mergeWithExisting(analysis: ContentAnalysis, existing: any): any {
    return {
      ...existing,
      category: analysis.category,
      type: analysis.type,
      priority: analysis.priority,
      tags: [...new Set([...(existing.tags || []), ...analysis.tags])],
      summary: analysis.summary,
      aiConfidence: analysis.confidence,
      lastAnalyzed: new Date().toISOString()
    };
  },

  /**
   * Get confidence-based recommendations
   */
  getRecommendations(analysis: ContentAnalysis): string[] {
    const recommendations: string[] = [];
    
    if (analysis.confidence < 0.7) {
      recommendations.push('Low confidence - consider manual review');
    }
    
    if (analysis.tags.length < 3) {
      recommendations.push('Consider adding more specific tags');
    }
    
    if (analysis.category === 'agent-system' && analysis.priority !== 'high') {
      recommendations.push('Agent system content should typically be high priority');
    }
    
    return recommendations;
  }
};