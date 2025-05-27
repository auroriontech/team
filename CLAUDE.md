# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the Aurorion Teams system - a structured AI agent team framework with specialized roles and workflows. The system implements a multi-agent architecture where each agent has distinct responsibilities, decision authority, and handoff protocols.

## Architecture

### Agent Roles & Responsibilities

**Core Workflow Agents:**
- **Architect-Engineer**: System architecture design and direct implementation
- **Tester-Reviewer**: Quality validation using ISTQB, ISO 25010, and IEEE 829 standards  
- **Optimizer-Watchdog**: Performance optimization and risk mitigation using ITIL/DevOps practices
- **Scrum-Knowledge**: Workflow coordination and documentation using Agile/PMBOK methodologies

**Operational Support Agents:**
- **Morale-Catalyst**: Team health, loop detection, and intervention authority
- **Technical Enablement**: Tool provisioning, credential management, and MCP integration
- **Standup Facilitator**: Cross-agent synthesis, status reporting, and meeting orchestration

### Workflow Patterns

- **Decision Flow**: Each agent follows standardized handoff templates: `[Agent] DECISION: [Brief decision] → STATUS: [Status] → NEXT: [Next Agent]`
- **Loop Prevention**: Maximum 2 iterations per decision before escalation
- **Authority Structure**: Each agent owns specific decisions and advises on others
- **Standards Compliance**: Industry frameworks guide each agent (ISTQB, ITIL, ISO, PMBOK, etc.)

## Documentation Structure

### Centralized Documentation System ✅ COMPLETE

**Phase 5 Migration COMPLETED**: All documentation has been successfully migrated from scattered `ai_docs` folders into a centralized, tagged, and discoverable system. The documentation now includes:

#### 📚 **Centralized Knowledge Base** (`/astro-teams/src/content/docs/`)

**Tools & Utilities:**
- `/docs/tools/analytics-implementation` - ROI-focused analytics strategy with PostHog
- `/docs/tools/api-design` - Reusable API patterns and best practices  
- `/docs/tools/database-design` - Schema patterns and D1 optimization
- `/docs/tools/testing-strategies` - Comprehensive testing with Playwright

**Architecture & Design:**
- `/docs/architecture/typescript-improvements` - Senior-level code patterns

**Deployment & Operations:**
- `/docs/guides/cloudflare-deployment` - Complete deployment workflows
- `/docs/guides/migration` - Platform and framework migration best practices

**Project Management:**
- `/docs/reference/scrum-analytics` - Data-driven project management
- `/docs/reference/scrum-workflow` - Complete sprint management framework

**Platform Documentation:**
- `/docs/platforms/cloudflare` - Comprehensive Cloudflare platform guide

#### 🏷️ **Discovery Through Tags**
All documentation is tagged for cross-project discovery:
- `platform-cloudflare`, `tool-testing`, `deployment`, `typescript`, `analytics`
- `scrum`, `migration`, `api-design`, `database`, `production`

### Agent Documentation Reference

**IMPORTANT**: When working with agent roles or needing agent-specific information, always check the `/agents` folder first. All agent instruction sets and specifications are maintained there for easy access:

#### Agent Instruction Sets (located in `/agents`)
- **architect-engineer**: `/agents/architect-engineer.md` - Complete instruction set for system architecture and implementation
- **morale-catalyst**: `/agents/morale-catalyst.md` - Team health monitoring and intervention protocols
- **optimizer-watchdog**: `/agents/optimizer-watchdog.md` - Performance optimization and risk management
- **scrum-knowledge**: `/agents/scrum-knowledge.md` - Workflow coordination and Agile methodologies
- **standup-facilitator**: `/agents/standup-facilitator.md` - Cross-agent synthesis and meeting orchestration
- **technical-enablement**: `/agents/technical-enablement.md` - Tool provisioning and MCP integration
- **tester-reviewer**: `/agents/tester-reviewer.md` - Quality validation and testing standards

#### Quick Access
- **Overview**: `/agents/README.md` - Complete guide to all agents with quick reference table

#### Implementation Guidance
- **Backlog**: `/docs/implementation-backlog` - Current development priorities and feature roadmap

### Documentation Access

The documentation is available through multiple interfaces:
- **Primary Source**: `/agents/` folder at project root (markdown files for easy access)
- **Web Interface**: http://team.homedevenv.com/docs (smart docs site with sidebar navigation)
- **Direct Navigation**: Individual agent docs accessible at `/docs/agent-prompts-[agent-name]`
- **Web Source Files**: MDX files located in `astro-teams/src/content/docs/`

