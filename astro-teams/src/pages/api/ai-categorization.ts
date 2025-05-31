import type { APIRoute } from 'astro';
import { VectorizeManager } from '../../utils/vectorizeManager';
import { AurorionAiManager } from '../../utils/aiManager';
import type { VectorizeIndex, Ai } from '@cloudflare/workers-types';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Get AI and Vectorize bindings from Cloudflare runtime
    const ai = locals.runtime?.env?.AI as Ai;
    const vectorizeIndex = locals.runtime?.env?.VECTORIZE as VectorizeIndex;
    
    if (!ai) {
      return new Response(JSON.stringify({ 
        error: 'AI binding not available - check wrangler.toml configuration' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!vectorizeIndex) {
      return new Response(JSON.stringify({ 
        error: 'Vectorize binding not available' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { action, data } = await request.json();
    const aiManager = new AurorionAiManager(ai);
    const vectorizeManager = new VectorizeManager(vectorizeIndex, ai);

    switch (action) {
      case 'analyze-content':
        const analysis = await aiManager.analyzeContent(
          data.title,
          data.content,
          data.context
        );
        return new Response(JSON.stringify({ 
          success: true,
          analysis 
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'store-intelligently':
        const storeResult = await vectorizeManager.storeContentIntelligently({
          id: data.id,
          title: data.title,
          content: data.content,
          context: data.context,
          projectId: data.projectId,
          agentRole: data.agentRole
        });
        
        return new Response(JSON.stringify({ 
          success: true,
          analysis: storeResult,
          message: 'Content stored with AI-powered categorization'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'batch-analyze':
        const batchResults = await aiManager.batchAnalyzeContent(data.items);
        return new Response(JSON.stringify({ 
          success: true,
          results: batchResults
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'generate-embedding':
        const embedding = await aiManager.generateEmbedding(data.text);
        return new Response(JSON.stringify({ 
          success: true,
          embedding,
          dimensions: embedding.length
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'search-semantic':
        const searchEmbedding = await aiManager.generateEmbedding(data.query);
        const searchResults = await vectorizeIndex.query(searchEmbedding, {
          topK: data.limit || 10,
          filter: data.filter,
          returnValues: false,
          returnMetadata: true
        });

        return new Response(JSON.stringify({ 
          success: true,
          results: searchResults.matches.map(match => ({
            id: match.id,
            score: match.score,
            metadata: match.metadata
          }))
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'rerank-results':
        const scores = await aiManager.rerankeResults(data.query, data.documents);
        return new Response(JSON.stringify({ 
          success: true,
          scores
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'migrate-with-ai':
        // Intelligent migration of existing project data
        await migrateProjectDataWithAI(aiManager, vectorizeManager);
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Project data migrated with AI-powered categorization'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ 
          error: 'Invalid action' 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('AI categorization error:', error);
    return new Response(JSON.stringify({ 
      error: 'AI operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Migrate existing project data using AI-powered analysis
 */
async function migrateProjectDataWithAI(
  aiManager: AurorionAiManager,
  vectorizeManager: VectorizeManager
): Promise<void> {
  const projectData = [
    {
      id: 'ai-enhanced-project-overview',
      title: 'Aurorion Teams - AI-Enhanced Project Overview',
      content: `Sophisticated AI agent team management platform with dynamic configuration of specialized AI agents. 
      Features include 7 specialized agent roles, WebAuthn authentication, multi-project support, and now AI-powered 
      content categorization using Cloudflare Workers AI. The system uses semantic embeddings for intelligent search 
      and automatic content organization.`,
      context: 'Updated with AI integration features'
    },
    {
      id: 'ai-powered-vectorization',
      title: 'AI-Powered Content Categorization and Vectorization',
      content: `Cloudflare Workers AI integration for intelligent content processing. Uses bge-base-en-v1.5 for 768-dimensional 
      semantic embeddings, Llama 3.1 for content categorization, and reranker models for result optimization. Provides 
      automatic categorization, priority detection, tag extraction, and summary generation.`,
      context: 'New AI capabilities for content management'
    },
    {
      id: 'mcp-ai-integration',
      title: 'MCP Integration with AI-Powered Agent Communication',
      content: `Model Context Protocol implementation enhanced with AI capabilities. Agents can now use AI for intelligent 
      decision making, content analysis, and semantic communication. Includes AI-powered workflow optimization and 
      intelligent handoff protocols.`,
      context: 'MCP enhanced with AI capabilities'
    }
  ];

  console.log('🤖 Migrating project data with AI analysis...');

  for (const item of projectData) {
    await vectorizeManager.storeContentIntelligently({
      id: item.id,
      title: item.title,
      content: item.content,
      context: item.context,
      projectId: 'aurorion-teams-ai-enhanced'
    });
  }

  console.log('✅ AI-powered migration completed');
}