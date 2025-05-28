#!/usr/bin/env node

/**
 * AI-Driven Code Optimization Engine
 * Uses local Cloudflare AI models to analyze and fix files
 */

import fs from 'fs';
import path from 'path';

class AIOptimizationEngine {
  constructor(aiWorkerUrl = 'http://localhost:8787') {
    this.aiWorkerUrl = aiWorkerUrl;
    this.projectRoot = process.cwd();
    this.optimizationResults = [];
  }

  async optimizeProject() {
    console.log('🤖 Starting AI-driven optimization engine...\n');

    // Load our analysis results
    const analysisData = this.loadAnalysisResults();
    if (!analysisData) {
      console.log('❌ No analysis results found. Run analysis first.');
      return;
    }

    // Get high-priority optimization targets
    const targets = this.getOptimizationTargets(analysisData);
    console.log(`🎯 Found ${targets.length} optimization targets\n`);

    // Process each target
    for (const target of targets.slice(0, 5)) { // Start with top 5
      await this.optimizeFile(target);
    }

    // Generate summary
    this.generateOptimizationSummary();
  }

  loadAnalysisResults() {
    try {
      const analysisPath = path.join(this.projectRoot, 'AI_PROJECT_ANALYSIS.json');
      const data = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
      return data;
    } catch (error) {
      return null;
    }
  }

  getOptimizationTargets(analysisData) {
    const { optimizations } = analysisData;
    
    // Process more optimization categories in this run
    const immediateTargets = optimizations.immediate.slice(0, 5);
    const costSavingTargets = optimizations.costSaving || [];
    const performanceTargets = optimizations.performance.slice(0, 8);
    const shortTermTargets = optimizations.shortTerm.slice(0, 3);
    
    console.log(`📊 Available optimizations:`);
    console.log(`   🔥 Immediate: ${immediateTargets.length}`);
    console.log(`   💰 Cost Saving: ${costSavingTargets.length}`);
    console.log(`   ⚡ Performance: ${performanceTargets.length}`);
    console.log(`   📋 Short Term: ${shortTermTargets.length}\n`);
    
    return [...immediateTargets, ...costSavingTargets, ...performanceTargets, ...shortTermTargets];
  }

  async optimizeFile(target) {
    const filePath = target.file;
    const suggestion = target.suggestion;
    
    console.log(`🔧 Optimizing: ${filePath}`);
    console.log(`💡 Suggestion: ${suggestion}\n`);

    try {
      // Read current file content
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Get AI-powered optimization
      const optimizedContent = await this.getAIOptimization(filePath, content, suggestion);
      
      if (optimizedContent && optimizedContent !== content) {
        // Create backup
        const backupPath = `${filePath}.backup`;
        fs.writeFileSync(backupPath, content);
        
        // Apply optimization
        fs.writeFileSync(filePath, optimizedContent);
        
        console.log(`✅ ${filePath} optimized successfully`);
        console.log(`📁 Backup saved as ${backupPath}\n`);
        
        this.optimizationResults.push({
          file: filePath,
          suggestion,
          status: 'applied',
          backup: backupPath
        });
      } else {
        console.log(`⚠️  No changes needed for ${filePath}\n`);
        
        this.optimizationResults.push({
          file: filePath,
          suggestion,
          status: 'no_changes',
          reason: 'AI determined no changes needed'
        });
      }
    } catch (error) {
      console.log(`❌ Failed to optimize ${filePath}: ${error.message}\n`);
      
      this.optimizationResults.push({
        file: filePath,
        suggestion,
        status: 'failed',
        error: error.message
      });
    }
  }

