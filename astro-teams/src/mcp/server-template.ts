import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

/**
 * Base MCP Server Template for Aurorion Teams Agents
 * Provides standardized patterns for agent capability implementation
 */

export interface AgentCapability {
  name: string;
  description: string;
  inputSchema: z.ZodSchema<any>;
  handler: (input: any) => Promise<any>;
}

export interface AgentResource {
  uri: string;
  name: string;
  description: string;
  mimeType?: string;
  handler: () => Promise<string>;
}

export interface AgentPrompt {
  name: string;
  description: string;
  arguments?: Array<{
    name: string;
    description: string;
    required?: boolean;
  }>;
  handler: (args: Record<string, any>) => Promise<{
    messages: Array<{
      role: 'user' | 'assistant' | 'system';
      content: {
        type: 'text' | 'image';
        text?: string;
        data?: string;
        mimeType?: string;
      };
    }>;
  }>;
}

export interface AgentConfig {
  name: string;
  version: string;
  description: string;
  agentRole: string;
  capabilities: AgentCapability[];
  resources: AgentResource[];
  prompts: AgentPrompt[];
  frameworks: string[];
  decisionAuthority: string[];
}

/**
 * Base MCP Server class for Aurorion Teams agents
 */
export class AurorionMcpServer {
  private server: Server;
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.server = new Server(
      {
        name: config.name,
        version: config.version,
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * Set up MCP protocol handlers
   */
  private setupHandlers(): void {
    // List available tools (capabilities)
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.config.capabilities.map(capability => ({
          name: capability.name,
          description: capability.description,
          inputSchema: capability.inputSchema,
        })),
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const capability = this.config.capabilities.find(c => c.name === request.params.name);
      if (!capability) {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }

      try {
        const validatedInput = capability.inputSchema.parse(request.params.arguments);
        const result = await capability.handler(validatedInput);
        
        return {
          content: [
            {
              type: 'text' as const,
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new Error(
          `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: this.config.resources.map(resource => ({
          uri: resource.uri,
          name: resource.name,
          description: resource.description,
          mimeType: resource.mimeType,
        })),
      };
    });

    // Handle resource reading
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const resource = this.config.resources.find(r => r.uri === request.params.uri);
      if (!resource) {
        throw new Error(`Unknown resource: ${request.params.uri}`);
      }

      const content = await resource.handler();
      return {
        contents: [
          {
            uri: request.params.uri,
            mimeType: resource.mimeType || 'text/plain',
            text: content,
          },
        ],
      };
    });

    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: this.config.prompts.map(prompt => ({
          name: prompt.name,
          description: prompt.description,
          arguments: prompt.arguments,
        })),
      };
    });

    // Handle prompt execution
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const prompt = this.config.prompts.find(p => p.name === request.params.name);
      if (!prompt) {
        throw new Error(`Unknown prompt: ${request.params.name}`);
      }

      const result = await prompt.handler(request.params.arguments || {});
      return result;
    });
  }

  /**
   * Start the MCP server with stdio transport
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error(`${this.config.name} MCP server running`);
    console.error(`Agent Role: ${this.config.agentRole}`);
    console.error(`Capabilities: ${this.config.capabilities.length}`);
    console.error(`Resources: ${this.config.resources.length}`);
    console.error(`Prompts: ${this.config.prompts.length}`);
  }

  /**
   * Add capability to agent
   */
  addCapability(capability: AgentCapability): void {
    this.config.capabilities.push(capability);
  }

  /**
   * Add resource to agent
   */
  addResource(resource: AgentResource): void {
    this.config.resources.push(resource);
  }

  /**
   * Add prompt to agent
   */
  addPrompt(prompt: AgentPrompt): void {
    this.config.prompts.push(prompt);
  }

  /**
   * Get agent configuration
   */
  getConfig(): AgentConfig {
    return { ...this.config };
  }
}

/**
 * Utility functions for agent capability development
 */
export const McpAgentUtils = {
  /**
   * Create standardized tool schema
   */
  createToolSchema: <T>(schema: z.ZodSchema<T>) => schema,

  /**
   * Create agent handoff capability
   */
  createHandoffCapability: (targetAgent: string, handoffReason: string): AgentCapability => ({
    name: `handoff_to_${targetAgent}`,
    description: `Hand off workflow to ${targetAgent} agent`,
    inputSchema: z.object({
      context: z.string().describe('Context for handoff'),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      metadata: z.record(z.any()).optional(),
    }),
    handler: async (input) => {
      return {
        action: 'handoff',
        targetAgent,
        reason: handoffReason,
        context: input.context,
        priority: input.priority || 'medium',
        metadata: input.metadata || {},
        timestamp: new Date().toISOString(),
      };
    },
  }),

  /**
   * Create decision logging capability
   */
  createDecisionCapability: (agentRole: string, frameworks: string[]): AgentCapability => ({
    name: 'log_decision',
    description: 'Log agent decision with rationale and authority level',
    inputSchema: z.object({
      decision: z.string().describe('The decision made'),
      rationale: z.string().describe('Reasoning behind the decision'),
      authorityLevel: z.enum(['owns', 'advises']).describe('Decision authority level'),
      framework: z.string().describe('Framework or standard applied'),
      impact: z.enum(['low', 'medium', 'high']).describe('Impact level'),
    }),
    handler: async (input) => {
      return {
        agentRole,
        decision: input.decision,
        rationale: input.rationale,
        authorityLevel: input.authorityLevel,
        framework: input.framework,
        impact: input.impact,
        frameworks: frameworks,
        timestamp: new Date().toISOString(),
      };
    },
  }),

  /**
   * Create status reporting capability
   */
  createStatusCapability: (agentRole: string): AgentCapability => ({
    name: 'report_status',
    description: 'Report current agent status and progress',
    inputSchema: z.object({
      task: z.string().describe('Current task'),
      progress: z.number().min(0).max(100).describe('Progress percentage'),
      blockers: z.array(z.string()).optional().describe('Current blockers'),
      nextSteps: z.array(z.string()).optional().describe('Planned next steps'),
    }),
    handler: async (input) => {
      return {
        agentRole,
        task: input.task,
        progress: input.progress,
        blockers: input.blockers || [],
        nextSteps: input.nextSteps || [],
        timestamp: new Date().toISOString(),
        status: input.progress >= 100 ? 'completed' : 'in_progress',
      };
    },
  }),

  /**
   * Create workflow coordination resource
   */
  createWorkflowResource: (agentRole: string, workflows: string[]): AgentResource => ({
    uri: `workflow://${agentRole}/coordination`,
    name: `${agentRole} Workflow Coordination`,
    description: `Workflow coordination patterns and handoff protocols for ${agentRole}`,
    mimeType: 'application/json',
    handler: async () => {
      return JSON.stringify({
        agentRole,
        workflows,
        handoffPatterns: {
          sequential: 'Standard workflow sequence',
          parallel: 'Concurrent execution patterns',
          escalation: 'Escalation to higher authority',
        },
        communicationProtocols: {
          request: 'Direct task requests',
          notification: 'Status updates',
          handoff: 'Workflow transitions',
        },
      }, null, 2);
    },
  }),
};

/**
 * Agent role-specific configuration templates
 */
export const AgentTemplates = {
  'technical-enablement': {
    frameworks: ['MCP Standards', 'DevOps', 'Platform Engineering'],
    decisionAuthority: ['tool selection', 'environment configuration', 'automation strategy'],
    capabilities: ['tool-provisioning', 'mcp-integration', 'environment-management'],
  },
  'architect-engineer': {
    frameworks: ['System Design', 'Database Architecture', 'API Design'],
    decisionAuthority: ['architecture decisions', 'technology stack', 'implementation strategy'],
    capabilities: ['system-architecture', 'technical-implementation', 'configuration-optimization'],
  },
  'standup-facilitator': {
    frameworks: ['Agile', 'Scrum', 'Meeting facilitation'],
    decisionAuthority: ['workflow coordination', 'handoff protocols', 'timeline management'],
    capabilities: ['cross-agent-coordination', 'workflow-orchestration', 'status-synthesis'],
  },
  'tester-reviewer': {
    frameworks: ['IEEE 829', 'ISTQB', 'ISO 25010'],
    decisionAuthority: ['testing strategy', 'quality gates', 'standards compliance'],
    capabilities: ['quality-validation', 'testing-strategy', 'standards-compliance'],
  },
  'optimizer-watchdog': {
    frameworks: ['ITIL', 'DevOps', 'SRE'],
    decisionAuthority: ['performance optimization', 'risk assessment', 'deployment approval'],
    capabilities: ['performance-optimization', 'risk-management', 'security-assessment'],
  },
  'morale-catalyst': {
    frameworks: ['Team Psychology', 'Conflict Resolution', 'Process Improvement'],
    decisionAuthority: ['team intervention', 'process escalation', 'workflow adjustment'],
    capabilities: ['team-health-monitoring', 'intervention-authority', 'loop-detection'],
  },
  'scrum-knowledge': {
    frameworks: ['Agile', 'PMBOK', 'Knowledge Management'],
    decisionAuthority: ['documentation strategy', 'knowledge organization', 'workflow documentation'],
    capabilities: ['documentation-compilation', 'knowledge-management', 'workflow-coordination'],
  },
};