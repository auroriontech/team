#!/usr/bin/env node

/**
 * Simplified AI Project Analysis Test
 * Tests the core analysis logic without dependencies
 */

import fs from 'fs';
import path from 'path';

class SimpleProjectAnalyzer {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.analysisResults = [];
  }

  async analyzeProject() {
    console.log('🤖 Testing AI project analysis logic...\n');

    // Discover files
    const files = this.discoverFiles();
    console.log(`📁 Found ${files.length} files to analyze\n`);

    // Analyze each file
    files.forEach(file => {
      const analysis = this.analyzeFile(file);
      if (analysis) {
        this.analysisResults.push(analysis);
      }
    });

    // Generate summary
    const summary = this.generateSummary();
    this.printResults(summary);

    return summary;
  }

  discoverFiles() {
    const files = [];
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.astro', '.md', '.mdx', '.json'];
    
    function walkDir(dir) {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !['node_modules', '.git', 'dist'].includes(item)) {
            walkDir(fullPath);
          } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }

    walkDir(this.projectRoot);
    return files.slice(0, 20); // Limit for testing
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(this.projectRoot, filePath);
      const stats = fs.statSync(filePath);

      // Intelligent analysis
      const analysis = this.intelligentAnalysis(relativePath, content);

      return {
        path: relativePath,
        size: stats.size,
        content: content.substring(0, 500) + '...',
        ...analysis
      };
    } catch (error) {
      return null;
    }
  }

  intelligentAnalysis(filePath, content) {
    const ext = path.extname(filePath);
    const dir = path.dirname(filePath);

    // Determine type and category
    let type = 'unknown';
    let category = 'misc';
    let importance = 'medium';

    // Type detection
    if (ext === '.ts' || ext === '.tsx') type = 'typescript';
    else if (ext === '.astro') type = 'astro-component';
    else if (ext === '.md' || ext === '.mdx') type = 'documentation';
    else if (ext === '.json') type = 'configuration';

    // Category detection
    if (dir.includes('src/components')) category = 'ui-components';
    else if (dir.includes('src/pages')) category = 'pages';
    else if (dir.includes('src/utils')) category = 'utilities';
    else if (dir.includes('scripts')) category = 'automation';
    else if (content.includes('agent') || content.includes('mcp')) category = 'agent-system';
    else if (content.includes('vector') || content.includes('ai')) category = 'ai-infrastructure';
    else if (filePath.includes('.md')) category = 'documentation';

    // Importance detection
    if (filePath === 'package.json' || filePath === 'wrangler.toml') importance = 'critical';
    else if (category === 'agent-system' || category === 'ai-infrastructure') importance = 'high';
    else if (category === 'documentation') importance = 'medium';

    // Complexity analysis
    const lines = content.split('\n').length;
    const complexity = lines > 200 ? 'high' : lines > 50 ? 'medium' : 'low';

    // Generate suggestions
    const suggestions = this.generateSuggestions(filePath, content, category);

    return {
      type,
      category,
      importance,
      complexity,
      lines,
      suggestions
    };
  }

  generateSuggestions(filePath, content, category) {
    const suggestions = [];

    if (content.includes('any') && filePath.endsWith('.ts')) {
      suggestions.push('Replace "any" types with specific TypeScript interfaces');
    }

    if (content.includes('console.log') && !filePath.includes('script')) {
      suggestions.push('Remove console.log statements for production');
    }

    if (content.includes('ai.run') && !content.includes('cache')) {
      suggestions.push('Add caching for AI operations to reduce costs');
    }

    if (category === 'ai-infrastructure' && !content.includes('error')) {
      suggestions.push('Add comprehensive error handling for AI operations');
    }

    if (content.length > 5000 && category === 'utilities') {
      suggestions.push('Consider splitting large utility file into smaller modules');
    }

    return suggestions;
  }

  generateSummary() {
    const categories = {};
    const importanceLevels = {};
    const complexityLevels = {};
    const totalSuggestions = [];

    this.analysisResults.forEach(file => {
      // Count categories
      categories[file.category] = (categories[file.category] || 0) + 1;
      
      // Count importance
      importanceLevels[file.importance] = (importanceLevels[file.importance] || 0) + 1;
      
      // Count complexity
      complexityLevels[file.complexity] = (complexityLevels[file.complexity] || 0) + 1;
      
      // Collect suggestions
      totalSuggestions.push(...file.suggestions);
    });

    return {
      totalFiles: this.analysisResults.length,
      categories,
      importanceLevels,
      complexityLevels,
      totalSuggestions: totalSuggestions.length,
      topSuggestions: [...new Set(totalSuggestions)].slice(0, 5)
    };
  }

  printResults(summary) {
    console.log('📊 ANALYSIS RESULTS');
    console.log('==================');
    console.log(`📁 Total Files: ${summary.totalFiles}`);
    console.log();

    console.log('📂 Categories:');
    Object.entries(summary.categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} files`);
    });
    console.log();

    console.log('⭐ Importance Levels:');
    Object.entries(summary.importanceLevels).forEach(([level, count]) => {
      console.log(`   ${level}: ${count} files`);
    });
    console.log();

    console.log('🧠 Complexity Levels:');
    Object.entries(summary.complexityLevels).forEach(([level, count]) => {
      console.log(`   ${level}: ${count} files`);
    });
    console.log();

    console.log('💡 Top Suggestions:');
    summary.topSuggestions.forEach((suggestion, i) => {
      console.log(`   ${i + 1}. ${suggestion}`);
    });
    console.log();

    console.log('🎯 Key Insights:');
    
    // AI Infrastructure files
    const aiFiles = summary.categories['ai-infrastructure'] || 0;
    const agentFiles = summary.categories['agent-system'] || 0;
    
    if (aiFiles > 0) {
      console.log(`   - Found ${aiFiles} AI infrastructure files`);
    }
    
    if (agentFiles > 0) {
      console.log(`   - Found ${agentFiles} agent system files`);
    }

    const criticalFiles = summary.importanceLevels['critical'] || 0;
    console.log(`   - ${criticalFiles} critical configuration files identified`);

    const highComplexity = summary.complexityLevels['high'] || 0;
    if (highComplexity > 0) {
      console.log(`   - ${highComplexity} complex files may benefit from refactoring`);
    }

    console.log();
    console.log('✅ Analysis complete! This demonstrates the AI analysis capabilities.');
    console.log('🚀 Deploy to Cloudflare Workers to use real AI models for enhanced analysis.');
  }
}

// Run the test
async function main() {
  const projectRoot = process.cwd();
  const analyzer = new SimpleProjectAnalyzer(projectRoot);
  
  try {
    await analyzer.analyzeProject();
  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}

main();