#!/usr/bin/env tsx

/**
 * MCP RAG Agent for Aurorion Teams
 * 
 * Provides intelligent document search and AI-powered assistance
 * through Model Context Protocol (MCP) integration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

interface RAGQueryOptions {
  query: string;
  limit?: number;
  filter?: {
    category?: string;
    agentRole?: string;
    priority?: string;
  };
}

class AurorionRAGAgent {
  private workerUrl: string;
  private server: Server;

  constructor(workerUrl: string = 'http://localhost:8788') {
    this.workerUrl = workerUrl;
    this.server = new Server(
      {
        name: 'aurorion-rag-agent',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_documentation',
            description: 'Search through Aurorion Teams documentation using AI-powered semantic search',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for documentation',
                },
                category: {
                  type: 'string',
                  description: 'Filter by document category (agent-system, platform-docs, architecture, etc.)',
                  enum: ['agent-system', 'platform-docs', 'architecture', 'project-management', 'implementation', 'project-overview', 'reports-analysis']
                },
                agent_role: {
                  type: 'string',
                  description: 'Filter by specific agent role',
                  enum: ['architect-engineer', 'tester-reviewer', 'optimizer-watchdog', 'scrum-knowledge', 'technical-enablement', 'morale-catalyst', 'standup-facilitator']
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results to return (default: 5)',
                  minimum: 1,
                  maximum: 20
                }
              },
              required: ['query'],
            },
          },
          {
            name: 'ask_ai_assistant',
            description: 'Ask questions about the Aurorion Teams project with AI-powered answers based on documentation',
            inputSchema: {
              type: 'object',
              properties: {
                question: {
                  type: 'string',
                  description: 'Question about the project, architecture, or implementation',
                },
                context_category: {
                  type: 'string',
                  description: 'Preferred context category for the answer',
                  enum: ['agent-system', 'platform-docs', 'architecture', 'project-management', 'implementation']
                }
              },
              required: ['question'],
            },
          },
          {
            name: 'get_agent_guidance',
            description: 'Get specific guidance from a particular agent role based on their expertise',
            inputSchema: {
              type: 'object',
              properties: {
                agent_role: {
                  type: 'string',
                  description: 'The agent role to consult',
                  enum: ['architect-engineer', 'tester-reviewer', 'optimizer-watchdog', 'scrum-knowledge', 'technical-enablement', 'morale-catalyst', 'standup-facilitator']
                },
                task: {
                  type: 'string',
                  description: 'The task or question you need guidance on',
                },
                priority: {
                  type: 'string',
                  description: 'Priority level for the guidance',
                  enum: ['low', 'medium', 'high']
                }
              },
              required: ['agent_role', 'task'],
            },
          },
          {
            name: 'analyze_project_status',
            description: 'Get current project status and recommendations based on documentation analysis',
            inputSchema: {
              type: 'object',
              properties: {
                focus_area: {
                  type: 'string',
                  description: 'Specific area to analyze',
                  enum: ['overall', 'architecture', 'implementation', 'testing', 'optimization', 'documentation']
                }
              },
              required: ['focus_area'],
            },
          }
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_documentation':
            return await this.searchDocumentation(args as any);
          
          case 'ask_ai_assistant':
            return await this.askAIAssistant(args as any);
          
          case 'get_agent_guidance':
            return await this.getAgentGuidance(args as any);
          
          case 'analyze_project_status':
            return await this.analyzeProjectStatus(args as any);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  private async searchDocumentation(args: {
    query: string;
    category?: string;
    agent_role?: string;
    limit?: number;
  }) {
    const { query, category, agent_role, limit = 5 } = args;

    const filter: any = {};
    if (category) filter.category = category;
    if (agent_role) filter.agentRole = agent_role;

    try {
      const response = await fetch(`${this.workerUrl}/query-vectorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit, filter })
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const results = await response.json();
      
      const resultsText = results.results?.map((result: any, i: number) => 
        `${i + 1}. **${result.metadata.title}** (${result.metadata.category})\n` +
        `   Similarity: ${(result.score * 100).toFixed(1)}%\n` +
        `   File: ${result.metadata.filePath}\n` +
        `   Content: ${result.metadata.content.substring(0, 200)}...\n`
      ).join('\n') || 'No results found';

      return {
        content: [
          {
            type: 'text',
            text: `## Search Results for: "${query}"\n\n${resultsText}`,
          },
        ],
      };

    } catch (error) {
      throw new Error(`Documentation search failed: ${error.message}`);
    }
  }

  private async askAIAssistant(args: {
    question: string;
    context_category?: string;
  }) {
    const { question, context_category } = args;

    try {
      const filter = context_category ? { category: context_category } : {};
      
      const response = await fetch(`${this.workerUrl}/rag-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: question, 
          limit: 5,
          filter 
        })
      });

      if (!response.ok) {
        throw new Error(`AI query failed: ${response.status}`);
      }

      const result = await response.json();
      
      const sourcesText = result.sources?.map((source: any) => 
        `- ${source.title} (${source.category})`
      ).join('\n') || 'No sources found';

      return {
        content: [
          {
            type: 'text',
            text: `## AI Assistant Response\n\n**Question:** ${question}\n\n**Answer:** ${result.answer}\n\n**Sources:**\n${sourcesText}`,
          },
        ],
      };

    } catch (error) {
      throw new Error(`AI assistant query failed: ${error.message}`);
    }
  }

  private async getAgentGuidance(args: {
    agent_role: string;
    task: string;
    priority?: string;
  }) {
    const { agent_role, task, priority = 'medium' } = args;

    try {
      // Search for agent-specific documentation
      const response = await fetch(`${this.workerUrl}/rag-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: `${agent_role} guidance for: ${task}`, 
          limit: 3,
          filter: { agentRole: agent_role }
        })
      });

      if (!response.ok) {
        throw new Error(`Agent guidance query failed: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        content: [
          {
            type: 'text',
            text: `## ${agent_role.charAt(0).toUpperCase() + agent_role.slice(1)} Agent Guidance\n\n` +
                  `**Task:** ${task}\n` +
                  `**Priority:** ${priority}\n\n` +
                  `**Guidance:** ${result.answer}\n\n` +
                  `**Relevant Documentation:**\n` +
                  result.sources?.map((source: any) => 
                    `- ${source.title} (${source.category})`
                  ).join('\n') || 'No specific documentation found',
          },
        ],
      };

    } catch (error) {
      throw new Error(`Agent guidance failed: ${error.message}`);
    }
  }

  private async analyzeProjectStatus(args: {
    focus_area: string;
  }) {
    const { focus_area } = args;

    try {
      // Query for project status and analysis documents
      const statusQuery = focus_area === 'overall' 
        ? 'project status overview progress analysis'
        : `project ${focus_area} status analysis`;

      const response = await fetch(`${this.workerUrl}/rag-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: statusQuery, 
          limit: 5,
          filter: { category: 'reports-analysis' }
        })
      });

      if (!response.ok) {
        throw new Error(`Status analysis failed: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        content: [
          {
            type: 'text',
            text: `## Project Status Analysis: ${focus_area}\n\n` +
                  `**Analysis:** ${result.answer}\n\n` +
                  `**Based on Documentation:**\n` +
                  result.sources?.map((source: any) => 
                    `- ${source.title} (${(source.similarity * 100).toFixed(1)}% relevant)`
                  ).join('\n') || 'No status documents found',
          },
        ],
      };

    } catch (error) {
      throw new Error(`Project status analysis failed: ${error.message}`);
    }
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Aurorion RAG Agent MCP server running on stdio');
  }
}

// Start the server if run directly
if (require.main === module) {
  const agent = new AurorionRAGAgent();
  agent.start().catch(console.error);
}

export { AurorionRAGAgent };