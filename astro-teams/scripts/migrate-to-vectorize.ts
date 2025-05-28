#!/usr/bin/env tsx

import { VectorizeManager, VectorizeUtils } from '../src/utils/vectorizeManager';
import type { VectorizeIndex } from '@cloudflare/workers-types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Comprehensive migration script to populate Cloudflare Vectorize 
 * with Aurorion Teams project knowledge and documentation
 */

interface MigrationData {
  agentRoles: any[];
  projectDocuments: any[];
  mcpImplementation: any[];
  databaseSchema: any[];
  workflows: any[];
  sprintProgress: any[];
}

class ProjectMigration {
  private vectorize: VectorizeManager;
  private projectRoot: string;

  constructor(vectorizeIndex: VectorizeIndex) {
    this.vectorize = new VectorizeManager(vectorizeIndex);
    this.projectRoot = path.resolve(__dirname, '..');
  }

  /**
   * Main migration execution
   */
  async executeMigration(): Promise<void> {
    console.log('🚀 Starting Aurorion Teams knowledge migration to Vectorize...');

    try {
      // Collect all project data
      const migrationData = await this.collectProjectData();

      // Migrate each category
      await this.migrateAgentRoles(migrationData.agentRoles);
      await this.migrateProjectDocuments(migrationData.projectDocuments);
      await this.migrateMcpImplementation(migrationData.mcpImplementation);
      await this.migrateDatabaseSchema(migrationData.databaseSchema);
      await this.migrateWorkflows(migrationData.workflows);
      await this.migrateSprintProgress(migrationData.sprintProgress);

      console.log('✅ Migration completed successfully!');
      console.log('📊 All project knowledge now available in vector database');

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Collect comprehensive project data for migration
   */
  private async collectProjectData(): Promise<MigrationData> {
    console.log('📋 Collecting project data...');

    const agentRoles = await this.loadAgentRoles();
    const projectDocuments = await this.loadProjectDocuments();
    const mcpImplementation = await this.loadMcpImplementation();
    const databaseSchema = await this.loadDatabaseSchema();
    const workflows = await this.loadWorkflows();
    const sprintProgress = await this.loadSprintProgress();

    return {
      agentRoles,
      projectDocuments,
      mcpImplementation,
      databaseSchema,
      workflows,
      sprintProgress
    };
  }

  /**
   * Load agent role specifications
   */
  private async loadAgentRoles(): Promise<any[]> {
    const agentRoles = [
      {
        role: 'standup-facilitator',
        capabilities: ['cross-agent coordination', 'workflow orchestration', 'status synthesis'],
        responsibilities: ['meeting facilitation', 'handoff coordination', 'progress tracking'],
        decisionAuthority: ['workflow coordination', 'handoff protocols', 'timeline management'],
        frameworks: ['Agile', 'Scrum', 'Meeting facilitation'],
        workflows: 'Coordinates daily standups, manages agent handoffs, synthesizes progress reports'
      },
      {
        role: 'architect-engineer',
        capabilities: ['system architecture', 'technical implementation', 'database design'],
        responsibilities: ['architecture decisions', 'technical implementation', 'system optimization'],
        decisionAuthority: ['architecture decisions', 'technology stack', 'implementation strategy'],
        frameworks: ['System Design', 'Database Architecture', 'API Design'],
        workflows: 'Designs system architecture, implements technical solutions, optimizes performance'
      },
      {
        role: 'tester-reviewer',
        capabilities: ['quality validation', 'testing strategy', 'standards compliance'],
        responsibilities: ['test planning', 'quality assurance', 'code review'],
        decisionAuthority: ['testing strategy', 'quality gates', 'standards compliance'],
        frameworks: ['IEEE 829', 'ISTQB', 'ISO 25010'],
        workflows: 'Plans testing strategy, validates quality, ensures standards compliance'
      },
      {
        role: 'optimizer-watchdog',
        capabilities: ['performance optimization', 'risk management', 'security assessment'],
        responsibilities: ['performance monitoring', 'risk assessment', 'optimization'],
        decisionAuthority: ['performance optimization', 'risk assessment', 'deployment approval'],
        frameworks: ['ITIL', 'DevOps', 'SRE'],
        workflows: 'Monitors performance, assesses risks, optimizes system efficiency'
      },
      {
        role: 'technical-enablement',
        capabilities: ['tool provisioning', 'MCP integration', 'environment management'],
        responsibilities: ['tool setup', 'environment configuration', 'integration support'],
        decisionAuthority: ['tool selection', 'environment configuration', 'automation strategy'],
        frameworks: ['MCP Standards', 'DevOps', 'Platform Engineering'],
        workflows: 'Provisions tools, configures environments, enables team productivity'
      },
      {
        role: 'morale-catalyst',
        capabilities: ['team health monitoring', 'intervention authority', 'loop detection'],
        responsibilities: ['team wellness', 'conflict resolution', 'process intervention'],
        decisionAuthority: ['team intervention', 'process escalation', 'workflow adjustment'],
        frameworks: ['Team Psychology', 'Conflict Resolution', 'Process Improvement'],
        workflows: 'Monitors team health, intervenes in conflicts, prevents workflow loops'
      },
      {
        role: 'scrum-knowledge',
        capabilities: ['documentation compilation', 'knowledge management', 'workflow coordination'],
        responsibilities: ['documentation', 'knowledge capture', 'process documentation'],
        decisionAuthority: ['documentation strategy', 'knowledge organization', 'workflow documentation'],
        frameworks: ['Agile', 'PMBOK', 'Knowledge Management'],
        workflows: 'Compiles documentation, manages knowledge base, coordinates workflows'
      }
    ];

    return agentRoles;
  }

  /**
   * Load project documentation
   */
  private async loadProjectDocuments(): Promise<any[]> {
    const documents = [];

    // Load main project files
    const projectFiles = [
      'PROJECT_OVERVIEW.md',
      'MCP_INTEGRATION_PLAN.md',
      'CLAUDE_WORKFLOW_PROMPTS.md',
      'workflow-schemas.json'
    ];

    for (const file of projectFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        documents.push({
          id: file.replace(/\\.[^/.]+$/, ''),
          title: file.replace(/\\.[^/.]+$/, '').replace(/_/g, ' '),
          content,
          type: file.endsWith('.json') ? 'configuration' : 'documentation',
          category: 'project-documentation'
        });
      }
    }

    // Load documentation from src/content/docs
    const docsPath = path.join(this.projectRoot, 'src/content/docs');
    if (fs.existsSync(docsPath)) {
      const docFiles = this.getMarkdownFiles(docsPath);
      for (const file of docFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const relativePath = path.relative(docsPath, file);
        documents.push({
          id: relativePath.replace(/\\.[^/.]+$/, '').replace(/\\/g, '-'),
          title: path.basename(file, path.extname(file)),
          content,
          type: 'documentation',
          category: 'team-documentation'
        });
      }
    }

    return documents;
  }

  /**
   * Load MCP implementation details
   */
  private async loadMcpImplementation(): Promise<any[]> {
    return [
      {
        phase: 'Phase 1 - Foundation',
        tasks: [
          {
            task: 'Install MCP TypeScript SDK',
            description: 'Install and configure MCP TypeScript SDK with proper dependencies',
            technicalSpecs: 'Add @modelcontextprotocol/sdk-typescript, configure TypeScript types',
            dependencies: ['@modelcontextprotocol/sdk-typescript'],
            deliverables: ['SDK integration', 'Type definitions', 'Build configuration']
          },
          {
            task: 'Create MCP Server Template',
            description: 'Create reusable MCP server template with standardized patterns',
            technicalSpecs: 'Reusable server template, agent capabilities interface, JSON-RPC patterns',
            dependencies: ['MCP SDK'],
            deliverables: ['mcp-server-template.ts', 'agent-capabilities-interface']
          },
          {
            task: 'Technical Enablement MCP Server',
            description: 'Convert Technical Enablement agent to first MCP server',
            technicalSpecs: 'Full MCP server with tool provisioning, environment management capabilities',
            dependencies: ['Server template', 'Agent role specification'],
            deliverables: ['technical-enablement-server.ts', 'Capability validation']
          }
        ]
      },
      {
        phase: 'Phase 2 - Core Agents',
        tasks: [
          {
            task: 'Architect-Engineer MCP Server',
            description: 'Convert Architect-Engineer agent to MCP server',
            technicalSpecs: 'System design capabilities, technical implementation tools',
            dependencies: ['Server template', 'Technical Enablement server'],
            deliverables: ['architect-engineer-server.ts', 'Architecture tools']
          },
          {
            task: 'Agent Communication Protocols',
            description: 'Implement standardized agent-to-agent communication',
            technicalSpecs: 'JSON-RPC message protocols, workflow handoff mechanisms',
            dependencies: ['Multiple MCP servers'],
            deliverables: ['Communication protocols', 'Message routing']
          }
        ]
      }
    ];
  }

  /**
   * Load database schema information
   */
  private async loadDatabaseSchema(): Promise<any[]> {
    const schemaPath = path.join(this.projectRoot, 'src/db/schema.ts');
    if (!fs.existsSync(schemaPath)) return [];

    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    
    return [{
      id: 'database-schema',
      title: 'Aurorion Teams Database Schema',
      content: schemaContent,
      type: 'schema',
      category: 'database-design',
      description: 'Complete database schema including user profiles, team members, projects, and activity tracking'
    }];
  }

  /**
   * Load workflow documentation
   */
  private async loadWorkflows(): Promise<any[]> {
    return [
      {
        id: 'agent-workflow-coordination',
        title: 'Agent Workflow Coordination',
        description: 'Standardized workflow patterns for multi-agent coordination',
        content: 'Sequential handoffs, decision authority patterns, loop prevention protocols',
        type: 'workflow',
        category: 'team-coordination'
      },
      {
        id: 'mcp-implementation-workflow',
        title: 'MCP Implementation Workflow',
        description: '3-phase implementation approach for MCP integration',
        content: 'Foundation setup, core agent conversion, full system deployment',
        type: 'implementation-workflow',
        category: 'mcp-implementation'
      }
    ];
  }

  /**
   * Load sprint progress data
   */
  private async loadSprintProgress(): Promise<any[]> {
    return [
      {
        id: 'comprehensive-documentation-sprint',
        title: 'Comprehensive Documentation Sprint',
        description: 'Complete project documentation and architecture analysis',
        progress: 100,
        achievements: [
          'PROJECT_OVERVIEW.md created',
          'MCP integration planning complete',
          'Database progress tracking implemented',
          'Agent workflow documentation'
        ],
        type: 'sprint-completion',
        category: 'project-progress'
      },
      {
        id: 'mcp-planning-sprint',
        title: 'MCP Integration Planning Sprint',
        description: 'Comprehensive MCP architecture design and implementation roadmap',
        progress: 10,
        achievements: [
          'MCP research complete',
          'Architecture design finalized',
          'Database integration planned',
          'Implementation roadmap created'
        ],
        type: 'sprint-planning',
        category: 'mcp-implementation'
      }
    ];
  }

  /**
   * Migrate agent roles to vector database
   */
  private async migrateAgentRoles(agentRoles: any[]): Promise<void> {
    console.log('🤖 Migrating agent roles...');

    for (const agent of agentRoles) {
      await this.vectorize.storeAgentRole({
        agentRole: agent.role,
        capabilities: agent.capabilities,
        responsibilities: agent.responsibilities,
        decisionAuthority: agent.decisionAuthority,
        frameworks: agent.frameworks,
        workflows: agent.workflows
      });
    }

    console.log(`✅ Migrated ${agentRoles.length} agent roles`);
  }

  /**
   * Migrate project documents
   */
  private async migrateProjectDocuments(documents: any[]): Promise<void> {
    console.log('📚 Migrating project documents...');

    for (const doc of documents) {
      await this.vectorize.storeProjectDocument({
        id: VectorizeUtils.createVectorId('docs', doc.type, doc.id),
        category: doc.category,
        type: doc.type,
        priority: 'high',
        title: doc.title,
        description: doc.description || `${doc.type} document`,
        content: doc.content,
        tags: ['documentation', doc.type, doc.category]
      });
    }

    console.log(`✅ Migrated ${documents.length} project documents`);
  }

  /**
   * Migrate MCP implementation data
   */
  private async migrateMcpImplementation(mcpData: any[]): Promise<void> {
    console.log('🔄 Migrating MCP implementation data...');

    for (const phase of mcpData) {
      for (const task of phase.tasks) {
        await this.vectorize.storeMcpDocumentation({
          phase: phase.phase,
          task: task.task,
          description: task.description,
          technicalSpecs: task.technicalSpecs,
          dependencies: task.dependencies,
          deliverables: task.deliverables
        });
      }
    }

    console.log('✅ Migrated MCP implementation data');
  }

  /**
   * Migrate database schema
   */
  private async migrateDatabaseSchema(schemaData: any[]): Promise<void> {
    if (schemaData.length === 0) return;

    console.log('🗄️ Migrating database schema...');

    for (const schema of schemaData) {
      await this.vectorize.storeProjectDocument({
        id: VectorizeUtils.createVectorId('database', 'schema', schema.id),
        category: schema.category,
        type: schema.type,
        priority: 'high',
        title: schema.title,
        description: schema.description,
        content: schema.content,
        tags: ['database', 'schema', 'architecture']
      });
    }

    console.log('✅ Migrated database schema');
  }

  /**
   * Migrate workflow documentation
   */
  private async migrateWorkflows(workflows: any[]): Promise<void> {
    console.log('🔄 Migrating workflows...');

    for (const workflow of workflows) {
      await this.vectorize.storeProjectDocument({
        id: VectorizeUtils.createVectorId('workflow', workflow.type, workflow.id),
        category: workflow.category,
        type: workflow.type,
        priority: 'high',
        title: workflow.title,
        description: workflow.description,
        content: workflow.content,
        tags: ['workflow', 'coordination', workflow.type]
      });
    }

    console.log(`✅ Migrated ${workflows.length} workflows`);
  }

  /**
   * Migrate sprint progress
   */
  private async migrateSprintProgress(sprints: any[]): Promise<void> {
    console.log('📊 Migrating sprint progress...');

    for (const sprint of sprints) {
      await this.vectorize.storeProjectProgress({
        projectId: 'aurorion-teams-main',
        activityType: sprint.type,
        action: sprint.title,
        description: sprint.description,
        metadata: {
          progress: sprint.progress,
          achievements: sprint.achievements,
          sprintId: sprint.id
        },
        impact: 'high'
      });
    }

    console.log(`✅ Migrated ${sprints.length} sprint records`);
  }

  /**
   * Utility: Get all markdown files recursively
   */
  private getMarkdownFiles(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.getMarkdownFiles(fullPath));
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }

    return files;
  }
}

/**
 * Migration execution function
 * This would be called from a Cloudflare Worker context
 */
export async function runProjectMigration(vectorizeIndex: VectorizeIndex): Promise<void> {
  const migration = new ProjectMigration(vectorizeIndex);
  await migration.executeMigration();
}

// Export for use in other contexts
export { ProjectMigration };