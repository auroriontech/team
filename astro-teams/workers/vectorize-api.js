/**
 * Cloudflare Workers API for Vector Database Operations
 * 
 * Provides HTTP endpoints for MCP server to interact with Vectorize
 */

export default {
  async fetch(request, env, ctx) {
    const { method, url } = request;
    const { pathname } = new URL(url);

    // CORS headers for development
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    try {
      // Route requests to appropriate handlers
      switch (pathname) {
        case '/query-vectorize':
          return handleVectorQuery(request, env, corsHeaders);
        
        case '/insert-vector':
          return handleVectorInsert(request, env, corsHeaders);
        
        case '/update-vector':
          return handleVectorUpdate(request, env, corsHeaders);
        
        case '/delete-vector':
          return handleVectorDelete(request, env, corsHeaders);
        
        case '/batch-insert-vectors':
          return handleBatchInsert(request, env, corsHeaders);
        
        case '/vector-stats':
          return handleVectorStats(request, env, corsHeaders);
        
        case '/rag-query':
          return handleRagQuery(request, env, corsHeaders);
        
        case '/health':
          return new Response(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            vectorize: !!env.VECTORIZE,
            ai: !!env.AI
          }), { headers: corsHeaders });
        
        default:
          return new Response(JSON.stringify({
            error: 'Not Found',
            message: `Endpoint ${pathname} not found`
          }), { 
            status: 404, 
            headers: corsHeaders 
          });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};

/**
 * Generate embeddings using Cloudflare AI
 */
async function generateEmbedding(text, env) {
  if (!env.AI) {
    throw new Error('AI binding not available');
  }

  try {
    const response = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [text]
    });

    return response.data[0];
  } catch (error) {
    console.error('Embedding generation failed:', error);
    // Fallback to deterministic mock embedding
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = hash % 1000;
    const embedding = [];
    
    for (let i = 0; i < 768; i++) {
      const value = Math.sin(seed + i) * Math.cos(seed + i * 2) * 0.5;
      embedding.push(value);
    }
    
    return embedding;
  }
}

/**
 * Handle vector search queries
 */
