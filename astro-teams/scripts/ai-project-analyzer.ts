#!/usr/bin/env tsx

/**
 * AI-Powered Project Analyzer and Optimizer
 * 
 * This script uses AI to:
 * 1. Analyze entire project structure
 * 2. Classify and organize files intelligently
 * 3. Generate embeddings for semantic search
 * 4. Reason about improvements and optimizations
 * 5. Suggest file reorganization and enhancements
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface FileAnalysis {
  path: string;
  content: string;
  size: number;
  type: string;
  category: string;
  purpose: string;
  complexity: 'low' | 'medium' | 'high';
  importance: 'low' | 'medium' | 'high' | 'critical';
  relationships: string[];
  suggestions: string[];
  embedding: number[];
  confidence: number;
}

interface ProjectStructure {
  totalFiles: number;
  categories: Record<string, FileAnalysis[]>;
  dependencies: Record<string, string[]>;
  optimization_opportunities: string[];
  reorganization_suggestions: string[];
  efficiency_improvements: string[];
}

class AiProjectAnalyzer {
  private projectRoot: string;
  private analysisResults: FileAnalysis[] = [];
  private ignorePaths = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'coverage',
    'logs',
    '*.log',
    'test-results',
    'playwright-report'
  ];

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  /**
   * Main analysis entry point
   */
  async analyzeProject(): Promise<ProjectStructure> {
    console.log('🤖 Starting AI-powered project analysis...\n');

    // 1. Discover all relevant files
    const files = await this.discoverFiles();
    console.log(`📁 Found ${files.length} files to analyze\n`);

    // 2. Analyze each file with AI
    await this.analyzeFiles(files);

    // 3. Perform cross-file reasoning
    const structure = await this.reasonAboutProject();

    // 4. Generate optimization recommendations
    await this.generateOptimizations(structure);

    // 5. Create embeddings for vector database
    await this.generateEmbeddings();

    return structure;
  }

  /**
   * Discover all relevant project files
   */
  private async discoverFiles(): Promise<string[]> {
    const patterns = [
      '**/*.ts',
      '**/*.tsx', 
      '**/*.js',
      '**/*.jsx',
      '**/*.astro',
      '**/*.md',
      '**/*.mdx',
      '**/*.json',
      '**/*.toml',
      '**/*.yaml',
      '**/*.yml',
      'src/**/*',
      'scripts/**/*',
      'docs/**/*',
      '*.md',
      '*.json',
      'package.json',
      'wrangler.toml',
      'astro.config.*'
    ];

    const allFiles: string[] = [];
    
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: this.projectRoot,
        ignore: this.ignorePaths,
        absolute: true
      });
      allFiles.push(...matches);
    }

    // Remove duplicates and filter readable files
    const uniqueFiles = [...new Set(allFiles)];
    return uniqueFiles.filter(file => {
      try {
        const stats = fs.statSync(file);
        return stats.isFile() && stats.size < 1024 * 1024; // Skip files > 1MB
      } catch {
        return false;
      }
    });
  }

  /**
   * Analyze individual files with AI reasoning
   */
  private async analyzeFiles(files: string[]): Promise<void> {
    console.log('🔍 Analyzing files with AI...');
    
    const batchSize = 5; // Process in small batches
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      console.log(`   Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(files.length/batchSize)}...`);
      
      const batchPromises = batch.map(filePath => this.analyzeFile(filePath));
      const batchResults = await Promise.all(batchPromises);
      
      this.analysisResults.push(...batchResults.filter(r => r !== null) as FileAnalysis[]);
      
      // Small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ Analyzed ${this.analysisResults.length} files\n`);
  }

  /**
   * Analyze individual file with AI
   */
  private async analyzeFile(filePath: string): Promise<FileAnalysis | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(this.projectRoot, filePath);
      const stats = fs.statSync(filePath);

      // Use AI to analyze the file (mock implementation for now)
      const analysis = await this.aiAnalyzeFile(relativePath, content);

      return {
        path: relativePath,
        content: content.substring(0, 2000), // Limit content for embedding
        size: stats.size,
        ...analysis,
        embedding: [], // Will be generated later
        confidence: 0.85
      };
    } catch (error) {
      console.warn(`⚠️  Failed to analyze ${filePath}:`, error);
      return null;
    }
  }

  /**
   * AI analysis of file content (simulated - replace with real AI calls)
   */
  private async aiAnalyzeFile(filePath: string, content: string): Promise<Partial<FileAnalysis>> {
    // This would use Cloudflare Workers AI in production
    // For now, implementing intelligent rule-based analysis
    
    const analysis = this.intelligentFileAnalysis(filePath, content);
    
    // Add AI reasoning about the file
    const suggestions = this.generateFileSuggestions(filePath, content, analysis);
    
    return {
      ...analysis,
      suggestions
    };
  }

  /**
   * Intelligent rule-based file analysis (fallback for AI)
   */
  private intelligentFileAnalysis(filePath: string, content: string): Partial<FileAnalysis> {
    const ext = path.extname(filePath);
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath, ext);

    // Determine file type
    let type = 'unknown';
    if (ext === '.ts' || ext === '.tsx') type = 'typescript';
    else if (ext === '.js' || ext === '.jsx') type = 'javascript';
    else if (ext === '.astro') type = 'astro-component';
    else if (ext === '.md' || ext === '.mdx') type = 'documentation';
    else if (ext === '.json') type = 'configuration';
    else if (ext === '.toml') type = 'configuration';

    // Determine category based on path and content
    let category = 'misc';
    let purpose = 'Unknown purpose';

    if (dir.includes('src/components')) {
      category = 'ui-components';
      purpose = 'User interface component';
    } else if (dir.includes('src/pages')) {
      category = 'pages';
      purpose = 'Application page or route';
    } else if (dir.includes('src/utils')) {
      category = 'utilities';
      purpose = 'Utility functions and helpers';
    } else if (dir.includes('src/mcp')) {
      category = 'mcp-implementation';
      purpose = 'Model Context Protocol implementation';
    } else if (dir.includes('scripts')) {
      category = 'automation';
      purpose = 'Build and development script';
    } else if (dir.includes('docs') || filePath.endsWith('.md')) {
      category = 'documentation';
      purpose = 'Project documentation';
    } else if (dir.includes('tests') || content.includes('test') || content.includes('spec')) {
      category = 'testing';
      purpose = 'Test files and testing utilities';
    } else if (content.includes('agent') || content.includes('role')) {
      category = 'agent-system';
      purpose = 'AI agent system component';
    } else if (content.includes('vector') || content.includes('embedding')) {
      category = 'ai-infrastructure';
      purpose = 'AI infrastructure and vector operations';
    }

    // Determine complexity
    const complexity = this.analyzeComplexity(content);
    
    // Determine importance
    const importance = this.analyzeImportance(filePath, content, category);

    // Find relationships
    const relationships = this.findRelationships(content);

    return {
      type,
      category,
      purpose,
      complexity,
      importance,
      relationships
    };
  }

  /**
   * Analyze code complexity
   */
  private analyzeComplexity(content: string): 'low' | 'medium' | 'high' {
    const lines = content.split('\n').length;
    const functions = (content.match(/function|=>|async/g) || []).length;
    const imports = (content.match(/import|require/g) || []).length;
    const complexity_indicators = (content.match(/if|for|while|switch|try|catch/g) || []).length;

    const complexity_score = (lines / 100) + (functions / 5) + (imports / 10) + (complexity_indicators / 5);

    if (complexity_score < 2) return 'low';
    if (complexity_score < 5) return 'medium';
    return 'high';
  }

  /**
   * Analyze file importance
   */
  private analyzeImportance(filePath: string, content: string, category: string): 'low' | 'medium' | 'high' | 'critical' {
    // Critical files
    if (filePath === 'package.json' || 
        filePath === 'wrangler.toml' || 
        filePath.includes('astro.config') ||
        category === 'agent-system') {
      return 'critical';
    }

    // High importance
    if (category === 'mcp-implementation' ||
        category === 'ai-infrastructure' ||
        filePath.includes('src/pages/api') ||
        content.includes('export default') ||
        content.includes('main') ||
        content.includes('index')) {
      return 'high';
    }

    // Medium importance
    if (category === 'ui-components' ||
        category === 'utilities' ||
        category === 'documentation') {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Find file relationships and dependencies
   */
  private findRelationships(content: string): string[] {
    const relationships: string[] = [];
    
    // Find imports
    const importMatches = content.match(/from\s+['"`]([^'"`]+)['"`]/g) || [];
    importMatches.forEach(match => {
      const path = match.match(/['"`]([^'"`]+)['"`]/)?.[1];
      if (path && !path.startsWith('@') && !path.startsWith('node:')) {
        relationships.push(path);
      }
    });

    // Find references to other files/modules
    const referenceMatches = content.match(/\w+Manager|\w+Service|\w+Component/g) || [];
    relationships.push(...referenceMatches);

    return [...new Set(relationships)];
  }

  /**
   * Generate AI-powered suggestions for file improvements
   */
  private generateFileSuggestions(filePath: string, content: string, analysis: Partial<FileAnalysis>): string[] {
    const suggestions: string[] = [];

    // Code quality suggestions
    if (analysis.complexity === 'high') {
      suggestions.push('Consider breaking down complex functions into smaller, more manageable pieces');
    }

    if (content.length > 1000 && !content.includes('//') && !content.includes('/*')) {
      suggestions.push('Add comments to improve code documentation');
    }

    // TypeScript suggestions
    if (analysis.type === 'typescript' && content.includes('any')) {
      suggestions.push('Replace "any" types with more specific TypeScript types');
    }

    // Performance suggestions
    if (content.includes('console.log') && !filePath.includes('script')) {
      suggestions.push('Remove console.log statements for production');
    }

    // Organization suggestions
    if (analysis.category === 'utilities' && content.length > 500) {
      suggestions.push('Consider splitting utility functions into separate modules');
    }

    // AI-specific suggestions
    if (content.includes('embedding') && !content.includes('cache')) {
      suggestions.push('Consider adding caching for embedding operations to reduce costs');
    }

    if (content.includes('ai.run') && !content.includes('try')) {
      suggestions.push('Add error handling for AI service calls');
    }

    return suggestions;
  }

  /**
   * Cross-file reasoning and project structure analysis
   */
  private async reasonAboutProject(): Promise<ProjectStructure> {
    console.log('🧠 Reasoning about project structure...');

    // Group files by category
    const categories: Record<string, FileAnalysis[]> = {};
    this.analysisResults.forEach(file => {
      if (!categories[file.category]) {
        categories[file.category] = [];
      }
      categories[file.category].push(file);
    });

    // Analyze dependencies
    const dependencies: Record<string, string[]> = {};
    this.analysisResults.forEach(file => {
      dependencies[file.path] = file.relationships;
    });

    // Generate project-level insights
    const optimization_opportunities = this.findOptimizationOpportunities();
    const reorganization_suggestions = this.generateReorganizationSuggestions(categories);
    const efficiency_improvements = this.findEfficiencyImprovements();

    console.log('✅ Project reasoning complete\n');

    return {
      totalFiles: this.analysisResults.length,
      categories,
      dependencies,
      optimization_opportunities,
      reorganization_suggestions,
      efficiency_improvements
    };
  }

  /**
   * Find optimization opportunities across the project
   */
  private findOptimizationOpportunities(): string[] {
    const opportunities: string[] = [];

    // Find duplicate code patterns
    const codePatterns = new Map<string, string[]>();
    this.analysisResults.forEach(file => {
      const patterns = this.extractCodePatterns(file.content);
      patterns.forEach(pattern => {
        if (!codePatterns.has(pattern)) {
          codePatterns.set(pattern, []);
        }
        codePatterns.get(pattern)!.push(file.path);
      });
    });

    codePatterns.forEach((files, pattern) => {
      if (files.length > 2) {
        opportunities.push(`Duplicate code pattern found in ${files.length} files: consider extracting to shared utility`);
      }
    });

    // Find unused files
    const importedFiles = new Set<string>();
    this.analysisResults.forEach(file => {
      file.relationships.forEach(rel => importedFiles.add(rel));
    });

    const allFiles = new Set(this.analysisResults.map(f => f.path));
    const unusedFiles = [...allFiles].filter(file => !importedFiles.has(file));
    
    if (unusedFiles.length > 0) {
      opportunities.push(`${unusedFiles.length} potentially unused files detected`);
    }

    // Find large files that could be split
    const largeFiles = this.analysisResults.filter(f => f.size > 10000);
    if (largeFiles.length > 0) {
      opportunities.push(`${largeFiles.length} large files (>10KB) that could benefit from splitting`);
    }

    return opportunities;
  }

  /**
   * Extract common code patterns for duplicate detection
   */
  private extractCodePatterns(content: string): string[] {
    const patterns: string[] = [];
    
    // Extract function signatures
    const functionMatches = content.match(/(?:function|const)\s+\w+\s*\([^)]*\)/g) || [];
    patterns.push(...functionMatches);

    // Extract import patterns
    const importMatches = content.match(/import\s+.*?\s+from\s+['"`][^'"`]+['"`]/g) || [];
    patterns.push(...importMatches);

    return patterns;
  }

  /**
   * Generate reorganization suggestions
   */
  private generateReorganizationSuggestions(categories: Record<string, FileAnalysis[]>): string[] {
    const suggestions: string[] = [];

    // Check for misplaced files
    Object.entries(categories).forEach(([category, files]) => {
      files.forEach(file => {
        const expectedPath = this.getExpectedPath(category, file.type);
        if (!file.path.startsWith(expectedPath)) {
          suggestions.push(`Move ${file.path} to ${expectedPath} (currently miscategorized)`);
        }
      });
    });

    // Suggest new directory structures
    if (categories['mcp-implementation']?.length > 3) {
      suggestions.push('Consider creating separate subdirectories for MCP servers by agent type');
    }

    if (categories['ai-infrastructure']?.length > 2) {
      suggestions.push('Create dedicated /ai directory for AI-related utilities and managers');
    }

    return suggestions;
  }

  /**
   * Get expected file path based on category and type
   */
  private getExpectedPath(category: string, type: string): string {
    const pathMap: Record<string, string> = {
      'ui-components': 'src/components/',
      'pages': 'src/pages/',
      'utilities': 'src/utils/',
      'mcp-implementation': 'src/mcp/',
      'agent-system': 'src/agents/',
      'ai-infrastructure': 'src/ai/',
      'testing': 'tests/',
      'documentation': 'docs/',
      'automation': 'scripts/'
    };

    return pathMap[category] || 'src/';
  }

  /**
   * Find efficiency improvements
   */
  private findEfficiencyImprovements(): string[] {
    const improvements: string[] = [];

    // Check for AI cost optimization opportunities
    const aiFiles = this.analysisResults.filter(f => 
      f.content.includes('ai.run') || f.content.includes('embedding')
    );

    if (aiFiles.length > 0) {
      improvements.push('Implement AI caching and batch processing to reduce costs');
      improvements.push('Add AI usage monitoring and budget controls');
    }

    // Check for performance opportunities
    const performanceFiles = this.analysisResults.filter(f => 
      f.content.includes('forEach') || f.content.includes('map') || f.content.includes('filter')
    );

    if (performanceFiles.length > 5) {
      improvements.push('Consider performance optimization for array operations in data-heavy operations');
    }

    // Check for bundling opportunities
    const utilFiles = this.analysisResults.filter(f => f.category === 'utilities');
    if (utilFiles.length > 10) {
      improvements.push('Consider creating utility bundles to reduce import overhead');
    }

    return improvements;
  }

  /**
   * Generate embeddings for all analyzed files
   */
  private async generateEmbeddings(): Promise<void> {
    console.log('🔮 Generating embeddings for semantic search...');

    // Mock embedding generation (replace with real AI in production)
    this.analysisResults.forEach((file, index) => {
      file.embedding = this.generateMockEmbedding(`${file.path} ${file.purpose} ${file.content}`);
      
      if (index % 10 === 0) {
        console.log(`   Generated embeddings for ${index + 1}/${this.analysisResults.length} files`);
      }
    });

    console.log('✅ Embeddings generated\n');
  }

  /**
   * Generate mock embedding (replace with real AI)
   */
  private generateMockEmbedding(text: string): number[] {
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = hash % 1000;
    const embedding = [];
    
    for (let i = 0; i < 768; i++) {
      const value = Math.sin(seed + i) * Math.cos(seed + i * 2) * 0.5;
      embedding.push(value);
    }
    
    return embedding;
  }

  /**
   * Export analysis results
   */
  async exportResults(structure: ProjectStructure): Promise<void> {
    console.log('📤 Exporting analysis results...');

    // Create analysis report
    const report = {
      timestamp: new Date().toISOString(),
      project: 'Aurorion Teams',
      summary: {
        totalFiles: structure.totalFiles,
        categories: Object.keys(structure.categories).length,
        optimizations: structure.optimization_opportunities.length,
        improvements: structure.efficiency_improvements.length
      },
      ...structure,
      files: this.analysisResults
    };

    // Export to JSON
    const outputPath = path.join(this.projectRoot, 'PROJECT_ANALYSIS.json');
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

    // Export embeddings for vector database
    const embeddingsPath = path.join(this.projectRoot, 'embeddings-export.ndjson');
    const embeddings = this.analysisResults.map(file => ({
      id: `file-${file.path.replace(/[^a-zA-Z0-9]/g, '-')}`,
      values: file.embedding,
      metadata: {
        path: file.path,
        category: file.category,
        type: file.type,
        purpose: file.purpose,
        importance: file.importance,
        complexity: file.complexity,
        size: file.size,
        suggestions: file.suggestions
      }
    }));

    const ndjsonContent = embeddings.map(e => JSON.stringify(e)).join('\n');
    fs.writeFileSync(embeddingsPath, ndjsonContent);

    console.log(`✅ Analysis exported to:`);
    console.log(`   📊 ${outputPath}`);
    console.log(`   🔮 ${embeddingsPath}\n`);
  }

  /**
   * Print analysis summary
   */
  printSummary(structure: ProjectStructure): void {
    console.log('📈 PROJECT ANALYSIS SUMMARY');
    console.log('=' .repeat(50));
    console.log(`📁 Total Files Analyzed: ${structure.totalFiles}`);
    console.log(`📂 Categories Found: ${Object.keys(structure.categories).length}`);
    console.log();

    console.log('📊 Files by Category:');
    Object.entries(structure.categories).forEach(([category, files]) => {
      console.log(`   ${category}: ${files.length} files`);
    });
    console.log();

    console.log('🎯 Optimization Opportunities:');
    structure.optimization_opportunities.forEach((opp, i) => {
      console.log(`   ${i + 1}. ${opp}`);
    });
    console.log();

    console.log('⚡ Efficiency Improvements:');
    structure.efficiency_improvements.forEach((imp, i) => {
      console.log(`   ${i + 1}. ${imp}`);
    });
    console.log();

    console.log('🔄 Reorganization Suggestions:');
    structure.reorganization_suggestions.forEach((sug, i) => {
      console.log(`   ${i + 1}. ${sug}`);
    });
    console.log();

    console.log('🎉 Analysis Complete! Check PROJECT_ANALYSIS.json for detailed results.');
  }
}

// Main execution
async function main() {
  const projectRoot = process.cwd();
  const analyzer = new AiProjectAnalyzer(projectRoot);

  try {
    const structure = await analyzer.analyzeProject();
    await analyzer.exportResults(structure);
    analyzer.printSummary(structure);
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { AiProjectAnalyzer };