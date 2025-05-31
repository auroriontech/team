# MCP Vectorize Server Setup

This document provides setup instructions for connecting Claude Code to your Cloudflare Vectorize database through a Model Context Protocol (MCP) server.

## Overview

The MCP Vectorize server provides a direct interface between Claude Code and your Cloudflare Vectorize database, enabling:

- **Semantic Search**: Search through your project documentation using natural language
- **Vector Operations**: Insert, update, and manage vector embeddings
- **AI-Powered RAG**: Retrieve relevant context for AI-powered responses
- **Batch Operations**: Efficiently manage multiple documents
- **Real-time Statistics**: Get insights into your vector database contents

## Architecture

```
Claude Code ↔ MCP Server ↔ Cloudflare Worker ↔ Vectorize Database
```

- **MCP Server** (`mcp-vectorize-server.ts`): Model Context Protocol interface for Claude Code
- **Cloudflare Worker** (`workers/vectorize-api.js`): HTTP API for vector operations
- **Vectorize Database**: Cloudflare's vector database with your project knowledge

## Quick Start

### 1. Start the Cloudflare Worker

```bash
cd astro-teams
npm run worker:vectorize
```

This starts the worker at `http://localhost:8788` with endpoints for vector operations.

### 2. Start the MCP Server

In a new terminal:

```bash
cd astro-teams
npm run mcp:vectorize
```

This starts the MCP server that Claude Code can connect to.

### 3. Configure Claude Code

Add the MCP server to your Claude Code configuration:

**For Claude Desktop:**
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "aurorion-vectorize": {
      "command": "npx",
      "args": ["tsx", "/path/to/astro-teams/mcp-vectorize-server.ts"],
      "env": {
        "VECTORIZE_WORKER_URL": "http://localhost:8788"
      }
    }
  }
}
```

**For Claude Code CLI:**
The server runs on stdio and can be connected directly.

### 4. Test the Setup

```bash
cd astro-teams
npx tsx test-mcp-vectorize.ts
```

## Available MCP Tools

Once connected, Claude Code will have access to these tools:

### Core Vector Operations

- **`search_vectors`**: Search your vector database using semantic similarity
- **`insert_vector`**: Add new documents to the database  
- **`update_vector`**: Update existing documents
- **`delete_vector`**: Remove documents (marks as deleted)
- **`batch_insert_vectors`**: Insert multiple documents efficiently

### Database Management

- **`get_vector_stats`**: Get statistics about database contents
- **`log_decision`**: Log agent decisions with rationale
- **`report_status`**: Report current status and progress

### Example Usage in Claude Code

```
Use the search_vectors tool to find documentation about "agent workflows"

Use the insert_vector tool to add this new document:
- id: "feature-auth-system"
- title: "Authentication System Design"
- content: "Detailed implementation of the auth system..."
- category: "architecture"
- type: "design-document"

Get database statistics using get_vector_stats
```

## Configuration Options

### Environment Variables

- `VECTORIZE_WORKER_URL`: Worker endpoint URL (default: `http://localhost:8788`)
- `VECTORIZE_API_TOKEN`: Optional API token for authentication

### Worker Configuration

The worker is configured in `wrangler.toml`:

```toml
[[vectorize]]
binding = "VECTORIZE"
index_name = "aurorion-project-knowledge"

[ai]
binding = "AI"
```

## API Endpoints

The Cloudflare Worker exposes these HTTP endpoints:

- `POST /query-vectorize` - Search vectors
- `POST /insert-vector` - Insert single vector
- `PUT /update-vector` - Update existing vector
- `DELETE /delete-vector` - Delete vector
- `POST /batch-insert-vectors` - Batch insert
- `GET /vector-stats` - Database statistics
- `POST /rag-query` - AI-powered search with response
- `GET /health` - Health check

## Data Schema

### Vector Metadata Structure

```typescript
{
  category: string;        // Document category (agent-system, architecture, etc.)
  type: string;           // Document type (agent-role, design-doc, etc.)
  priority: string;       // Priority level (low, medium, high)
  title: string;          // Document title
  description: string;    // Document description
  content: string;        // Document content (truncated to 1000 chars)
  timestamp: string;      // ISO timestamp
  projectId?: string;     // Associated project ID
  agentRole?: string;     // Associated agent role
  status?: string;        // Document status
  tags?: string[];        // Document tags
}
```

## Troubleshooting

### Common Issues

1. **Worker not starting**: Check that ports 8788 is available
2. **MCP connection failed**: Verify the worker is running first
3. **Vector operations fail**: Check Vectorize binding in wrangler.toml
4. **Embedding errors**: Ensure AI binding is configured

### Debug Commands

```bash
# Check worker health
curl http://localhost:8788/health

# Test vector search
curl -X POST http://localhost:8788/query-vectorize \
  -H "Content-Type: application/json" \
  -d '{"query": "test search", "limit": 5}'

# Run test suite
npx tsx test-mcp-vectorize.ts
```

### Logs

- **Worker logs**: Displayed in the terminal running `npm run worker:vectorize`
- **MCP server logs**: Displayed in the terminal running `npm run mcp:vectorize`
- **Claude Code logs**: Check Claude Code's debug output

## Security Considerations

- The MCP server runs locally and connects to your local worker
- No external network access required for basic operations
- API tokens can be configured for additional security
- All data stays within your local environment

## Performance Tips

1. **Batch Operations**: Use `batch_insert_vectors` for multiple documents
2. **Filter Searches**: Use category/type filters to narrow results
3. **Limit Results**: Set appropriate limits for search operations
4. **Monitor Stats**: Use `get_vector_stats` to monitor database size

## Integration with Existing RAG System

This MCP server complements your existing RAG system:

- **MCP Server**: Direct vector database access for Claude Code
- **RAG Agent** (`mcp-rag-agent.ts`): Documentation search and AI responses
- **Vector Manager** (`vectorizeManager.ts`): Programmatic vector operations

All three systems work together to provide comprehensive AI-powered assistance for your project.

## Next Steps

1. **Test the Connection**: Run the test script to verify everything works
2. **Populate the Database**: Use batch operations to add your documentation
3. **Explore with Claude Code**: Try different search queries and operations
4. **Monitor Usage**: Check statistics to understand how the database grows
5. **Optimize Performance**: Adjust limits and filters based on your usage patterns

For more information, see the source code documentation in:
- `mcp-vectorize-server.ts` - MCP server implementation
- `workers/vectorize-api.js` - Worker API endpoints
- `src/utils/vectorizeManager.ts` - Vector operations utility