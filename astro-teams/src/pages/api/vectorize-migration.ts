import type { APIRoute } from 'astro';
import { VectorizeManager } from '../../utils/vectorizeManager';
import type { VectorizeIndex } from '@cloudflare/workers-types';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Get Vectorize binding from Cloudflare runtime
    const vectorizeIndex = (locals.runtime?.env?.VECTORIZE as VectorizeIndex);
    
    if (!vectorizeIndex) {
      return new Response(JSON.stringify({ 
        error: 'Vectorize binding not available' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const vectorize = new VectorizeManager(vectorizeIndex);
    const { action, data } = await request.json();

    switch (action) {
      case 'migrate-agent-roles':
        await migrateAgentRoles(vectorize);
        break;
        
      case 'migrate-project-docs':
        await migrateProjectDocuments(vectorize);
        break;
        
      case 'migrate-mcp-plan':
        await migrateMcpPlan(vectorize);
        break;
        
      case 'search-knowledge':
        const results = await vectorize.searchKnowledge(data);
        return new Response(JSON.stringify({ results }), {
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

    return new Response(JSON.stringify({ 
      success: true,
      message: `${action} completed successfully`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Vectorize migration error:', error);
    return new Response(JSON.stringify({ 
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Migrate agent role specifications to vector database
 */
async function migrateAgentRoles(vectorize: VectorizeManager): Promise<void> {
  const agentRoles = [
    {
      role: 'standup-facilitator',
      capabilities: ['cross-agent coordination', 'workflow orchestration', 'status synthesis'],
      responsibilities: ['meeting facilitation', 'handoff coordination', 'progress tracking'],
      decisionAuthority: ['workflow coordination', 'handoff protocols', 'timeline management'],
      frameworks: ['Agile', 'Scrum', 'Meeting facilitation'],
      workflows: 'Coordinates daily standups, manages agent handoffs, synthesizes progress reports across all team members for comprehensive status updates'
    },
    {
      role: 'architect-engineer',
      capabilities: ['system architecture', 'technical implementation', 'database design'],
      responsibilities: ['architecture decisions', 'technical implementation', 'system optimization'],
      decisionAuthority: ['architecture decisions', 'technology stack', 'implementation strategy'],
      frameworks: ['System Design', 'Database Architecture', 'API Design'],
      workflows: 'Designs comprehensive system architecture, implements technical solutions, optimizes performance and scalability patterns'
    },
    {
      role: 'tester-reviewer',
      capabilities: ['quality validation', 'testing strategy', 'standards compliance'],
      responsibilities: ['test planning', 'quality assurance', 'code review'],
      decisionAuthority: ['testing strategy', 'quality gates', 'standards compliance'],
      frameworks: ['IEEE 829', 'ISTQB', 'ISO 25010'],
      workflows: 'Plans comprehensive testing strategy, validates quality across all deliverables, ensures industry standards compliance'
    },
    {
      role: 'optimizer-watchdog',
      capabilities: ['performance optimization', 'risk management', 'security assessment'],
      responsibilities: ['performance monitoring', 'risk assessment', 'optimization'],
      decisionAuthority: ['performance optimization', 'risk assessment', 'deployment approval'],
      frameworks: ['ITIL', 'DevOps', 'SRE'],
      workflows: 'Continuously monitors system performance, assesses risks and security vulnerabilities, optimizes for efficiency and reliability'
    },
    {
      role: 'technical-enablement',
      capabilities: ['tool provisioning', 'MCP integration', 'environment management'],
      responsibilities: ['tool setup', 'environment configuration', 'integration support'],
      decisionAuthority: ['tool selection', 'environment configuration', 'automation strategy'],
      frameworks: ['MCP Standards', 'DevOps', 'Platform Engineering'],
      workflows: 'Provisions and configures development tools, manages MCP integrations, enables team productivity through automation'
    },
    {
      role: 'morale-catalyst',
      capabilities: ['team health monitoring', 'intervention authority', 'loop detection'],
      responsibilities: ['team wellness', 'conflict resolution', 'process intervention'],
      decisionAuthority: ['team intervention', 'process escalation', 'workflow adjustment'],
      frameworks: ['Team Psychology', 'Conflict Resolution', 'Process Improvement'],
      workflows: 'Monitors team health and dynamics, intervenes in conflicts or inefficiencies, prevents workflow loops and maintains team morale'
    },
    {
      role: 'scrum-knowledge',
      capabilities: ['documentation compilation', 'knowledge management', 'workflow coordination'],
      responsibilities: ['documentation', 'knowledge capture', 'process documentation'],
      decisionAuthority: ['documentation strategy', 'knowledge organization', 'workflow documentation'],
      frameworks: ['Agile', 'PMBOK', 'Knowledge Management'],
      workflows: 'Compiles comprehensive documentation, manages team knowledge base, coordinates workflow documentation and process improvements'
    }
  ];

  for (const agent of agentRoles) {
    await vectorize.storeAgentRole(agent);
  }
}

/**
 * Migrate project documentation to vector database
 */
async function migrateProjectDocuments(vectorize: VectorizeManager): Promise<void> {
  const documents = [
    {
      id: 'project-overview',
      category: 'project-documentation',
      type: 'overview',
      title: 'Aurorion Teams - Complete Project Overview',
      description: 'Comprehensive top-to-bottom documentation of the Aurorion Teams platform including architecture, features, and development workflow',
      content: `Aurorion Teams is a sophisticated AI agent team management platform that enables dynamic configuration of specialized AI agents across different projects and repositories. Built with modern web technologies and enterprise-grade authentication, it provides a comprehensive framework for managing multi-agent AI workflows.

Key features include:
- 7 Specialized Agent Roles with distinct responsibilities
- WebAuthn/Passkey Authentication with multi-device support
- Multi-Project Support with agent customization
- Comprehensive Documentation System with search
- Testing Framework with Playwright E2E testing
- Development Workflow optimized for proxy-based development

Technology Stack:
- Frontend: Astro v5.8.0 with TypeScript and MDX
- Backend: Node.js with Astro SSR endpoints
- Database: Astro DB + Turso (libSQL)
- Authentication: WebAuthn/Passkey (SimpleWebAuthn)
- Testing: Playwright (E2E) + Vitest (Unit)
- Deployment: Cloudflare Pages + Workers`,
      tags: ['overview', 'architecture', 'platform', 'documentation']
    },
    {
      id: 'mcp-integration-plan',
      category: 'mcp-implementation',
      type: 'implementation-plan',
      title: 'MCP Integration Plan - Model Context Protocol Implementation',
      description: 'Comprehensive 6-week roadmap for converting 7-agent system to MCP implementation with local LLM deployment',
      content: `MCP Integration involves converting all 7 agents into Model Context Protocol servers with standardized communication patterns.

Implementation Phases:
Phase 1 (Foundation): Install MCP TypeScript SDK, create server template, convert Technical Enablement agent
Phase 2 (Core Agents): Convert Architect-Engineer and Standup Facilitator, implement agent communication protocols  
Phase 3 (Full System): Convert remaining 4 agents, complete workflow orchestration, integrate Ollama local models

Technical Architecture:
- Protocol: JSON-RPC 2.0 over MCP
- Transport: stdio (local) + HTTP with SSE (remote)  
- SDK: @modelcontextprotocol/sdk-typescript
- Local Models: Ollama (Llama2, CodeLlama, Mistral)
- Communication: Request-Response, Notifications, Stateful exchanges`,
      tags: ['mcp', 'implementation', 'roadmap', 'architecture']
    },
    {
      id: 'vector-database-setup',
      category: 'infrastructure',
      type: 'database-setup',
      title: 'Cloudflare Vector Database Integration',
      description: 'Implementation of Cloudflare Vectorize for organized project knowledge storage and semantic search',
      content: `Cloudflare Vectorize integration enables semantic search and AI-powered knowledge management for the Aurorion Teams project.

Features:
- 768-dimensional vectors with cosine similarity
- Metadata indexing for category, type, and priority
- Semantic search across all project documentation
- Agent-specific knowledge retrieval
- Project timeline and progress tracking

Configuration:
- Index: aurorion-project-knowledge
- Dimensions: 768 (compatible with Workers AI)
- Metric: cosine similarity
- Metadata indexes: category, type, priority`,
      tags: ['vector-database', 'cloudflare', 'vectorize', 'search']
    }
  ];

  for (const doc of documents) {
    await vectorize.storeProjectDocument(doc);
  }
}

/**
 * Migrate MCP implementation plan to vector database
 */
async function migrateMcpPlan(vectorize: VectorizeManager): Promise<void> {
  const mcpTasks = [
    {
      phase: 'Phase 1 - Foundation',
      task: 'Install MCP TypeScript SDK',
      description: 'Install and configure MCP TypeScript SDK with proper dependencies and build system integration',
      technicalSpecs: 'Add @modelcontextprotocol/sdk-typescript dependency, configure TypeScript types, update build configuration for MCP compatibility',
      dependencies: ['Node.js 20+', 'TypeScript', 'npm'],
      deliverables: ['SDK integration', 'Type definitions', 'Build configuration', 'Basic MCP server structure']
    },
    {
      phase: 'Phase 1 - Foundation',
      task: 'Create MCP Server Template',
      description: 'Design and implement reusable MCP server template with standardized agent patterns',
      technicalSpecs: 'Reusable server template with agent capability interfaces, JSON-RPC patterns, error handling, and configuration management',
      dependencies: ['MCP SDK', 'Agent role specifications'],
      deliverables: ['mcp-server-template.ts', 'agent-capabilities-interface', 'Configuration schema']
    },
    {
      phase: 'Phase 2 - Core Agents',
      task: 'Agent Communication Protocols',
      description: 'Implement standardized agent-to-agent communication via MCP message protocols',
      technicalSpecs: 'JSON-RPC 2.0 message protocols, workflow handoff mechanisms, request-response patterns, notification systems',
      dependencies: ['Multiple MCP servers', 'Communication patterns'],
      deliverables: ['Communication protocols', 'Message routing', 'Handoff mechanisms', 'Error handling']
    }
  ];

  for (const task of mcpTasks) {
    await vectorize.storeMcpDocumentation(task);
  }
}