### Smart Documentation Features

The docs system includes:
- **Sidebar Navigation**: Auto-generated navigation tree by category
- **Search Functionality**: Built-in search across all documentation
- **Table of Contents**: Auto-generated TOC for each page
- **Edit Features**: Direct GitHub editing and feedback mechanisms
- **Mobile Responsive**: Optimized for all device sizes

## File Structure

```
/
├── CLAUDE.md (this file)
├── agents/                     # Primary agent documentation (markdown)
│   ├── README.md              # Agent overview and quick reference
│   ├── architect-engineer.md   # System architecture and implementation
│   ├── morale-catalyst.md     # Team health and intervention
│   ├── optimizer-watchdog.md  # Performance optimization and risk
│   ├── scrum-knowledge.md     # Workflow coordination and Agile
│   ├── standup-facilitator.md # Meeting orchestration and synthesis
│   ├── technical-enablement.md # Tool provisioning and MCP
│   └── tester-reviewer.md     # Quality validation and testing
├── astro-teams/
│   ├── src/
│   │   ├── content/
│   │   │   ├── docs/           # Web documentation (MDX files)
│   │   │   ├── agent-roles/    # Agent role specifications
│   │   │   └── team-members/   # Team member profiles
│   │   ├── pages/
│   │   │   ├── docs/           # Documentation routing
│   │   │   └── agents/         # Agent profile pages
│   │   └── layouts/
│   │       ├── DocsLayout.astro    # Smart docs layout with sidebars
│   │       └── BaseLayout.astro    # Standard page layout
├── Caddyfile                   # Reverse proxy configuration
└── docker-compose.yml         # Container orchestration
```

## Key Concepts

- **Dynamic Customization**: All agents adjust behavior based on Business Culture, Nuance, Vision Emphasis, and Dreams Integration
- **MCP Integration**: Technical Enablement agent specifically designed for Multi-Component Platform compatibility
- **Standardized Documentation**: IEEE 829, ITIL, and other industry standards enforced throughout
- **Escalation Paths**: Clear protocols for CEO/CTO escalation when agents cannot resolve issues

## Working with Agent Instructions

When modifying agent instruction sets:
- **Primary Location**: Always work with files in `/agents/` folder at project root
- **Maintain Structure**: Preserve role definition, dual responsibilities, and decision authority structure
- **Keep Protocols**: Preserve workflow instructions numbering and handoff protocols
- **Loop Prevention**: Keep loop prevention mechanisms intact
- **Framework References**: Ensure industry framework references remain accurate
- **Update Metadata**: Update lastUpdated date and authors in frontmatter

### Adding New Agent Documentation

To add new agent docs:
1. Create `.md` file in `/agents/` folder with clear naming (e.g., `new-agent.md`)
2. Follow the established structure: Role Definition, Dual Responsibilities, Decision Authority, etc.
3. Update `/agents/README.md` to include the new agent in the quick reference table
4. Optionally create corresponding `.mdx` file in `astro-teams/src/content/docs/` for web interface

### Agent Role Lookup

**When you need agent-specific information:**

1. **First**: Check `/agents/[agent-name].md` for complete instruction sets
2. **Second**: Review `/agents/README.md` for quick reference and overview
3. **Third**: Check `/docs/implementation-backlog` for current priorities
4. **Fourth**: Check `astro-teams/src/content/agent-roles/` for role specifications

**Example Workflow:**
```
User asks about Architect-Engineer responsibilities
→ Check /agents/architect-engineer.md
→ Reference specific sections: Role Definition, Dual Responsibilities, Decision Authority
→ Apply workflow patterns and handoff protocols as documented
→ Use /agents/README.md for quick cross-reference with other agents
```

## Development Guidelines

- **Documentation First**: All agent updates must be reflected in the docs
- **Standards Compliance**: Follow industry frameworks as specified in each agent's instruction set
- **Version Control**: Use semantic versioning for major agent instruction updates
- **Testing**: Validate all documentation changes through the web interface

## Important Reminders

- **Never** create agent instructions outside the documented structure
- **Always** reference the `/agents` folder for authoritative agent information
- **Maintain** consistency between agent profiles and instruction sets
- **Update** both content and metadata when making changes
- **Test** documentation changes through the web interface before considering complete

This documentation system ensures consistency, maintainability, and easy reference for all agent-related work in the Aurorion Teams system.