#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';

/**
 * Direct population of Cloudflare Vectorize with project data
 * Using wrangler CLI to insert vectors directly
 */

// Generate a simple 768-dimensional embedding (in production, use Workers AI)
function generateMockEmbedding(text: string): number[] {
  const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = hash % 1000;
  const embedding = [];
  
  for (let i = 0; i < 768; i++) {
    // Simple deterministic "embedding" based on text content
    const value = Math.sin(seed + i) * Math.cos(seed + i * 2) * 0.5;
    embedding.push(value);
  }
  
  return embedding;
}

// Agent roles data
const agentRoles = [
  {
    id: 'agent-standup-facilitator',
    text: 'Standup Facilitator: Cross-agent coordination, workflow orchestration, status synthesis. Coordinates daily standups, manages agent handoffs, synthesizes progress reports.',
    metadata: {
      category: 'agent-system',
      type: 'agent-role',
      priority: 'high',
      agentRole: 'standup-facilitator'
    }
  },
  {
    id: 'agent-architect-engineer',
    text: 'Architect Engineer: System architecture, technical implementation, database design. Designs comprehensive system architecture, implements technical solutions.',
    metadata: {
      category: 'agent-system',
      type: 'agent-role',
      priority: 'high',
      agentRole: 'architect-engineer'
    }
  },
  {
    id: 'agent-technical-enablement',
    text: 'Technical Enablement: Tool provisioning, MCP integration, environment management. MCP integration specialist ensuring team has necessary technical resources.',
    metadata: {
      category: 'agent-system',
      type: 'agent-role',
      priority: 'high',
      agentRole: 'technical-enablement'
    }
  },
  {
    id: 'agent-tester-reviewer',
    text: 'Tester Reviewer: Quality validation, testing strategy, standards compliance. Follows ISTQB and ISO 25010 standards for comprehensive testing.',
    metadata: {
      category: 'agent-system',
      type: 'agent-role',
      priority: 'high',
      agentRole: 'tester-reviewer'
    }
  },
  {
    id: 'agent-optimizer-watchdog',
    text: 'Optimizer Watchdog: Performance optimization, risk management, security assessment. Uses ITIL and DevOps best practices for system optimization.',
    metadata: {
      category: 'agent-system',
      type: 'agent-role',
      priority: 'high',
      agentRole: 'optimizer-watchdog'
    }
  },
  {
    id: 'agent-morale-catalyst',
    text: 'Morale Catalyst: Team health monitoring, intervention authority, loop detection. Team health monitor and intervention specialist with authority to break loops.',
    metadata: {
      category: 'agent-system',
      type: 'agent-role',
      priority: 'high',
      agentRole: 'morale-catalyst'
    }
  },
  {
    id: 'agent-scrum-knowledge',
    text: 'Scrum Knowledge: Documentation compilation, knowledge management, workflow coordination. Uses PMBOK and Scrum methodologies for documentation and workflow.',
    metadata: {
      category: 'agent-system',
      type: 'agent-role',
      priority: 'high',
      agentRole: 'scrum-knowledge'
    }
  }
];

// Project documentation
const projectDocs = [
  {
    id: 'project-overview',
    text: 'Aurorion Teams: Sophisticated AI agent team management platform with dynamic configuration of specialized AI agents. Built with Astro v5.8.0, TypeScript, WebAuthn authentication, Turso database, and Cloudflare deployment.',
    metadata: {
      category: 'project-documentation',
      type: 'overview',
      priority: 'high'
    }
  },
  {
    id: 'mcp-integration-plan',
    text: 'MCP Integration Plan: 6-week roadmap for converting 7-agent system to Model Context Protocol implementation with local LLM deployment and standardized agent-to-agent communication using JSON-RPC 2.0.',
    metadata: {
      category: 'mcp-implementation',
      type: 'implementation-plan',
      priority: 'high'
    }
  },
  {
    id: 'vector-database-setup',
    text: 'Cloudflare Vectorize Integration: 768-dimensional vectors with cosine similarity, metadata indexing for semantic search across project documentation, agent knowledge retrieval, and progress tracking.',
    metadata: {
      category: 'infrastructure',
      type: 'database-setup',
      priority: 'high'
    }
  }
];

// MCP implementation tasks
const mcpTasks = [
  {
    id: 'mcp-phase1-sdk',
    text: 'MCP Phase 1: Install TypeScript SDK and configure build system. Add @modelcontextprotocol/sdk-typescript dependency, configure TypeScript types, basic MCP server structure.',
    metadata: {
      category: 'mcp-implementation',
      type: 'implementation-task',
      priority: 'high',
      phase: 'phase-1'
    }
  },
  {
    id: 'mcp-phase1-template',
    text: 'MCP Phase 1: Create reusable MCP server template with standardized agent patterns. Agent capability interfaces, JSON-RPC patterns, error handling, configuration management.',
    metadata: {
      category: 'mcp-implementation',
      type: 'implementation-task',
      priority: 'high',
      phase: 'phase-1'
    }
  }
];

// Combine all data
const allVectors = [...agentRoles, ...projectDocs, ...mcpTasks];

console.log('🚀 Populating Cloudflare Vectorize with project data...');
console.log(`📊 Inserting ${allVectors.length} vectors`);

// Create vectors NDJSON file (newline-delimited JSON)
const vectorsData = allVectors.map(item => ({
  id: item.id,
  values: generateMockEmbedding(item.text),
  metadata: item.metadata
}));

const vectorsFile = 'vectors-data.ndjson';
const ndjsonContent = vectorsData.map(vector => JSON.stringify(vector)).join('\n');
fs.writeFileSync(vectorsFile, ndjsonContent);

try {
  // Insert vectors using wrangler CLI
  execSync(`npx wrangler vectorize insert aurorion-project-knowledge --file=${vectorsFile}`, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Successfully populated vector database!');
  console.log('📋 Data now available for semantic search');
  
  // Clean up
  fs.unlinkSync(vectorsFile);
  
} catch (error) {
  console.error('❌ Failed to populate vector database:', error);
  if (fs.existsSync(vectorsFile)) {
    fs.unlinkSync(vectorsFile);
  }
}