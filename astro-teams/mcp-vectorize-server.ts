#!/usr/bin/env tsx

/**
 * MCP Vectorize Server for Aurorion Teams
 * 
 * Provides direct Model Context Protocol interface to Cloudflare Vectorize
 * Enables Claude Code to interact directly with your vector database
 */

import { AurorionMcpServer, AgentConfig, McpAgentUtils } from './src/mcp/server-template.js';
import { VectorizeManager, VectorizeUtils, type ProjectVector } from './src/utils/vectorizeManager.js';
import { z } from 'zod';

/**
 * Vector Database MCP Server Configuration
 */
const vectorServerConfig: AgentConfig = {
  name: 'aurorion-vectorize-server',
  version: '1.0.0',
  description: 'Direct interface to Aurorion Teams Cloudflare Vectorize database',
  agentRole: 'vectorize-database',
  capabilities: [],
  resources: [],
  prompts: [],
  frameworks: ['Cloudflare Vectorize', 'Vector Search', 'AI Embeddings'],
  decisionAuthority: ['vector operations', 'embedding generation', 'knowledge retrieval']
};

/**
 * Vectorize Database Environment (simulated for MCP context)
 */
interface VectorizeEnvironment {
  workerUrl: string;
  apiToken?: string;
}

export class VectorizeServer extends AurorionMcpServer {
  private vectorizeEnv: VectorizeEnvironment;

  constructor(config: AgentConfig, vectorizeEnv: VectorizeEnvironment) {
    super(config);
    this.vectorizeEnv = vectorizeEnv;
    this.setupVectorizeCapabilities();
  }

