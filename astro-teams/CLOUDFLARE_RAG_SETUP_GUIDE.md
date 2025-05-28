# Cloudflare RAG System Setup Guide
*Intelligent Document Organization & MCP Agent Integration*

## 🎯 Overview

This guide shows how to set up and use the Cloudflare RAG (Retrieval-Augmented Generation) system that will:

1. **Automatically organize** all your project documentation using AI
2. **Create intelligent embeddings** using Cloudflare AI models
3. **Enable semantic search** across all documentation
4. **Power MCP agents** for automated workflow assistance
5. **Provide AI-powered answers** to project questions

## 🚀 Quick Start

### 1. Start the Cloudflare AI Worker
```bash
# In terminal 1: Start the AI worker
cd workers/
wrangler dev --port 8788 --local

# This provides the AI models and RAG endpoints
```

### 2. Set Up the RAG System
```bash
# In terminal 2: Set up RAG with all your documentation
npm run rag:setup

# This will:
# - Discover all .md/.mdx files in your project
# - Generate AI embeddings for each document
# - Populate the Vectorize index
# - Create agent configurations
```

### 3. Test the System
```bash
# Test RAG functionality
npm run rag:test

# This will test:
# - Basic document search
# - AI-powered Q&A
# - Agent-specific queries
# - Model availability
```

### 4. Start MCP Agent (Optional)
```bash
# Start the MCP agent for Claude integration
npm run mcp:agent

# This provides MCP tools for:
# - search_documentation
# - ask_ai_assistant  
# - get_agent_guidance
# - analyze_project_status
```

## 📊 What Gets Organized

The RAG system will automatically categorize your documents:

### Document Categories
- **`agent-system`** - Agent prompts, roles, and workflows (46 files)
- **`platform-docs`** - Cloudflare deployment, guides, platform docs
- **`architecture`** - System design, TypeScript patterns, database schemas
- **`project-management`** - Scrum docs, sprint reports, progress tracking
- **`implementation`** - Tools, testing strategies, API design
- **`project-overview`** - README files, features, project descriptions
- **`reports-analysis`** - Analysis reports, optimization results, status updates

### Agent Role Assignment
Documents are also tagged by relevant agent:
- **`architect-engineer`** - Architecture, design, TypeScript docs
- **`tester-reviewer`** - Testing strategies, quality docs
- **`optimizer-watchdog`** - Performance, optimization reports
- **`scrum-knowledge`** - Project management, workflow docs
- **`technical-enablement`** - MCP integration, tools setup
- **`morale-catalyst`** - Team docs, culture materials
- **`standup-facilitator`** - Coordination, meeting docs

## 🔍 Using the RAG System

### Direct API Queries

#### 1. Search Documentation
```bash
curl -X POST http://localhost:8788/query-vectorize \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I deploy to Cloudflare?",
    "limit": 5
  }'
```

#### 2. AI-Powered Q&A
```bash
curl -X POST http://localhost:8788/rag-query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What AI models are available and how do I use them?",
    "limit": 3
  }'
```

#### 3. Agent-Specific Search
```bash
curl -X POST http://localhost:8788/rag-query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I optimize performance?",
    "filter": {"agentRole": "optimizer-watchdog"},
    "limit": 3
  }'
```

### MCP Integration with Claude

If you have Claude Code or Claude desktop, you can add the MCP agent:

#### Add to Claude Configuration
```json
{
  "mcpServers": {
    "aurorion-rag": {
      "command": "npm",
      "args": ["run", "mcp:agent"],
      "cwd": "/path/to/aurorion/team/astro-teams"
    }
  }
}
```

#### Available MCP Tools
1. **`search_documentation`** - Semantic search across all docs
2. **`ask_ai_assistant`** - Get AI answers with source citations
3. **`get_agent_guidance`** - Consult specific agent expertise
4. **`analyze_project_status`** - Get project analysis and recommendations

## 🤖 Agent Workflow Examples

### Architect-Engineer Agent Workflow
```typescript
// Ask the architect agent about system design
{
  "tool": "get_agent_guidance",
  "agent_role": "architect-engineer", 
  "task": "Design a new microservice for user management",
  "priority": "high"
}

// Result: Gets guidance from architecture docs, design patterns, and TypeScript best practices
```

