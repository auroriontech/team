#!/usr/bin/env node

/**
 * Comprehensive AI Project Analysis
 * Analyzes entire project structure and generates optimization recommendations
 */

import fs from 'fs';
import path from 'path';

class ComprehensiveProjectAnalyzer {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.analysisResults = [];
    this.ignorePaths = [
      'node_modules', '.git', 'dist', 'build', '.next', 
      'coverage', 'logs', 'test-results', 'playwright-report'
    ];
  }

  async analyzeProject() {
    console.log('🤖 Starting comprehensive AI project analysis...\n');

    // Step 1: Discover files
    const files = this.discoverFiles();
    console.log(`📁 Discovered ${files.length} files to analyze\n`);

    // Step 2: Analyze each file
    console.log('🔍 Analyzing files...');
    files.forEach((file, index) => {
      const analysis = this.analyzeFile(file);
      if (analysis) {
        this.analysisResults.push(analysis);
      }
      if ((index + 1) % 10 === 0) {
        console.log(`   Analyzed ${index + 1}/${files.length} files`);
      }
    });

    console.log(`✅ Analysis complete! Processed ${this.analysisResults.length} files\n`);

    // Step 3: Generate insights
    const insights = this.generateProjectInsights();
    
    // Step 4: Create optimization recommendations
    const optimizations = this.generateOptimizations();

    // Step 5: Export results
    await this.exportResults(insights, optimizations);

    // Step 6: Print summary
    this.printComprehensiveSummary(insights, optimizations);

    return { insights, optimizations };
  }

  discoverFiles() {
    const files = [];
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.astro', '.md', '.mdx', '.json', '.toml'];
    
    const walkDir = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          
          if (this.shouldIgnore(item, fullPath)) continue;
          
          try {
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
              walkDir(fullPath);
            } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
              files.push(fullPath);
            }
          } catch (error) {
            // Skip files we can't access
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };

    walkDir(this.projectRoot);
    return files;
  }

  shouldIgnore(item, fullPath) {
    return this.ignorePaths.some(ignorePath => 
      item === ignorePath || fullPath.includes(`/${ignorePath}/`)
    );
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(this.projectRoot, filePath);
      const stats = fs.statSync(filePath);

      // Comprehensive file analysis
      const analysis = this.comprehensiveAnalysis(relativePath, content, stats);

      return {
        path: relativePath,
        size: stats.size,
        modified: stats.mtime,
        ...analysis
      };
    } catch (error) {
      return null;
    }
  }

  comprehensiveAnalysis(filePath, content, stats) {
    const ext = path.extname(filePath);
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath, ext);

    // Enhanced type detection
    const type = this.detectFileType(ext, content, filePath);
    
    // Enhanced category detection
    const category = this.detectCategory(dir, content, filePath, type);
    
    // Purpose detection
    const purpose = this.detectPurpose(filePath, content, category, type);
    
    // Complexity analysis
    const complexity = this.analyzeComplexity(content, type);
    
    // Importance assessment
    const importance = this.assessImportance(filePath, content, category, type);
    
    // Relationship mapping
    const relationships = this.mapRelationships(content, type);
    
    // Quality assessment
    const quality = this.assessQuality(content, type, filePath);
    
    // Optimization opportunities
    const optimizations = this.findOptimizations(content, type, category, filePath);

    return {
      type,
      category,
      purpose,
      complexity,
      importance,
      relationships,
      quality,
      optimizations,
      lines: content.split('\n').length,
      chars: content.length
    };
  }

  detectFileType(ext, content, filePath) {
    const typeMap = {
      '.ts': 'typescript',
      '.tsx': 'typescript-react',
      '.js': 'javascript', 
      '.jsx': 'javascript-react',
      '.astro': 'astro-component',
      '.md': 'markdown',
      '.mdx': 'mdx-documentation',
      '.json': 'json-config',
      '.toml': 'toml-config'
    };

    let baseType = typeMap[ext] || 'unknown';

    // Enhanced detection based on content
    if (content.includes('#!/usr/bin/env')) baseType = 'script';
    if (content.includes('import type') || content.includes('interface ')) baseType = 'typescript-definitions';
    if (content.includes('export default async function')) baseType = 'astro-endpoint';
    if (filePath.includes('test') || filePath.includes('spec')) baseType = baseType + '-test';

    return baseType;
  }

  detectCategory(dir, content, filePath, type) {
    // Enhanced category detection with AI-like reasoning
    const categoryMap = {
      'src/components': 'ui-components',
      'src/pages/api': 'api-endpoints',
      'src/pages': 'application-pages',
      'src/utils': 'utility-functions',
      'src/mcp': 'mcp-implementation',
      'src/ai': 'ai-infrastructure',
      'scripts': 'automation-scripts',
      'docs': 'documentation',
      'tests': 'testing'
    };

    // Check directory-based categorization
    for (const [dirPattern, category] of Object.entries(categoryMap)) {
      if (dir.includes(dirPattern)) {
        return category;
      }
    }

    // Content-based categorization (AI-like reasoning)
    if (content.includes('agent') || content.includes('mcp') || content.includes('Agent')) {
      return 'agent-system';
    }
    
    if (content.includes('vector') || content.includes('embedding') || content.includes('ai.run')) {
      return 'ai-infrastructure';
    }
    
    if (content.includes('test(') || content.includes('describe(') || content.includes('it(')) {
      return 'testing';
    }
    
    if (type.includes('config') || filePath === 'package.json' || filePath === 'wrangler.toml') {
      return 'configuration';
    }
    
    if (type.includes('markdown') || type.includes('mdx')) {
      return 'documentation';
    }

    return 'miscellaneous';
  }

  detectPurpose(filePath, content, category, type) {
    // AI-like purpose detection
    const purposeMap = {
      'ui-components': 'User interface component for application display',
      'api-endpoints': 'Server-side API endpoint for application functionality',
      'application-pages': 'Application page providing user interface',
      'utility-functions': 'Utility functions and helper methods',
      'mcp-implementation': 'Model Context Protocol implementation for agent communication',
      'ai-infrastructure': 'AI infrastructure for embeddings and intelligent processing',
      'agent-system': 'AI agent system component for workflow management',
      'automation-scripts': 'Automation script for development and deployment',
      'documentation': 'Project documentation and guides',
      'testing': 'Test files for quality assurance',
      'configuration': 'Configuration file for system setup'
    };

    let basePurpose = purposeMap[category] || 'General project file';

    // Enhanced purpose detection based on specific content
    if (content.includes('export default') && type.includes('typescript')) {
      basePurpose += ' with default export functionality';
    }
    
    if (content.includes('async') && content.includes('await')) {
      basePurpose += ' using asynchronous operations';
    }
    
    if (content.includes('database') || content.includes('db.')) {
      basePurpose += ' with database interactions';
    }

    return basePurpose;
  }

  analyzeComplexity(content, type) {
    const lines = content.split('\n').length;
    const chars = content.length;
    
    // Calculate complexity metrics
    const functions = (content.match(/function|=>/g) || []).length;
    const imports = (content.match(/import|require/g) || []).length;
    const conditionals = (content.match(/if|for|while|switch/g) || []).length;
    const asyncOps = (content.match(/async|await|Promise/g) || []).length;
    
    // Complexity scoring algorithm
    let complexityScore = 0;
    complexityScore += lines / 50; // Line count factor
    complexityScore += functions / 3; // Function density
    complexityScore += imports / 5; // Import density
    complexityScore += conditionals / 2; // Logic complexity
    complexityScore += asyncOps / 2; // Async complexity
    
    if (type.includes('typescript')) complexityScore *= 0.9; // TypeScript is more structured
    if (type.includes('config')) complexityScore *= 0.5; // Config files are simpler
    
    if (complexityScore < 3) return 'low';
    if (complexityScore < 8) return 'medium';
    return 'high';
  }

  assessImportance(filePath, content, category, type) {
    // AI-like importance assessment
    let importanceScore = 0;
    
    // Critical system files
    if (['package.json', 'wrangler.toml', 'astro.config.mjs'].includes(path.basename(filePath))) {
      return 'critical';
    }
    
    // Category-based importance
    const categoryImportance = {
      'agent-system': 4,
      'mcp-implementation': 4,
      'ai-infrastructure': 3,
      'api-endpoints': 3,
      'configuration': 3,
      'utility-functions': 2,
      'ui-components': 2,
      'documentation': 1,
      'testing': 1
    };
    
    importanceScore += categoryImportance[category] || 1;
    
    // Content-based importance
    if (content.includes('export default')) importanceScore += 1;
    if (content.includes('main') || content.includes('index')) importanceScore += 1;
    if (content.includes('critical') || content.includes('important')) importanceScore += 1;
    if (content.length > 5000) importanceScore += 1; // Large files are often important
    
    if (importanceScore >= 5) return 'critical';
    if (importanceScore >= 3) return 'high';
    if (importanceScore >= 2) return 'medium';
    return 'low';
  }

  mapRelationships(content, type) {
    const relationships = [];
    
    // Import relationships
    const importMatches = content.match(/from\s+['"`]([^'"`]+)['"`]/g) || [];
    importMatches.forEach(match => {
      const path = match.match(/['"`]([^'"`]+)['"`]/)?.[1];
      if (path && !path.startsWith('@') && !path.startsWith('node:')) {
        relationships.push(`imports:${path}`);
      }
    });
    
    // Reference relationships
    const refs = content.match(/\w+(Manager|Service|Component|Handler|Controller)/g) || [];
    relationships.push(...refs.map(ref => `references:${ref}`));
    
    return [...new Set(relationships)];
  }

  assessQuality(content, type, filePath) {
    let qualityScore = 100; // Start with perfect score
    
    // Deductions for quality issues
    if (content.includes('any') && type.includes('typescript')) qualityScore -= 10;
    if (content.includes('console.log') && !filePath.includes('script')) qualityScore -= 5;
    if (!content.includes('//') && !content.includes('/*') && content.length > 1000) qualityScore -= 15;
    if (content.includes('TODO') || content.includes('FIXME')) qualityScore -= 10;
    if (content.includes('throw new Error') && !content.includes('try')) qualityScore -= 10;
    
    // Bonuses for good practices
    if (content.includes('interface ') && type.includes('typescript')) qualityScore += 10;
    if (content.includes('try {') && content.includes('catch')) qualityScore += 10;
    if (content.includes('/**') || content.includes('//')) qualityScore += 5;
    
    return Math.max(0, Math.min(100, qualityScore));
  }

  findOptimizations(content, type, category, filePath) {
    const optimizations = [];
    
    // Type safety optimizations
    if (content.includes('any') && type.includes('typescript')) {
      optimizations.push('Replace "any" types with specific interfaces');
    }
    
    // Performance optimizations
    if (content.includes('forEach') && content.length > 1000) {
      optimizations.push('Consider using for...of loops for better performance');
    }
    
    // AI cost optimizations
    if (content.includes('ai.run') && !content.includes('cache')) {
      optimizations.push('Add caching for AI operations to reduce costs');
    }
    
    // Error handling optimizations
    if (content.includes('await') && !content.includes('try')) {
      optimizations.push('Add comprehensive error handling for async operations');
    }
    
    // Bundle size optimizations
    if (content.includes('import *') && type.includes('typescript')) {
      optimizations.push('Use named imports instead of wildcard imports');
    }
    
    // Code organization optimizations
    if (content.length > 10000) {
      optimizations.push('Consider splitting large file into smaller modules');
    }
    
    return optimizations;
  }

  generateProjectInsights() {
    const insights = {
      overview: {
        totalFiles: this.analysisResults.length,
        totalLines: this.analysisResults.reduce((sum, file) => sum + file.lines, 0),
        totalSize: this.analysisResults.reduce((sum, file) => sum + file.size, 0)
      },
      categories: {},
      complexity: {},
      importance: {},
      quality: {
        average: Math.round(this.analysisResults.reduce((sum, file) => sum + file.quality, 0) / this.analysisResults.length),
        distribution: {}
      },
      relationships: this.analyzeRelationships(),
      issues: this.findProjectIssues()
    };

    // Group by categories, complexity, importance
    this.analysisResults.forEach(file => {
      insights.categories[file.category] = (insights.categories[file.category] || 0) + 1;
      insights.complexity[file.complexity] = (insights.complexity[file.complexity] || 0) + 1;
      insights.importance[file.importance] = (insights.importance[file.importance] || 0) + 1;
      
      const qualityRange = file.quality >= 80 ? 'excellent' : file.quality >= 60 ? 'good' : file.quality >= 40 ? 'fair' : 'poor';
      insights.quality.distribution[qualityRange] = (insights.quality.distribution[qualityRange] || 0) + 1;
    });

    return insights;
  }

  analyzeRelationships() {
    const allRelationships = this.analysisResults.flatMap(file => file.relationships);
    const relationshipCounts = {};
    
    allRelationships.forEach(rel => {
      relationshipCounts[rel] = (relationshipCounts[rel] || 0) + 1;
    });
    
    return Object.entries(relationshipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([rel, count]) => ({ relationship: rel, count }));
  }

  findProjectIssues() {
    const issues = [];
    
    // Find files with many optimization opportunities
    const problematicFiles = this.analysisResults
      .filter(file => file.optimizations.length > 3)
      .map(file => ({ path: file.path, issues: file.optimizations.length }));
    
    if (problematicFiles.length > 0) {
      issues.push(`${problematicFiles.length} files have multiple optimization opportunities`);
    }
    
    // Find quality issues
    const lowQualityFiles = this.analysisResults.filter(file => file.quality < 60);
    if (lowQualityFiles.length > 0) {
      issues.push(`${lowQualityFiles.length} files have quality scores below 60%`);
    }
    
    // Find complexity issues
    const highComplexityFiles = this.analysisResults.filter(file => file.complexity === 'high');
    if (highComplexityFiles.length > 0) {
      issues.push(`${highComplexityFiles.length} files are highly complex and may need refactoring`);
    }
    
    return issues;
  }

  generateOptimizations() {
    const optimizations = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      costSaving: [],
      performance: []
    };

    // Collect all optimizations and categorize them
    this.analysisResults.forEach(file => {
      file.optimizations.forEach(opt => {
        const optimization = {
          file: file.path,
          suggestion: opt,
          priority: this.categorizePriority(opt, file.importance),
          category: this.categorizeOptimization(opt)
        };

        if (opt.includes('cost') || opt.includes('AI')) {
          optimizations.costSaving.push(optimization);
        } else if (opt.includes('performance') || opt.includes('for...of')) {
          optimizations.performance.push(optimization);
        } else if (file.importance === 'critical' || opt.includes('error')) {
          optimizations.immediate.push(optimization);
        } else if (opt.includes('types') || opt.includes('interface')) {
          optimizations.shortTerm.push(optimization);
        } else {
          optimizations.longTerm.push(optimization);
        }
      });
    });

    return optimizations;
  }

  categorizePriority(optimization, fileImportance) {
    if (fileImportance === 'critical') return 'high';
    if (optimization.includes('error') || optimization.includes('cost')) return 'high';
    if (optimization.includes('performance') || optimization.includes('types')) return 'medium';
    return 'low';
  }

  categorizeOptimization(optimization) {
    if (optimization.includes('cost') || optimization.includes('AI')) return 'cost-optimization';
    if (optimization.includes('performance')) return 'performance';
    if (optimization.includes('types') || optimization.includes('interface')) return 'code-quality';
    if (optimization.includes('error')) return 'reliability';
    if (optimization.includes('split') || optimization.includes('module')) return 'architecture';
    return 'general';
  }

  async exportResults(insights, optimizations) {
    console.log('📤 Exporting comprehensive analysis results...');

    // Export detailed analysis
    const analysisReport = {
      timestamp: new Date().toISOString(),
      project: 'Aurorion Teams - AI Enhanced Analysis',
      insights,
      optimizations,
      files: this.analysisResults.map(file => ({
        ...file,
        // Truncate content for export
        content: undefined
      }))
    };

    fs.writeFileSync(
      path.join(this.projectRoot, 'AI_PROJECT_ANALYSIS.json'),
      JSON.stringify(analysisReport, null, 2)
    );

    // Export embeddings data for vector database
    const embeddings = this.analysisResults.map(file => ({
      id: `file-${file.path.replace(/[^a-zA-Z0-9]/g, '-')}`,
      values: this.generateMockEmbedding(`${file.path} ${file.purpose} ${file.category}`),
      metadata: {
        path: file.path,
        category: file.category,
        type: file.type,
        purpose: file.purpose,
        importance: file.importance,
        complexity: file.complexity,
        quality: file.quality,
        size: file.size,
        lines: file.lines
      }
    }));

    fs.writeFileSync(
      path.join(this.projectRoot, 'ai-embeddings.ndjson'),
      embeddings.map(e => JSON.stringify(e)).join('\n')
    );

    // Export human-readable report
    const markdownReport = this.generateMarkdownReport(insights, optimizations);
    fs.writeFileSync(
      path.join(this.projectRoot, 'AI_ANALYSIS_REPORT.md'),
      markdownReport
    );

    console.log('✅ Results exported to:');
    console.log('   📊 AI_PROJECT_ANALYSIS.json');
    console.log('   🔮 ai-embeddings.ndjson');
    console.log('   📋 AI_ANALYSIS_REPORT.md\n');
  }

  generateMockEmbedding(text) {
    // Generate deterministic mock embedding for testing
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = hash % 1000;
    const embedding = [];
    
    for (let i = 0; i < 768; i++) {
      const value = Math.sin(seed + i) * Math.cos(seed + i * 2) * 0.5;
      embedding.push(value);
    }
    
    return embedding;
  }

  generateMarkdownReport(insights, optimizations) {
    return `# 🤖 AI Project Analysis Report
*Generated: ${new Date().toISOString()}*

## 📊 Project Overview
- **Total Files**: ${insights.overview.totalFiles}
- **Total Lines**: ${insights.overview.totalLines.toLocaleString()}
- **Total Size**: ${Math.round(insights.overview.totalSize / 1024)} KB
- **Average Quality**: ${insights.quality.average}%

## 📂 File Categories
${Object.entries(insights.categories).map(([cat, count]) => `- **${cat}**: ${count} files`).join('\n')}

## ⭐ Importance Distribution
${Object.entries(insights.importance).map(([level, count]) => `- **${level}**: ${count} files`).join('\n')}

## 🧠 Complexity Analysis
${Object.entries(insights.complexity).map(([level, count]) => `- **${level}**: ${count} files`).join('\n')}

## 🎯 Quality Distribution
${Object.entries(insights.quality.distribution).map(([quality, count]) => `- **${quality}**: ${count} files`).join('\n')}

## 🚨 Project Issues
${insights.issues.map(issue => `- ${issue}`).join('\n')}

## 💡 Optimization Recommendations

### Immediate Actions (${optimizations.immediate.length})
${optimizations.immediate.slice(0, 5).map(opt => `- **${opt.file}**: ${opt.suggestion}`).join('\n')}

### Cost Savings (${optimizations.costSaving.length})
${optimizations.costSaving.slice(0, 5).map(opt => `- **${opt.file}**: ${opt.suggestion}`).join('\n')}

### Performance Improvements (${optimizations.performance.length})
${optimizations.performance.slice(0, 5).map(opt => `- **${opt.file}**: ${opt.suggestion}`).join('\n')}

## 🔗 Top Relationships
${insights.relationships.slice(0, 5).map(rel => `- **${rel.relationship}**: used ${rel.count} times`).join('\n')}

---
*AI-Powered Analysis by Aurorion Teams Optimization Suite*`;
  }

  printComprehensiveSummary(insights, optimizations) {
    console.log('🎯 COMPREHENSIVE AI ANALYSIS SUMMARY');
    console.log('=' .repeat(60));
    console.log(`📁 Total Files Analyzed: ${insights.overview.totalFiles}`);
    console.log(`📏 Total Lines of Code: ${insights.overview.totalLines.toLocaleString()}`);
    console.log(`💾 Total Project Size: ${Math.round(insights.overview.totalSize / 1024)} KB`);
    console.log(`⭐ Average Quality Score: ${insights.quality.average}%`);
    console.log();

    console.log('📂 File Categories:');
    Object.entries(insights.categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} files`);
    });
    console.log();

    console.log('🧠 Complexity Distribution:');
    Object.entries(insights.complexity).forEach(([level, count]) => {
      console.log(`   ${level}: ${count} files`);
    });
    console.log();

    console.log('🚨 Key Issues Found:');
    insights.issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
    console.log();

    console.log('💡 Optimization Opportunities:');
    console.log(`   🔥 Immediate: ${optimizations.immediate.length} items`);
    console.log(`   💰 Cost Saving: ${optimizations.costSaving.length} items`);
    console.log(`   ⚡ Performance: ${optimizations.performance.length} items`);
    console.log(`   📋 Short Term: ${optimizations.shortTerm.length} items`);
    console.log(`   🎯 Long Term: ${optimizations.longTerm.length} items`);
    console.log();

    console.log('🏆 AI Analysis Highlights:');
    console.log(`   🤖 Found ${insights.categories['ai-infrastructure'] || 0} AI infrastructure files`);
    console.log(`   🎭 Found ${insights.categories['agent-system'] || 0} agent system files`);
    console.log(`   📦 Found ${insights.categories['mcp-implementation'] || 0} MCP implementation files`);
    console.log(`   ⚙️ Found ${insights.categories['api-endpoints'] || 0} API endpoints`);
    console.log();

    console.log('🎉 Analysis Complete!');
    console.log('📋 Check AI_ANALYSIS_REPORT.md for detailed recommendations');
    console.log('🔮 Ready to populate vector database with ai-embeddings.ndjson');
    console.log('🚀 Deploy to Cloudflare to enhance with real AI models!');
  }
}

// Main execution
async function main() {
  const projectRoot = process.cwd();
  const analyzer = new ComprehensiveProjectAnalyzer(projectRoot);

  try {
    await analyzer.analyzeProject();
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

main();