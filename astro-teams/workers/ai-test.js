/**
 * Cloudflare AI Models Test Worker
 * Test 2025 AI models locally via Wrangler dev
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS for local development
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (path === '/test-embedding') {
        return await testEmbedding(request, env, corsHeaders);
      } else if (path === '/test-reasoning') {
        return await testReasoning(request, env, corsHeaders);
      } else if (path === '/test-reranker') {
        return await testReranker(request, env, corsHeaders);
      } else if (path === '/analyze-file') {
        return await analyzeFile(request, env, corsHeaders);
      } else if (path === '/query-vectorize') {
        return await queryVectorize(request, env, corsHeaders);
      } else if (path === '/api/models') {
        return await getAvailableModels(request, env, corsHeaders);
      } else if (path === '/populate-vectorize') {
        return await populateVectorize(request, env, corsHeaders);
      } else if (path === '/rag-query') {
        return await ragQuery(request, env, corsHeaders);
      } else {
        return new Response(getApiDocs(), {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};

async function testEmbedding(request, env, corsHeaders) {
  const { text = "AI agent system component for workflow management" } = await request.json().catch(() => ({}));
  
  console.log('🔮 Testing BGE-M3 embedding model...');
  
  const response = await env.AI.run('@cf/baai/bge-m3', {
    text: [text],
    task: 'retrieval'
  });

  return new Response(JSON.stringify({
    model: '@cf/baai/bge-m3',
    input: text,
    embedding_dimensions: response.data[0].length,
    first_10_values: response.data[0].slice(0, 10),
    success: true
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function testReasoning(request, env, corsHeaders) {
  const { 
    prompt = "Analyze this TypeScript file and suggest optimizations",
    content = "export interface AgentRole { name: string; capabilities: string[]; }"
  } = await request.json().catch(() => ({}));
  
  console.log('🧠 Testing Llama-3.1-8B reasoning model...');
  
  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      {
        role: "system",
        content: "You are an expert code analyzer. Provide concise, actionable insights."
      },
      {
        role: "user", 
        content: `${prompt}\n\nCode:\n${content}`
      }
    ]
  });

  return new Response(JSON.stringify({
    model: '@cf/meta/llama-3.1-8b-instruct',
    prompt,
    analysis: response.response,
    success: true
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function testReranker(request, env, corsHeaders) {
  const { 
    query = "agent system files",
    documents = [
      "Agent role definition for workflow management",
      "TypeScript configuration file", 
      "AI agent system component implementation"
    ]
  } = await request.json().catch(() => ({}));
  
  console.log('📊 Testing BGE reranker model...');
  
  const response = await env.AI.run('@cf/baai/bge-reranker-base', {
    query,
    contexts: documents
  });

  return new Response(JSON.stringify({
    model: '@cf/baai/bge-reranker-base',
    query,
    ranked_results: response.data.map((score, index) => ({
      document: documents[index],
      relevance_score: score,
      rank: index + 1
    })).sort((a, b) => b.relevance_score - a.relevance_score),
    success: true
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function analyzeFile(request, env, corsHeaders) {
  const { filePath, content } = await request.json();
  
  console.log(`🔍 Analyzing file: ${filePath}`);
  
  // Generate embedding
  const embeddingResponse = await env.AI.run('@cf/baai/bge-m3', {
    text: [`${filePath} ${content.substring(0, 1000)}`],
    task: 'retrieval'
  });
  
  // Get AI analysis
  const analysisResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      {
        role: "system",
        content: "Analyze this file and provide: category, importance (critical/high/medium/low), complexity (high/medium/low), quality score (0-100), and 3 optimization suggestions."
      },
      {
        role: "user",
        content: `File: ${filePath}\n\nContent:\n${content.substring(0, 2000)}`
      }
    ]
  });

  return new Response(JSON.stringify({
    filePath,
    embedding: embeddingResponse.data[0],
    analysis: analysisResponse.response,
    success: true
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function queryVectorize(request, env, corsHeaders) {
  const { 
    query = "agent system implementation",
    topK = 5,
    filter = null
  } = await request.json().catch(() => ({}));
  
  console.log(`🔍 Searching vectorize for: ${query}`);
  
  // Generate query embedding
  const embeddingResponse = await env.AI.run('@cf/baai/bge-m3', {
    text: [query],
    task: 'retrieval'
  });
  
  // Search vectorize
  const searchParams = {
    vector: embeddingResponse.data[0],
    topK,
    returnMetadata: true
  };
  
  if (filter) {
    searchParams.filter = filter;
  }
  
  const vectorResponse = await env.VECTORIZE.query(searchParams);
  
  return new Response(JSON.stringify({
    query,
    results: vectorResponse.matches,
    count: vectorResponse.count,
    success: true
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function getAvailableModels(request, env, corsHeaders) {
  // Return list of available Cloudflare AI models
  const models = [
    {
      name: '@cf/meta/llama-3.1-8b-instruct',
      description: 'Advanced reasoning and code generation with 8B parameters',
      type: 'text-generation',
      provider: 'cloudflare'
    },
    {
      name: '@cf/baai/bge-base-en-v1.5',
      description: '768-dimensional embeddings for semantic search',
      type: 'embedding',
      provider: 'cloudflare'
    },
    {
      name: '@cf/baai/bge-reranker-base',
      description: 'Reranks search results for better accuracy',
      type: 'reranker', 
      provider: 'cloudflare'
    },
    {
      name: '@cf/microsoft/phi-2',
      description: 'Efficient 2.7B parameter model for quick tasks',
      type: 'text-generation',
      provider: 'cloudflare'
    }
  ];

  return new Response(JSON.stringify({
    models,
    count: models.length,
    provider: 'cloudflare-ai',
    status: 'available'
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function populateVectorize(request, env, corsHeaders) {
  try {
    const { vectors } = await request.json();
    
    if (!vectors || !Array.isArray(vectors)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid vectors array' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Insert vectors into Vectorize
    const insertResult = await env.VECTORIZE.upsert(vectors);
    
    return new Response(JSON.stringify({
      success: true,
      inserted: insertResult.count || vectors.length,
      message: `Successfully inserted ${vectors.length} vectors`
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

async function ragQuery(request, env, corsHeaders) {
  try {
    const { query, limit = 5, filter = {} } = await request.json();
    
    if (!query) {
      return new Response(JSON.stringify({ 
        error: 'Query is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Generate embedding for query using BGE model
    const queryEmbeddingResponse = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [query]
    });

    const queryEmbedding = queryEmbeddingResponse.data[0];

    // Search Vectorize index
    const searchResults = await env.VECTORIZE.query(queryEmbedding, {
      topK: limit,
      filter,
      returnMetadata: true,
      returnValues: false
    });

    // Generate AI-powered response using the context
    const contextTexts = searchResults.matches.map(match => 
      `${match.metadata.title}: ${match.metadata.content}`
    ).join('\n\n');

    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for the Aurorion Teams project. Use the following context to answer questions accurately and helpfully. If the context doesn't contain enough information, say so.

Context from project documentation:
${contextTexts}`
        },
        {
          role: 'user',
          content: query
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    return new Response(JSON.stringify({
      query,
      answer: aiResponse.response,
      sources: searchResults.matches.map(match => ({
        title: match.metadata.title,
        category: match.metadata.category,
        similarity: match.score,
        filePath: match.metadata.filePath
      })),
      context_used: searchResults.matches.length
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      query: request.query || 'unknown'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

function getApiDocs() {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>🤖 Cloudflare AI Models Test Suite</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .method { color: #0066cc; font-weight: bold; }
        pre { background: #eee; padding: 10px; border-radius: 4px; overflow-x: auto; }
        button { background: #0066cc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin: 5px; }
        button:hover { background: #0052a3; }
        #results { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px; min-height: 100px; }
    </style>
</head>
<body>
    <h1>🤖 Cloudflare AI Models Test Suite</h1>
    <p>Local development environment for testing 2025 AI models via Wrangler dev</p>
    
    <div class="endpoint">
        <h3><span class="method">POST</span> /test-embedding</h3>
        <p>Test BGE-M3 embedding model (768 dimensions)</p>
        <button onclick="testEmbedding()">Test Embedding</button>
        <pre>{ "text": "AI agent system component" }</pre>
    </div>
    
    <div class="endpoint">
        <h3><span class="method">POST</span> /test-reasoning</h3>
        <p>Test Llama-4-Scout reasoning model</p>
        <button onclick="testReasoning()">Test Reasoning</button>
        <pre>{ "prompt": "Analyze this code", "content": "export class Agent {}" }</pre>
    </div>
    
    <div class="endpoint">
        <h3><span class="method">POST</span> /test-reranker</h3>
        <p>Test BGE reranker model</p>
        <button onclick="testReranker()">Test Reranker</button>
        <pre>{ "query": "agent files", "documents": ["agent.ts", "config.json"] }</pre>
    </div>
    
    <div class="endpoint">
        <h3><span class="method">POST</span> /analyze-file</h3>
        <p>Complete file analysis with AI</p>
        <button onclick="analyzeFile()">Analyze File</button>
        <pre>{ "filePath": "src/agent.ts", "content": "export class Agent..." }</pre>
    </div>
    
    <div class="endpoint">
        <h3><span class="method">POST</span> /query-vectorize</h3>
        <p>Query vector database with AI embedding</p>
        <button onclick="queryVectorize()">Query Vectorize</button>
        <pre>{ "query": "agent system", "topK": 5, "filter": {"category": "agent-system"} }</pre>
    </div>
    
    <div id="results">
        <h3>Results will appear here...</h3>
    </div>

    <script>
        async function makeRequest(endpoint, data = {}) {
            const results = document.getElementById('results');
            results.innerHTML = '<h3>🔄 Processing...</h3>';
            
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                results.innerHTML = '<h3>✅ Results:</h3><pre>' + JSON.stringify(result, null, 2) + '</pre>';
            } catch (error) {
                results.innerHTML = '<h3>❌ Error:</h3><pre>' + error.message + '</pre>';
            }
        }
        
        function testEmbedding() {
            makeRequest('/test-embedding', { text: 'AI agent system component for workflow management' });
        }
        
        function testReasoning() {
            makeRequest('/test-reasoning', { 
                prompt: 'Analyze this TypeScript file and suggest optimizations',
                content: 'export interface AgentRole { name: string; capabilities: string[]; }'
            });
        }
        
        function testReranker() {
            makeRequest('/test-reranker', {
                query: 'agent system files',
                documents: [
                    'Agent role definition for workflow management',
                    'TypeScript configuration file',
                    'AI agent system component implementation'
                ]
            });
        }
        
        function analyzeFile() {
            makeRequest('/analyze-file', {
                filePath: 'src/types/index.ts',
                content: 'export interface AgentRole { name: string; capabilities: string[]; decisions: string[]; }'
            });
        }
        
        function queryVectorize() {
            makeRequest('/query-vectorize', {
                query: 'agent system implementation',
                topK: 3,
                filter: { category: 'agent-system' }
            });
        }
    </script>
</body>
</html>`;
}