### Tester-Reviewer Agent Workflow  
```typescript
// Get testing guidance
{
  "tool": "get_agent_guidance",
  "agent_role": "tester-reviewer",
  "task": "Create integration tests for the new API",
  "priority": "medium"
}

// Result: Provides testing strategies, frameworks, and quality guidelines
```

### Optimizer-Watchdog Agent Workflow
```typescript
// Analyze performance optimization opportunities
{
  "tool": "analyze_project_status",
  "focus_area": "optimization"
}

// Result: Reviews optimization reports and provides improvement recommendations
```

## 📁 File Organization Strategy

The system organizes your scattered documentation into the R2 bucket structure:

### Current State (Discovered)
```
Your project currently has ~55+ documentation files scattered across:
- Root level: README.md, FEATURES.md, PROJECT_OVERVIEW.md, etc.
- /src/content/docs/: Organized docs structure
- /scripts/: Script documentation  
- Various analysis reports and guides
```

### Organized State (After RAG)
```
Documents will be:
✅ Categorized by content type and purpose
✅ Tagged with relevant agent roles
✅ Embedded for semantic search
✅ Accessible through AI-powered queries
✅ Integrated with MCP workflows
```

## 🔧 Advanced Configuration

### Custom Categories
Edit `scripts/setup-cloudflare-rag.ts` to add custom categories:

```typescript
private categoryPatterns = {
  'your-custom-category': ['pattern1', 'pattern2'],
  'agent-system': ['agent-prompts-', 'team-roles/', 'agent'],
  // ... existing patterns
};
```

### Custom Agent Roles
Add new agent roles in the same file:

```typescript
private agentRolePatterns = {
  'your-new-agent': ['keyword1', 'keyword2'],
  'architect-engineer': ['architect', 'engineer', 'architecture'],
  // ... existing patterns
};
```

### Embedding Customization
Modify embedding generation in `workers/ai-test.js`:

```javascript
// Use different model or parameters
const response = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
  text: [embeddingText],
  // Add custom parameters
});
```

## 📊 Monitoring & Analytics

### View RAG Statistics
After setup, check `RAG_AGENT_CONFIGURATION.json` for:
- Total documents processed
- Documents per agent role
- Category distribution
- Recommended workflows

### Query Performance
Monitor in Cloudflare dashboard:
- Vectorize query latency
- AI model usage
- Worker request patterns

## 🔄 Maintenance & Updates

### Re-index Documentation
```bash
# When you add new documentation
npm run rag:setup

# This will update the index with new content
```

### Test System Health
```bash
# Regular health check
npm run rag:test

# Should show all systems operational
```

### Clear and Rebuild
```bash
# If you need to start fresh
wrangler vectorize delete aurorion-project-knowledge
wrangler vectorize create aurorion-project-knowledge --dimensions=768 --metric=cosine
npm run rag:setup
```

## 🎯 Next Steps

### Immediate Actions
1. **Run the setup**: `npm run rag:setup` 
2. **Test functionality**: `npm run rag:test`
3. **Try MCP integration**: Add to Claude configuration

### Future Enhancements
1. **Automatic re-indexing** when docs change
2. **Multi-language support** for international teams  
3. **Advanced filtering** by date, priority, status
4. **Integration with GitHub** for automatic updates
5. **Custom agent workflows** for specific project needs

### MCP Workflow Integration
1. **Daily standup assistance** - Ask about project status
2. **Code review guidance** - Get architectural feedback
3. **Documentation gaps** - Find missing documentation
4. **Performance monitoring** - Regular optimization checks
5. **Project planning** - AI-assisted sprint planning

## 🚨 Troubleshooting

### Worker Not Responding
```bash
# Check worker status
wrangler dev --port 8788 --local

# Should show "Ready on http://localhost:8788"
```

### Vectorize Errors
```bash
# Check Vectorize index
wrangler vectorize list

# Should show aurorion-project-knowledge with 768 dimensions
```

### MCP Connection Issues
```bash
# Test MCP agent directly
npm run mcp:agent

# Should start without errors
```

### Empty Search Results
```bash
# Verify documents were indexed
npm run rag:test

# Check if embedding generation worked
```

This RAG system transforms your scattered documentation into an intelligent, searchable knowledge base that powers automated workflows and agent assistance, making your future project work significantly more efficient.