#!/bin/bash

# AI-Powered Project Optimization Runner
# Analyzes, organizes, and optimizes the Aurorion Teams project

echo "🤖 AI-Powered Project Optimization Suite"
echo "========================================"
echo ""

# Check if Node.js and required tools are available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo "❌ npx is required but not installed."
    exit 1
fi

# Set project root
PROJECT_ROOT=$(pwd)
echo "📁 Project Root: $PROJECT_ROOT"
echo ""

# Step 1: Run project analysis
echo "🔍 Step 1: Analyzing project structure with AI..."
echo "------------------------------------------------"
if node --loader tsx scripts/ai-project-analyzer.ts; then
    echo "✅ Project analysis completed successfully"
else
    echo "❌ Project analysis failed"
    exit 1
fi
echo ""

# Step 2: Generate optimization plan
echo "🚀 Step 2: Generating AI-powered optimization plan..."
echo "---------------------------------------------------"
if node --loader tsx scripts/ai-project-optimizer.ts; then
    echo "✅ Optimization plan generated successfully"
else
    echo "❌ Optimization plan generation failed"
    exit 1
fi
echo ""

# Step 3: Show results summary
echo "📊 Step 3: Analysis Results Summary"
echo "-----------------------------------"

if [ -f "PROJECT_ANALYSIS.json" ]; then
    TOTAL_FILES=$(node -pe "JSON.parse(require('fs').readFileSync('PROJECT_ANALYSIS.json', 'utf8')).summary.totalFiles")
    CATEGORIES=$(node -pe "JSON.parse(require('fs').readFileSync('PROJECT_ANALYSIS.json', 'utf8')).summary.categories")
    OPTIMIZATIONS=$(node -pe "JSON.parse(require('fs').readFileSync('PROJECT_ANALYSIS.json', 'utf8')).summary.optimizations")
    
    echo "📁 Total Files Analyzed: $TOTAL_FILES"
    echo "📂 Categories Identified: $CATEGORIES"
    echo "🎯 Optimization Opportunities: $OPTIMIZATIONS"
else
    echo "⚠️  Analysis results not found"
fi
echo ""

# Step 4: Vector database population (if available)
echo "🔮 Step 4: Populating vector database with analyzed content..."
echo "------------------------------------------------------------"
if [ -f "embeddings-export.ndjson" ]; then
    echo "📋 Embeddings file generated: embeddings-export.ndjson"
    
    # Check if wrangler is available and vectorize index exists
    if command -v wrangler &> /dev/null; then
        echo "🚀 Attempting to populate Vectorize database..."
        if npx wrangler vectorize insert aurorion-project-knowledge --file=embeddings-export.ndjson; then
            echo "✅ Vector database populated successfully"
        else
            echo "⚠️  Vector database population failed (may need deployment)"
        fi
    else
        echo "⚠️  Wrangler not available - embeddings saved for manual upload"
    fi
else
    echo "⚠️  Embeddings file not generated"
fi
echo ""

# Step 5: Generate actionable reports
echo "📋 Step 5: Generated Reports and Next Steps"
echo "-------------------------------------------"
echo "📊 Analysis Report: PROJECT_ANALYSIS.json"
echo "🎯 Optimization Plan: OPTIMIZATION_PLAN.json"
echo "📝 Human-readable Report: OPTIMIZATION_REPORT.md"
echo "🔮 Vector Embeddings: embeddings-export.ndjson"
echo ""

echo "🎉 AI Optimization Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Review OPTIMIZATION_REPORT.md for detailed recommendations"
echo "2. Implement high-priority optimizations from the plan"
echo "3. Deploy to Cloudflare to test AI-powered features"
echo "4. Monitor costs and performance improvements"
echo ""

echo "💡 Quick Wins to Implement:"
echo "- Add AI cost monitoring (src/ai/cost-monitor.ts)"
echo "- Implement embedding caching for cost reduction"
echo "- Apply TypeScript improvements for better code quality"
echo "- Reorganize files according to suggested structure"
echo ""

echo "🚀 Ready to deploy AI-enhanced Aurorion Teams!"