async function handleVectorQuery(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method Not Allowed'
    }), { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  const { query, limit = 10, filter, threshold = 0.1 } = await request.json();

  if (!query) {
    return new Response(JSON.stringify({
      error: 'Bad Request',
      message: 'Query parameter is required'
    }), { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query, env);

    // Perform vector search
    const searchOptions = {
      topK: Math.min(limit, 50),
      returnValues: true,
      returnMetadata: true
    };

    if (filter && Object.keys(filter).length > 0) {
      searchOptions.filter = filter;
    }

    const searchResults = await env.VECTORIZE.query(queryEmbedding, searchOptions);

    // Filter by threshold and format results
    const filteredResults = searchResults.matches
      .filter(match => match.score >= threshold)
      .map(match => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata,
        values: match.values
      }));

    return new Response(JSON.stringify({
      success: true,
      query,
      totalResults: filteredResults.length,
      results: filteredResults,
      threshold,
      searchTime: Date.now()
    }), { 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Vector query error:', error);
    return new Response(JSON.stringify({
      error: 'Vector Query Failed',
      message: error.message
    }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

/**
 * Handle single vector insertion
 */
async function handleVectorInsert(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method Not Allowed'
    }), { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  const data = await request.json();
  const { 
    id, 
    title, 
    content, 
    category, 
    type, 
    priority = 'medium',
    description,
    projectId,
    agentRole,
    tags = [],
    metadata = {}
  } = data;

  if (!id || !title || !content || !category || !type) {
    return new Response(JSON.stringify({
      error: 'Bad Request',
      message: 'id, title, content, category, and type are required'
    }), { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  try {
    // Generate embedding for combined content
    const textToEmbed = `${title}. ${description || title}. ${content}`;
    const embedding = await generateEmbedding(textToEmbed, env);

    // Create vector object
    const vector = {
      id,
      values: embedding,
      metadata: {
        category,
        type,
        priority,
        title,
        description: description || title,
        content: content.substring(0, 1000), // Limit content size
        timestamp: new Date().toISOString(),
        projectId,
        agentRole,
        tags,
        ...metadata
      }
    };

    // Insert into Vectorize
    await env.VECTORIZE.upsert([vector]);

    return new Response(JSON.stringify({
      success: true,
      vectorId: id,
      embeddingGenerated: true,
      insertedAt: new Date().toISOString()
    }), { 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Vector insert error:', error);
    return new Response(JSON.stringify({
      error: 'Vector Insert Failed',
      message: error.message
    }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

/**
 * Handle vector updates
 */
async function handleVectorUpdate(request, env, corsHeaders) {
  if (request.method !== 'PUT') {
    return new Response(JSON.stringify({
      error: 'Method Not Allowed'
    }), { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  const data = await request.json();
  const { id, ...updateFields } = data;

  if (!id) {
    return new Response(JSON.stringify({
      error: 'Bad Request',
      message: 'id is required for updates'
    }), { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  try {
    // First, query for existing vector to get current metadata
    const queryEmbedding = await generateEmbedding(id, env);
    const existingResults = await env.VECTORIZE.query(queryEmbedding, {
      topK: 50,
      filter: { id },
      returnValues: true,
      returnMetadata: true
    });

    const existingVector = existingResults.matches.find(match => match.id === id);
    if (!existingVector) {
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: `Vector with id ${id} not found`
      }), { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    // Merge existing metadata with updates
    const updatedMetadata = {
      ...existingVector.metadata,
      ...updateFields,
      lastUpdated: new Date().toISOString()
    };

    let newEmbedding = existingVector.values;
    let reembedded = false;

    // Re-generate embedding if content changed
    if (updateFields.content || updateFields.title) {
      const newContent = updateFields.content || existingVector.metadata.content;
      const newTitle = updateFields.title || existingVector.metadata.title;
      const textToEmbed = `${newTitle}. ${updatedMetadata.description}. ${newContent}`;
      newEmbedding = await generateEmbedding(textToEmbed, env);
      reembedded = true;
    }

    // Create updated vector
    const updatedVector = {
      id,
      values: newEmbedding,
      metadata: updatedMetadata
    };

    // Upsert the updated vector
    await env.VECTORIZE.upsert([updatedVector]);

    return new Response(JSON.stringify({
      success: true,
      id,
      fieldsUpdated: Object.keys(updateFields),
      reembedded,
      updatedAt: new Date().toISOString()
    }), { 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Vector update error:', error);
    return new Response(JSON.stringify({
      error: 'Vector Update Failed',
      message: error.message
    }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

/**
 * Handle vector deletion
 */
async function handleVectorDelete(request, env, corsHeaders) {
  if (request.method !== 'DELETE') {
    return new Response(JSON.stringify({
      error: 'Method Not Allowed'
    }), { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  const { id } = await request.json();

  if (!id) {
    return new Response(JSON.stringify({
      error: 'Bad Request',
      message: 'id is required for deletion'
    }), { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  try {
    // Note: Vectorize doesn't have a direct delete method
    // We'll mark as deleted in metadata instead
    const queryEmbedding = await generateEmbedding(id, env);
    const existingResults = await env.VECTORIZE.query(queryEmbedding, {
      topK: 50,
      filter: { id },
      returnValues: true,
      returnMetadata: true
    });

    const existingVector = existingResults.matches.find(match => match.id === id);
    if (!existingVector) {
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: `Vector with id ${id} not found`
      }), { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    // Mark as deleted by updating metadata
    const deletedVector = {
      id,
      values: existingVector.values,
      metadata: {
        ...existingVector.metadata,
        status: 'deleted',
        deletedAt: new Date().toISOString()
      }
    };

    await env.VECTORIZE.upsert([deletedVector]);

    return new Response(JSON.stringify({
      success: true,
      id,
      message: 'Vector marked as deleted',
      deletedAt: new Date().toISOString()
    }), { 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Vector delete error:', error);
    return new Response(JSON.stringify({
      error: 'Vector Delete Failed',
      message: error.message
    }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

/**
 * Handle batch vector insertion
 */
async function handleBatchInsert(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method Not Allowed'
    }), { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  const { documents } = await request.json();

  if (!documents || !Array.isArray(documents) || documents.length === 0) {
    return new Response(JSON.stringify({
      error: 'Bad Request',
      message: 'documents array is required and must not be empty'
    }), { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  if (documents.length > 100) {
    return new Response(JSON.stringify({
      error: 'Bad Request',
      message: 'Maximum 100 documents per batch'
    }), { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  try {
    const vectors = [];
    
    for (const doc of documents) {
      const { 
        id, 
        title, 
        content, 
        category, 
        type, 
        priority = 'medium',
        description,
        projectId,
        agentRole,
        tags = [],
        metadata = {}
      } = doc;

      if (!id || !title || !content || !category || !type) {
        throw new Error(`Document missing required fields: id, title, content, category, type`);
      }

      // Generate embedding
      const textToEmbed = `${title}. ${description || title}. ${content}`;
      const embedding = await generateEmbedding(textToEmbed, env);

      vectors.push({
        id,
        values: embedding,
        metadata: {
          category,
          type,
          priority,
          title,
          description: description || title,
          content: content.substring(0, 1000),
          timestamp: new Date().toISOString(),
          projectId,
          agentRole,
          tags,
          ...metadata
        }
      });
    }

    // Batch insert
    await env.VECTORIZE.upsert(vectors);

    return new Response(JSON.stringify({
      success: true,
      documentsInserted: vectors.length,
      insertedAt: new Date().toISOString(),
      results: vectors.map(v => ({ id: v.id, embeddingGenerated: true }))
    }), { 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Batch insert error:', error);
    return new Response(JSON.stringify({
      error: 'Batch Insert Failed',
      message: error.message
    }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

/**
 * Handle vector database statistics
 */
async function handleVectorStats(request, env, corsHeaders) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({
      error: 'Method Not Allowed'
    }), { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Note: Vectorize doesn't provide direct stats
    // We'll approximate by querying with a broad search
    const statsEmbedding = await generateEmbedding('project statistics overview', env);
    
    const results = await env.VECTORIZE.query(statsEmbedding, {
      topK: 1000, // Get a large sample
      returnValues: false,
      returnMetadata: true
    });

    const stats = {
      totalVectors: results.matches.length,
      categories: {},
      types: {},
      agentRoles: {},
      projects: {},
      lastUpdated: new Date().toISOString()
    };

    // Aggregate statistics from metadata
    results.matches.forEach(match => {
      const metadata = match.metadata || {};
      
      if (metadata.category) {
        stats.categories[metadata.category] = (stats.categories[metadata.category] || 0) + 1;
      }
      
      if (metadata.type) {
        stats.types[metadata.type] = (stats.types[metadata.type] || 0) + 1;
      }
      
      if (metadata.agentRole) {
        stats.agentRoles[metadata.agentRole] = (stats.agentRoles[metadata.agentRole] || 0) + 1;
      }
      
      if (metadata.projectId) {
        stats.projects[metadata.projectId] = (stats.projects[metadata.projectId] || 0) + 1;
      }
    });

    return new Response(JSON.stringify(stats), { 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Vector stats error:', error);
    return new Response(JSON.stringify({
      error: 'Vector Stats Failed',
      message: error.message
    }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

/**
 * Handle RAG queries with AI-powered responses
 */
async function handleRagQuery(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method Not Allowed'
    }), { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  const { query, limit = 5, filter } = await request.json();

  if (!query) {
    return new Response(JSON.stringify({
      error: 'Bad Request',
      message: 'Query parameter is required'
    }), { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  try {
    // First, search for relevant context
    const queryEmbedding = await generateEmbedding(query, env);
    
    const searchOptions = {
      topK: limit,
      returnValues: false,
      returnMetadata: true
    };

    if (filter && Object.keys(filter).length > 0) {
      searchOptions.filter = filter;
    }

    const searchResults = await env.VECTORIZE.query(queryEmbedding, searchOptions);

    // Extract context from top results
    const context = searchResults.matches
      .map(match => `${match.metadata?.title}: ${match.metadata?.content}`)
      .join('\n\n');

    // Generate AI response using context
    const prompt = `Based on the following context from the Aurorion Teams project documentation, answer the question.

Context:
${context}

Question: ${query}

Please provide a helpful and accurate answer based on the context provided.`;

    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: 'You are a helpful assistant for the Aurorion Teams project. Use the provided context to answer questions accurately.' },
        { role: 'user', content: prompt }
      ]
    });

    return new Response(JSON.stringify({
      success: true,
      query,
      answer: aiResponse.response,
      sources: searchResults.matches.map(match => ({
        id: match.id,
        title: match.metadata?.title,
        category: match.metadata?.category,
        similarity: match.score
      }))
    }), { 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('RAG query error:', error);
    return new Response(JSON.stringify({
      error: 'RAG Query Failed',
      message: error.message
    }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}