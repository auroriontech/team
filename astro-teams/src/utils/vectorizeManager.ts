import type { VectorizeIndex, Ai } from '@cloudflare/workers-types';
import { AurorionAiManager, type ContentAnalysis } from './aiManager';

export interface ProjectVector {
  id: string;
  values: number[];
  metadata: {
    category: string;
    type: string;
    priority: string;
    title: string;
    description: string;
    content: string;
    timestamp: string;
    projectId?: string;
    agentRole?: string;
    status?: string;
    tags?: string[];
  };
}

export interface VectorizeEnvironment {
  VECTORIZE: VectorizeIndex;
  AI: Ai;
}

export class VectorizeManager {
  private vectorize: VectorizeIndex;
  private aiManager?: AurorionAiManager;

  constructor(vectorizeIndex: VectorizeIndex, ai?: Ai) {
    this.vectorize = vectorizeIndex;
    if (ai) {
      this.aiManager = new AurorionAiManager(ai);
    }
  }

  /**
   * Generate embeddings for text content using Workers AI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (this.aiManager) {
      return await this.aiManager.generateEmbedding(text);
    }
    
    // Fallback to deterministic mock embedding if AI not available
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = hash % 1000;
    const embedding = [];
    
    for (let i = 0; i < 768; i++) {
      const value = Math.sin(seed + i) * Math.cos(seed + i * 2) * 0.5;
      embedding.push(value);
    }
    
    return embedding;
  }

  /**
   * AI-powered intelligent content storage with automatic categorization
   */
  async storeContentIntelligently({
    id,
    title,
    content,
    context,
    projectId,
    agentRole,
    status = 'active'
  }: {
    id: string;
    title: string;
    content: string;
    context?: string;
    projectId?: string;
    agentRole?: string;
    status?: string;
  }): Promise<ContentAnalysis | null> {
    if (!this.aiManager) {
      console.warn('AI Manager not available, falling back to manual storage');
      return null;
    }

    try {
      // Use AI to analyze and categorize content
      const analysis = await this.aiManager.analyzeContent(title, content, context);

      // Store with AI-generated metadata
      const vector: ProjectVector = {
        id,
        values: analysis.embedding,
        metadata: {
          category: analysis.category,
          type: analysis.type,
          priority: analysis.priority,
          title,
          description: analysis.summary,
          content: content.substring(0, 1000),
          timestamp: new Date().toISOString(),
          projectId,
          agentRole,
          status,
          tags: analysis.tags,
          aiConfidence: analysis.confidence,
          lastAnalyzed: new Date().toISOString()
        }
      };

      await this.vectorize.upsert([vector]);
      return analysis;
    } catch (error) {
      console.error('Intelligent storage failed:', error);
      return null;
    }
  }

  /**
   * Store project documentation in vector database
   */
  async storeProjectDocument({
    id,
    category,
    type,
    priority = 'medium',
    title,
    description,
    content,
    projectId,
    agentRole,
    status = 'active',
    tags = []
  }: {
    id: string;
    category: string;
    type: string;
    priority?: string;
    title: string;
    description: string;
    content: string;
    projectId?: string;
    agentRole?: string;
    status?: string;
    tags?: string[];
  }): Promise<void> {
    // Generate embedding for the combined content
    const textToEmbed = `${title}. ${description}. ${content}`;
    const embedding = await this.generateEmbedding(textToEmbed);

    const vector: ProjectVector = {
      id,
      values: embedding,
      metadata: {
        category,
        type,
        priority,
        title,
        description,
        content: content.substring(0, 1000), // Limit content size
        timestamp: new Date().toISOString(),
        projectId,
        agentRole,
        status,
        tags
      }
    };

    await this.vectorize.upsert([vector]);
  }

  /**
   * Store agent role documentation
   */
  async storeAgentRole({
    agentRole,
    capabilities,
    responsibilities,
    decisionAuthority,
    frameworks,
    workflows
  }: {
    agentRole: string;
    capabilities: string[];
    responsibilities: string[];
    decisionAuthority: string[];
    frameworks: string[];
    workflows: string;
  }): Promise<void> {
    const content = `
Agent Role: ${agentRole}
Capabilities: ${capabilities.join(', ')}
Responsibilities: ${responsibilities.join(', ')}
Decision Authority: ${decisionAuthority.join(', ')}
Frameworks: ${frameworks.join(', ')}
Workflows: ${workflows}
    `.trim();

    await this.storeProjectDocument({
      id: `agent-role-${agentRole}`,
      category: 'agent-system',
      type: 'agent-role',
      priority: 'high',
      title: `${agentRole} Agent Role`,
      description: `Complete specification for ${agentRole} agent including capabilities and workflows`,
      content,
      agentRole,
      tags: ['agent', 'role', 'specification', agentRole]
    });
  }

