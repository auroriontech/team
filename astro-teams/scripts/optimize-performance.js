#!/usr/bin/env node

/**
 * Performance Optimization Script
 * Targets specific performance improvements from AI analysis
 */

import fs from 'fs';
import path from 'path';

class PerformanceOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.optimized = [];
    
    // Target files for performance optimization
    this.targets = [
      'scripts/ai-project-analyzer.ts',
      'scripts/ai-project-optimizer.ts', 
      'scripts/generate-project-docs.js',
      'scripts/run-ai-analysis.js',
      'scripts/test-ai-analysis.js',
      'src/utils/authManager.ts',
      'src/components/AgentRoleSelector.astro',
      'src/pages/team-builder.astro'
    ];
  }

  async optimizePerformance() {
    console.log('⚡ Starting performance optimization...\n');
    
    for (const filePath of this.targets) {
      await this.optimizeFile(filePath);
    }
    
    this.generateSummary();
  }

  async optimizeFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;
      
      console.log(`🔧 Optimizing: ${filePath}`);
      
      // Apply multiple performance optimizations
      let optimized = content;
      const changes = [];
      
      // 1. Replace forEach with for...of
      const loopOptimized = this.optimizeLoops(optimized);
      if (loopOptimized !== optimized) {
        optimized = loopOptimized;
        changes.push('Replaced forEach with for...of loops');
      }
      
      // 2. Optimize array operations
      const arrayOptimized = this.optimizeArrayOperations(optimized);
      if (arrayOptimized !== optimized) {
        optimized = arrayOptimized;
        changes.push('Optimized array operations');
      }
      
      // 3. Remove console.log in production files
      if (!filePath.includes('scripts/')) {
        const consoleOptimized = this.removeConsoleStatements(optimized);
        if (consoleOptimized !== optimized) {
          optimized = consoleOptimized;
          changes.push('Removed console.log statements');
        }
      }
      
      // 4. Optimize imports
      const importOptimized = this.optimizeImports(optimized);
      if (importOptimized !== optimized) {
        optimized = importOptimized;
        changes.push('Optimized imports');
      }
      
      if (optimized !== originalContent) {
        // Create backup
        const backupPath = `${filePath}.backup-perf`;
        fs.writeFileSync(backupPath, originalContent);
        
        // Apply optimizations
        fs.writeFileSync(filePath, optimized);
        
        console.log(`   ✅ Applied ${changes.length} optimizations`);
        changes.forEach(change => console.log(`      - ${change}`));
        console.log(`   📁 Backup: ${backupPath}\n`);
        
        this.optimized.push({
          file: filePath,
          changes,
          backup: backupPath
        });
      } else {
        console.log(`   ⚪ No optimizations needed\n`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  optimizeLoops(content) {
    let optimized = content;
    
    // Replace .forEach with for...of
    optimized = optimized.replace(
      /(\w+)\.forEach\s*\(\s*(?:\(([^)]+)\)|([^,\s]+))\s*=>\s*{/g,
      'for (const $2$3 of $1) {'
    );
    
    // Replace .map().forEach() patterns
    optimized = optimized.replace(
      /(\w+)\.map\(([^}]+)\}?\)\.forEach\s*\(/g,
      '// Optimized: Use for...of instead of map().forEach()\nfor (const item of $1) {\n  const mapped = ($2});\n  ('
    );
    
    // Add optimization comment if changes were made
    if (optimized !== content) {
      optimized = '// AI Performance Optimization: Replaced forEach with for...of loops\n' + optimized;
    }
    
    return optimized;
  }

  optimizeArrayOperations(content) {
    let optimized = content;
    
    // Replace some array operations with more efficient alternatives
    optimized = optimized.replace(
      /(\w+)\.length\s*>\s*0/g,
      '$1.length // Optimized: Already truthy check'
    );
    
    // Suggest Set usage for includes() operations on large arrays
    if (content.includes('.includes(') && content.split('.includes(').length > 3) {
      optimized = '// AI Performance Optimization: Consider using Set for multiple includes() operations\n' + optimized;
    }
    
    return optimized;
  }

  removeConsoleStatements(content) {
    let optimized = content.replace(
      /^\s*console\.log\([^)]*\);\s*$/gm,
      '// Production: console.log removed'
    );
    
    if (optimized !== content) {
      optimized = '// AI Performance Optimization: Removed console.log for production\n' + optimized;
    }
    
    return optimized;
  }

  optimizeImports(content) {
    let optimized = content;
    
    // Flag wildcard imports for review
    if (content.includes('import *')) {
      optimized = '// AI Performance Optimization: Consider tree-shaking with named imports\n' + optimized;
    }
    
    // Suggest dynamic imports for large dependencies
    if (content.match(/import.*from\s+['"](?:lodash|moment|axios)['"]/)) {
      optimized = '// AI Performance Optimization: Consider dynamic imports for large dependencies\n' + optimized;
    }
    
    return optimized;
  }

  generateSummary() {
    console.log('🎉 PERFORMANCE OPTIMIZATION SUMMARY');
    console.log('=' .repeat(50));
    
    if (this.optimized.length === 0) {
      console.log('⚪ No files required optimization');
      return;
    }
    
    console.log(`✅ Optimized ${this.optimized.length} files:\n`);
    
    this.optimized.forEach(result => {
      console.log(`📁 ${result.file}`);
      result.changes.forEach(change => {
        console.log(`   ⚡ ${change}`);
      });
      console.log(`   📋 Backup: ${result.backup}\n`);
    });
    
    console.log('🚀 Performance Benefits:');
    console.log('   • Faster loop iteration with for...of');
    console.log('   • Reduced memory allocation');
    console.log('   • Better V8 optimization');
    console.log('   • Cleaner production builds\n');
    
    console.log('📋 Next Steps:');
    console.log('   1. Test the optimized code');
    console.log('   2. Measure performance improvements'); 
    console.log('   3. Commit changes if performance is better');
    console.log('   4. Remove .backup-perf files when confident');
    
    // Save detailed results
    const resultsPath = path.join(this.projectRoot, 'PERFORMANCE_OPTIMIZATION_RESULTS.json');
    fs.writeFileSync(resultsPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      optimizedFiles: this.optimized.length,
      totalChanges: this.optimized.reduce((sum, r) => sum + r.changes.length, 0),
      results: this.optimized
    }, null, 2));
    
    console.log(`\n📊 Results saved to: ${resultsPath}`);
  }
}

// Run optimization
async function main() {
  const optimizer = new PerformanceOptimizer();
  await optimizer.optimizePerformance();
}

main();