#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';

// Generate test query vector (same function as used for embedding)
function generateTestVector(): number[] {
  const embedding = [];
  for (let i = 0; i < 768; i++) {
    embedding.push(Math.random() * 2 - 1);
  }
  return embedding;
}

console.log('🔍 Testing vector database search...');

const queryVector = generateTestVector();
const queryFile = 'test-query.json';

// Create query vector file
fs.writeFileSync(queryFile, JSON.stringify(queryVector));

try {
  // Query using file
  console.log('📋 Searching for similar vectors...');
  const result = execSync(`npx wrangler vectorize query aurorion-project-knowledge --vector-file=${queryFile} --top-k=5`, { 
    encoding: 'utf8',
    cwd: process.cwd()
  });
  
  console.log('✅ Query results:');
  console.log(result);
  
} catch (error) {
  console.error('❌ Query failed:', error);
} finally {
  // Clean up
  if (fs.existsSync(queryFile)) {
    fs.unlinkSync(queryFile);
  }
}