  /**
   * Store project progress and activities
   */
  async storeProjectProgress({
    projectId,
    activityType,
    action,
    description,
    metadata,
    impact = 'medium'
  }: {
    projectId: string;
    activityType: string;
    action: string;
    description: string;
    metadata: Record<string, any>;
    impact?: string;
  }): Promise<void> {
    const content = `
Activity: ${action}
Description: ${description}
Metadata: ${JSON.stringify(metadata, null, 2)}
    `.trim();

    await this.storeProjectDocument({
      id: `activity-${projectId}-${Date.now()}`,
      category: 'project-progress',
      type: activityType,
      priority: impact === 'high' ? 'high' : 'medium',
      title: `${activityType}: ${action}`,
      description,
      content,
      projectId,
      tags: ['activity', 'progress', activityType, impact]
    });
  }

  /**
   * Store MCP implementation documentation
   */
  async storeMcpDocumentation({
    phase,
    task,
    description,
    technicalSpecs,
    dependencies,
    deliverables
  }: {
    phase: string;
    task: string;
    description: string;
    technicalSpecs: string;
    dependencies: string[];
    deliverables: string[];
  }): Promise<void> {
    const content = `
MCP Implementation Phase: ${phase}
Task: ${task}
Description: ${description}
Technical Specifications: ${technicalSpecs}
Dependencies: ${dependencies.join(', ')}
Deliverables: ${deliverables.join(', ')}
    `.trim();

    await this.storeProjectDocument({
      id: `mcp-${phase}-${task.toLowerCase().replace(/\s+/g, '-')}`,
      category: 'mcp-implementation',
      type: 'implementation-task',
      priority: 'high',
      title: `MCP ${phase}: ${task}`,
      description,
      content,
      projectId: 'aurorion-teams-mcp-integration',
      tags: ['mcp', 'implementation', phase.toLowerCase(), 'task']
    });
  }

  /**
   * Search project knowledge base
   */
  async searchKnowledge({
    query,
    category,
    type,
    priority,
    limit = 10
  }: {
    query: string;
    category?: string;
    type?: string;
    priority?: string;
    limit?: number;
  }): Promise<ProjectVector[]> {
    // Generate embedding for the search query
    const queryEmbedding = await this.generateEmbedding(query);

    // Build filter conditions
    const filter: Record<string, any> = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    // Perform vector search
    const results = await this.vectorize.query(queryEmbedding, {
      topK: limit,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      returnValues: true,
      returnMetadata: true
    });

    return results.matches.map(match => ({
      id: match.id,
      values: match.values || [],
      metadata: match.metadata as ProjectVector['metadata']
    }));
  }

  /**
   * Get agent-specific knowledge
   */
  async getAgentKnowledge(agentRole: string, query?: string): Promise<ProjectVector[]> {
    if (query) {
      return this.searchKnowledge({
        query,
        category: 'agent-system',
        type: 'agent-role'
      });
    }

    // Get all knowledge for specific agent
    const embedding = await this.generateEmbedding(agentRole);
    const results = await this.vectorize.query(embedding, {
      topK: 50,
      filter: { agentRole },
      returnValues: true,
      returnMetadata: true
    });

    return results.matches.map(match => ({
      id: match.id,
      values: match.values || [],
      metadata: match.metadata as ProjectVector['metadata']
    }));
  }

  /**
   * Get project timeline and progress
   */
  async getProjectTimeline(projectId: string): Promise<ProjectVector[]> {
    const embedding = await this.generateEmbedding(`project timeline ${projectId}`);
    const results = await this.vectorize.query(embedding, {
      topK: 100,
      filter: { 
        category: 'project-progress',
        projectId 
      },
      returnValues: true,
      returnMetadata: true
    });

    return results.matches
      .map(match => ({
        id: match.id,
        values: match.values || [],
        metadata: match.metadata as ProjectVector['metadata']
      }))
      .sort((a, b) => 
        new Date(b.metadata.timestamp).getTime() - 
        new Date(a.metadata.timestamp).getTime()
      );
  }

  /**
   * Bulk store project data migration
   */
  async migrateProjectData(vectors: ProjectVector[]): Promise<void> {
    // Batch insert vectors (Vectorize supports up to 1000 vectors per request)
    const batchSize = 1000;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await this.vectorize.upsert(batch);
    }
  }
}

/**
 * Utility functions for vector database operations
 */
export const VectorizeUtils = {
  /**
   * Create vector ID from content
   */
  createVectorId(category: string, type: string, identifier: string): string {
    return `${category}-${type}-${identifier}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  },

  /**
   * Prepare content for vectorization
   */
  prepareContent(title: string, description: string, content: string): string {
    return `${title}. ${description}. ${content}`.substring(0, 8000); // Limit for embedding
  },

  /**
   * Extract metadata from project data
   */
  extractMetadata(data: any, category: string, type: string): ProjectVector['metadata'] {
    return {
      category,
      type,
      priority: data.priority || 'medium',
      title: data.title || data.name || 'Untitled',
      description: data.description || '',
      content: data.content || JSON.stringify(data),
      timestamp: new Date().toISOString(),
      projectId: data.projectId,
      agentRole: data.agentRole || data.role,
      status: data.status || 'active',
      tags: data.tags || []
    };
  }
};