  private setupVectorizeCapabilities() {
    // Vector Search Capability
    this.addCapability({
      name: 'search_vectors',
      description: 'Search the vector database using semantic similarity',
      inputSchema: z.object({
        query: z.string().describe('Search query text'),
        limit: z.number().min(1).max(50).default(10).describe('Maximum results to return'),
        category: z.string().optional().describe('Filter by document category'),
        type: z.string().optional().describe('Filter by document type'),
        agentRole: z.string().optional().describe('Filter by agent role'),
        priority: z.enum(['low', 'medium', 'high']).optional().describe('Filter by priority level'),
        projectId: z.string().optional().describe('Filter by project ID'),
        threshold: z.number().min(0).max(1).default(0.1).describe('Minimum similarity threshold')
      }),
      handler: async (input) => {
        const filter: Record<string, any> = {};
        if (input.category) filter.category = input.category;
        if (input.type) filter.type = input.type;
        if (input.agentRole) filter.agentRole = input.agentRole;
        if (input.priority) filter.priority = input.priority;
        if (input.projectId) filter.projectId = input.projectId;

        const response = await fetch(`${this.vectorizeEnv.workerUrl}/query-vectorize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.vectorizeEnv.apiToken && { 'Authorization': `Bearer ${this.vectorizeEnv.apiToken}` })
          },
          body: JSON.stringify({
            query: input.query,
            limit: input.limit,
            filter: Object.keys(filter).length > 0 ? filter : undefined,
            threshold: input.threshold
          })
        });

        if (!response.ok) {
          throw new Error(`Vector search failed: ${response.status} ${response.statusText}`);
        }

        const results = await response.json();
        
        return {
          success: true,
          query: input.query,
          totalResults: results.results?.length || 0,
          results: results.results?.map((result: any) => ({
            id: result.id,
            score: result.score,
            title: result.metadata?.title,
            category: result.metadata?.category,
            type: result.metadata?.type,
            content: result.metadata?.content?.substring(0, 300) + '...',
            projectId: result.metadata?.projectId,
            agentRole: result.metadata?.agentRole,
            timestamp: result.metadata?.timestamp,
            tags: result.metadata?.tags
          })) || []
        };
      }
    });

    // Insert Vector Capability
    this.addCapability({
      name: 'insert_vector',
      description: 'Insert new document into the vector database',
      inputSchema: z.object({
        id: z.string().describe('Unique identifier for the document'),
        title: z.string().describe('Document title'),
        content: z.string().describe('Document content'),
        category: z.string().describe('Document category'),
        type: z.string().describe('Document type'),
        priority: z.enum(['low', 'medium', 'high']).default('medium').describe('Priority level'),
        description: z.string().optional().describe('Document description'),
        projectId: z.string().optional().describe('Associated project ID'),
        agentRole: z.string().optional().describe('Associated agent role'),
        tags: z.array(z.string()).default([]).describe('Document tags'),
        metadata: z.record(z.any()).optional().describe('Additional metadata')
      }),
      handler: async (input) => {
        const response = await fetch(`${this.vectorizeEnv.workerUrl}/insert-vector`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.vectorizeEnv.apiToken && { 'Authorization': `Bearer ${this.vectorizeEnv.apiToken}` })
          },
          body: JSON.stringify({
            id: input.id,
            title: input.title,
            content: input.content,
            category: input.category,
            type: input.type,
            priority: input.priority,
            description: input.description || input.title,
            projectId: input.projectId,
            agentRole: input.agentRole,
            tags: input.tags,
            metadata: input.metadata || {}
          })
        });

        if (!response.ok) {
          throw new Error(`Vector insertion failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        return {
          success: true,
          id: input.id,
          message: 'Document successfully inserted into vector database',
          vectorId: result.vectorId,
          embeddingGenerated: result.embeddingGenerated || true
        };
      }
    });

    // Update Vector Capability
    this.addCapability({
      name: 'update_vector',
      description: 'Update existing document in the vector database',
      inputSchema: z.object({
        id: z.string().describe('Existing document ID to update'),
        title: z.string().optional().describe('Updated title'),
        content: z.string().optional().describe('Updated content'),
        category: z.string().optional().describe('Updated category'),
        type: z.string().optional().describe('Updated type'),
        priority: z.enum(['low', 'medium', 'high']).optional().describe('Updated priority'),
        description: z.string().optional().describe('Updated description'),
        status: z.string().optional().describe('Updated status'),
        tags: z.array(z.string()).optional().describe('Updated tags'),
        metadata: z.record(z.any()).optional().describe('Additional metadata to merge')
      }),
      handler: async (input) => {
        const updateData: any = { id: input.id };
        if (input.title) updateData.title = input.title;
        if (input.content) updateData.content = input.content;
        if (input.category) updateData.category = input.category;
        if (input.type) updateData.type = input.type;
        if (input.priority) updateData.priority = input.priority;
        if (input.description) updateData.description = input.description;
        if (input.status) updateData.status = input.status;
        if (input.tags) updateData.tags = input.tags;
        if (input.metadata) updateData.metadata = input.metadata;

        const response = await fetch(`${this.vectorizeEnv.workerUrl}/update-vector`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(this.vectorizeEnv.apiToken && { 'Authorization': `Bearer ${this.vectorizeEnv.apiToken}` })
          },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) {
          throw new Error(`Vector update failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        return {
          success: true,
          id: input.id,
          message: 'Document successfully updated in vector database',
          fieldsUpdated: Object.keys(updateData).filter(k => k !== 'id'),
          reembedded: result.reembedded || false
        };
      }
    });

    // Delete Vector Capability
    this.addCapability({
      name: 'delete_vector',
      description: 'Delete document from the vector database',
      inputSchema: z.object({
        id: z.string().describe('Document ID to delete'),
        confirm: z.boolean().default(false).describe('Confirmation flag to prevent accidental deletion')
      }),
      handler: async (input) => {
        if (!input.confirm) {
          throw new Error('Deletion requires confirmation flag to be set to true');
        }

        const response = await fetch(`${this.vectorizeEnv.workerUrl}/delete-vector`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(this.vectorizeEnv.apiToken && { 'Authorization': `Bearer ${this.vectorizeEnv.apiToken}` })
          },
          body: JSON.stringify({ id: input.id })
        });

        if (!response.ok) {
          throw new Error(`Vector deletion failed: ${response.status} ${response.statusText}`);
        }

        return {
          success: true,
          id: input.id,
          message: 'Document successfully deleted from vector database',
          deletedAt: new Date().toISOString()
        };
      }
    });

    // Batch Operations Capability
    this.addCapability({
      name: 'batch_insert_vectors',
      description: 'Insert multiple documents into the vector database in a single operation',
      inputSchema: z.object({
        documents: z.array(z.object({
          id: z.string(),
          title: z.string(),
          content: z.string(),
          category: z.string(),
          type: z.string(),
          priority: z.enum(['low', 'medium', 'high']).default('medium'),
          description: z.string().optional(),
          projectId: z.string().optional(),
          agentRole: z.string().optional(),
          tags: z.array(z.string()).default([]),
          metadata: z.record(z.any()).optional()
        })).min(1).max(100).describe('Array of documents to insert (max 100)')
      }),
      handler: async (input) => {
        const response = await fetch(`${this.vectorizeEnv.workerUrl}/batch-insert-vectors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.vectorizeEnv.apiToken && { 'Authorization': `Bearer ${this.vectorizeEnv.apiToken}` })
          },
          body: JSON.stringify({ documents: input.documents })
        });

        if (!response.ok) {
          throw new Error(`Batch vector insertion failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        return {
          success: true,
          documentsInserted: input.documents.length,
          results: result.results || [],
          message: `Successfully inserted ${input.documents.length} documents into vector database`
        };
      }
    });

    // Get Vector Statistics Capability
    this.addCapability({
      name: 'get_vector_stats',
      description: 'Get statistics about the vector database contents',
      inputSchema: z.object({
        category: z.string().optional().describe('Filter stats by category'),
        projectId: z.string().optional().describe('Filter stats by project ID'),
        agentRole: z.string().optional().describe('Filter stats by agent role'),
        detailed: z.boolean().default(false).describe('Include detailed breakdown')
      }),
      handler: async (input) => {
        const queryParams = new URLSearchParams();
        if (input.category) queryParams.set('category', input.category);
        if (input.projectId) queryParams.set('projectId', input.projectId);
        if (input.agentRole) queryParams.set('agentRole', input.agentRole);
        if (input.detailed) queryParams.set('detailed', 'true');

        const response = await fetch(`${this.vectorizeEnv.workerUrl}/vector-stats?${queryParams}`, {
          method: 'GET',
          headers: {
            ...(this.vectorizeEnv.apiToken && { 'Authorization': `Bearer ${this.vectorizeEnv.apiToken}` })
          }
        });

        if (!response.ok) {
          throw new Error(`Vector stats failed: ${response.status} ${response.statusText}`);
        }

        const stats = await response.json();
        
        return {
          success: true,
          totalVectors: stats.totalVectors || 0,
          categories: stats.categories || {},
          types: stats.types || {},
          agentRoles: stats.agentRoles || {},
          projects: stats.projects || {},
          averageVectorSize: stats.averageVectorSize || 0,
          lastUpdated: stats.lastUpdated,
          ...(input.detailed && { detailed: stats.detailed || {} })
        };
      }
    });

    // Add standard agent capabilities
    this.addCapability(McpAgentUtils.createDecisionCapability('vectorize-database', this.getConfig().frameworks));
    this.addCapability(McpAgentUtils.createStatusCapability('vectorize-database'));

    // Add vector database resource
    this.addResource({
      uri: 'vectorize://aurorion-teams/knowledge-base',
      name: 'Aurorion Teams Vector Knowledge Base',
      description: 'Complete vector database containing project documentation, agent specifications, and knowledge',
      mimeType: 'application/json',
      handler: async () => {
        const response = await fetch(`${this.vectorizeEnv.workerUrl}/vector-stats?detailed=true`, {
          method: 'GET',
          headers: {
            ...(this.vectorizeEnv.apiToken && { 'Authorization': `Bearer ${this.vectorizeEnv.apiToken}` })
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to get knowledge base info: ${response.status}`);
        }

        const stats = await response.json();
        
        return JSON.stringify({
          name: 'Aurorion Teams Vector Knowledge Base',
          description: 'Comprehensive vector database for the Aurorion Teams project',
          indexName: 'aurorion-project-knowledge',
          totalDocuments: stats.totalVectors || 0,
          categories: stats.categories || {},
          capabilities: [
            'Semantic search across all project documentation',
            'Agent-specific knowledge retrieval',
            'Project timeline and progress tracking',
            'Architecture and implementation guidance',
            'Real-time document insertion and updates'
          ],
          lastUpdated: stats.lastUpdated || new Date().toISOString(),
          apiEndpoint: this.vectorizeEnv.workerUrl
        }, null, 2);
      }
    });
  }
}

/**
 * Start the Vectorize MCP Server
 */
async function startVectorizeServer() {
  // Default to local development environment
  const workerUrl = process.env.VECTORIZE_WORKER_URL || 'http://localhost:8788';
  const apiToken = process.env.VECTORIZE_API_TOKEN; // Optional for local development

  const vectorizeEnv: VectorizeEnvironment = {
    workerUrl,
    apiToken
  };

  const server = new VectorizeServer(vectorServerConfig, vectorizeEnv);
  
  console.error('Starting Aurorion Vectorize MCP Server...');
  console.error(`Worker URL: ${workerUrl}`);
  console.error(`API Token: ${apiToken ? 'Configured' : 'Not configured (local development)'}`);
  
  await server.start();
}

// Start the server if run directly
if (require.main === module) {
  startVectorizeServer().catch((error) => {
    console.error('Failed to start Vectorize MCP server:', error);
    process.exit(1);
  });
}

export { VectorizeServer, vectorServerConfig };