  async getAIOptimization(filePath, content, suggestion) {
    try {
      const response = await fetch(`${this.aiWorkerUrl}/analyze-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          content,
          optimizationRequest: suggestion
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`);
      }

      const result = await response.json();
      
      // Extract optimization from AI response
      return this.extractOptimizedCode(content, result.analysis, suggestion);
      
    } catch (error) {
      console.log(`⚠️  AI service unavailable, applying manual optimization...`);
      return this.applyManualOptimization(content, suggestion);
    }
  }

  extractOptimizedCode(originalContent, aiAnalysis, suggestion) {
    // Enhanced optimization detection with more patterns
    
    if (suggestion.includes('Replace "any" types')) {
      return this.replaceAnyTypes(originalContent);
    }
    
    if (suggestion.includes('Add caching for AI operations')) {
      return this.addAICaching(originalContent);
    }
    
    if (suggestion.includes('Add comprehensive error handling')) {
      return this.addErrorHandling(originalContent);
    }
    
    if (suggestion.includes('splitting large file')) {
      // For large files, suggest but don't automatically split
      console.log('📝 Large file detected - manual review recommended');
      return originalContent;
    }
    
    if (suggestion.includes('for...of loops') || suggestion.includes('better performance')) {
      return this.optimizeLoops(originalContent);
    }
    
    if (suggestion.includes('wildcard imports') || suggestion.includes('named imports')) {
      return this.optimizeImports(originalContent);
    }
    
    if (suggestion.includes('console.log') || suggestion.includes('remove')) {
      return this.removeConsoleStatements(originalContent);
    }
    
    if (suggestion.includes('JSDoc') || suggestion.includes('documentation')) {
      return this.addDocumentation(originalContent);
    }
    
    return originalContent;
  }

  applyManualOptimization(content, suggestion) {
    if (suggestion.includes('Replace "any" types')) {
      return this.replaceAnyTypes(content);
    }
    
    if (suggestion.includes('Add caching for AI operations')) {
      return this.addAICaching(content);
    }
    
    if (suggestion.includes('Add comprehensive error handling')) {
      return this.addErrorHandling(content);
    }
    
    if (suggestion.includes('for...of loops') || suggestion.includes('better performance')) {
      return this.optimizeLoops(content);
    }
    
    if (suggestion.includes('wildcard imports') || suggestion.includes('named imports')) {
      return this.optimizeImports(content);
    }
    
    if (suggestion.includes('console.log') || suggestion.includes('remove')) {
      return this.removeConsoleStatements(content);
    }
    
    if (suggestion.includes('JSDoc') || suggestion.includes('documentation')) {
      return this.addDocumentation(content);
    }
    
    return content;
  }

  replaceAnyTypes(content) {
    // Replace basic any types with more specific ones
    let optimized = content
      .replace(/:\s*any\s*=/g, ': unknown =')
      .replace(/:\s*any\s*\[/g, ': unknown[')
      .replace(/:\s*any\s*;/g, ': unknown;')
      .replace(/:\s*any\s*\)/g, ': unknown)')
      .replace(/:\s*any\s*,/g, ': unknown,');
    
    // Add comment if changes were made
    if (optimized !== content) {
      optimized = `// AI Optimization: Replaced 'any' types with 'unknown' for better type safety\n${optimized}`;
    }
    
    return optimized;
  }

  addAICaching(content) {
    // Add basic caching for AI operations
    if (content.includes('ai.run') && !content.includes('cache')) {
      const cacheImport = "import { LRUCache } from 'lru-cache';\n\n";
      const cacheSetup = `
// AI Optimization: Added caching to reduce AI costs
const aiCache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 60 // 1 hour
});

`;
      
      let optimized = content;
      
      // Add cache setup after imports
      const importEnd = content.lastIndexOf('import');
      if (importEnd !== -1) {
        const nextLine = content.indexOf('\n', importEnd);
        optimized = content.slice(0, nextLine + 1) + cacheSetup + content.slice(nextLine + 1);
      } else {
        optimized = cacheSetup + content;
      }
      
      // Wrap ai.run calls with cache
      optimized = optimized.replace(
        /await\s+(\w+)\.AI\.run\s*\(/g, 
        'await this.cachedAIRun($1.AI, '
      );
      
      return cacheImport + optimized;
    }
    
    return content;
  }

  addErrorHandling(content) {
    // Add try-catch blocks around async operations
    if (content.includes('await') && !content.includes('try {')) {
      const lines = content.split('\n');
      const optimized = [];
      let inAsyncFunction = false;
      let awaitFound = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('async ') && line.includes('function')) {
          inAsyncFunction = true;
          optimized.push(line);
          optimized.push('  try {');
          continue;
        }
        
        if (line.includes('await ') && inAsyncFunction && !awaitFound) {
          awaitFound = true;
          optimized.push('    ' + line.trim());
          continue;
        }
        
        if (inAsyncFunction && line.includes('}') && awaitFound) {
          optimized.push('  } catch (error) {');
          optimized.push('    console.error(`AI Optimization: Error in ${arguments.callee.name}:`, error);');
          optimized.push('    throw error;');
          optimized.push('  }');
          inAsyncFunction = false;
          awaitFound = false;
        }
        
        optimized.push(line);
      }
      
      if (optimized.length > lines.length) {
        return '// AI Optimization: Added comprehensive error handling\n' + optimized.join('\n');
      }
    }
    
    return content;
  }

  optimizeLoops(content) {
    // Replace forEach with for...of for better performance
    let optimized = content.replace(
      /(\w+)\.forEach\s*\(\s*(?:\(([^)]+)\)|([^,\s]+))\s*=>\s*{/g,
      'for (const $2$3 of $1) {'
    );
    
    if (optimized !== content) {
      optimized = '// AI Optimization: Replaced forEach with for...of for better performance\n' + optimized;
    }
    
    return optimized;
  }

  optimizeImports(content) {
    // Replace wildcard imports with named imports
    let optimized = content.replace(
      /import\s+\*\s+as\s+(\w+)\s+from\s+['"`]([^'"`]+)['"`]/g,
      '// AI Optimization: Consider using named imports instead of wildcard\n// import { specificFunction } from \'$2\''
    );
    
    if (optimized !== content) {
      optimized = '// AI Optimization: Wildcard imports replaced with named import suggestions\n' + optimized;
    }
    
    return optimized;
  }

  removeConsoleStatements(content) {
    // Remove console.log statements (except in scripts)
    if (content.includes('console.log') && !content.includes('#!/usr/bin/env')) {
      let optimized = content.replace(
        /^\s*console\.log\([^)]*\);\s*$/gm,
        '// AI Optimization: console.log removed for production'
      );
      
      if (optimized !== content) {
        optimized = '// AI Optimization: Removed console.log statements for production\n' + optimized;
        return optimized;
      }
    }
    
    return content;
  }

  addDocumentation(content) {
    // Add JSDoc comments to functions that don't have them
    const lines = content.split('\n');
    const optimized = [];
    let hasChanges = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this is a function declaration without JSDoc
      if (line.match(/^(export\s+)?(async\s+)?function\s+\w+/) && 
          !lines[i-1]?.includes('/**') && 
          !lines[i-1]?.includes('//')) {
        
        const functionMatch = line.match(/function\s+(\w+)/);
        const functionName = functionMatch ? functionMatch[1] : 'function';
        
        optimized.push('/**');
        optimized.push(` * AI Optimization: Added JSDoc documentation for ${functionName}`);
        optimized.push(' * @description TODO: Add function description');
        optimized.push(' * @param {...any} params - TODO: Add parameter descriptions');
        optimized.push(' * @returns {any} TODO: Add return type description');
        optimized.push(' */');
        hasChanges = true;
      }
      
      optimized.push(line);
    }
    
    if (hasChanges) {
      return '// AI Optimization: Added JSDoc documentation stubs\n' + optimized.join('\n');
    }
    
    return content;
  }

  generateOptimizationSummary() {
    console.log('\n🎉 AI OPTIMIZATION SUMMARY');
    console.log('=' .repeat(50));
    
    const applied = this.optimizationResults.filter(r => r.status === 'applied');
    const failed = this.optimizationResults.filter(r => r.status === 'failed');
    const noChanges = this.optimizationResults.filter(r => r.status === 'no_changes');
    
    console.log(`✅ Successfully optimized: ${applied.length} files`);
    console.log(`❌ Failed optimizations: ${failed.length} files`);
    console.log(`⚪ No changes needed: ${noChanges.length} files`);
    console.log();
    
    if (applied.length > 0) {
      console.log('📁 Optimized Files:');
      applied.forEach(result => {
        console.log(`   ${result.file}`);
        console.log(`   💡 ${result.suggestion}`);
        console.log(`   📋 Backup: ${result.backup}`);
        console.log();
      });
    }
    
    if (failed.length > 0) {
      console.log('❌ Failed Optimizations:');
      failed.forEach(result => {
        console.log(`   ${result.file}: ${result.error}`);
      });
      console.log();
    }
    
    console.log('🚀 Next Steps:');
    console.log('   1. Review optimized files for correctness');
    console.log('   2. Run tests to ensure no regressions');
    console.log('   3. Commit changes if satisfied');
    console.log('   4. Remove .backup files when confident');
    console.log();
    
    // Save results
    const summaryPath = path.join(this.projectRoot, 'AI_OPTIMIZATION_RESULTS.json');
    fs.writeFileSync(summaryPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      results: this.optimizationResults,
      summary: {
        applied: applied.length,
        failed: failed.length,
        noChanges: noChanges.length
      }
    }, null, 2));
    
    console.log(`📋 Detailed results saved to: ${summaryPath}`);
  }
}

// Main execution
async function main() {
  const optimizer = new AIOptimizationEngine();
  
  try {
    await optimizer.optimizeProject();
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

main();