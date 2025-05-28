# 🚀 Aurorion Teams System

A comprehensive AI agent team framework with specialized roles and workflows. This system implements a multi-agent architecture where each agent has distinct responsibilities, decision authority, and handoff protocols.

## 🐳 Quick Start with Docker

**Prerequisites:**
- Docker and Docker Compose installed
- Git

**Setup:**
```bash
# Clone the repository
git clone https://github.com/auroriontech/team.git
cd team

# Create the required Docker network
docker network create tunnel

# Start the application
docker compose up

# Or run in detached mode
docker compose up -d
```

The application will be available at `http://localhost` (port 80).

## 🏗️ Architecture

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

## 📚 Documentation

**Quick Access:**
- **Agent Instructions**: `/agents/` folder - Complete instruction sets for all agents
- **Web Documentation**: `http://localhost/docs` - Smart docs site with navigation
- **Agent Overview**: `/agents/README.md` - Quick reference guide

### Key Documentation Files:
- **CLAUDE.md**: Project guidance for Claude Code
- **agents/**: Primary agent documentation (markdown)
- **astro-teams/**: Web application and documentation system

## 🛠️ Development

### Docker Development
```bash
# Watch mode with hot reload
docker compose up --watch

# View logs
docker compose logs -f

# Rebuild containers
docker compose up --build
```

### Local Development
```bash
cd astro-teams
npm install
npm run dev
```

## 📁 Project Structure

```
/
├── agents/                     # Primary agent documentation
│   ├── README.md              # Agent overview and quick reference
│   ├── architect-engineer.md   # System architecture agent
│   ├── morale-catalyst.md     # Team health agent
│   └── ...                    # Other agent instruction sets
├── astro-teams/               # Web application
│   ├── src/
│   │   ├── pages/            # Astro pages and routing
│   │   ├── components/       # Reusable UI components
│   │   ├── content/docs/     # Web documentation (MDX)
│   │   └── layouts/          # Page layouts
├── docker-compose.yml        # Container orchestration
├── Caddyfile                 # Reverse proxy configuration
└── CLAUDE.md                 # Project guidance
```

## 🔧 Configuration

### Environment Variables
The system uses these environment variables (set in docker-compose.yml):
- `NODE_ENV=development`
- `HOST=0.0.0.0`
- `PORT=4321`
- `ASTRO_TELEMETRY_DISABLED=1`

### Network Requirements
- Docker network `tunnel` must exist
- Caddy proxy handles routing on port 80
- Astro dev server runs on port 4321

## 🚨 Troubleshooting

### Docker Issues
```bash
# Check if tunnel network exists
docker network ls | grep tunnel

# Create network if missing
docker network create tunnel

# Check container status
docker compose ps

# View container logs
docker compose logs team
docker compose logs proxy
```

### Port Conflicts
If port 80 is in use:
```bash
# Check what's using port 80
lsof -i :80

# Or modify docker-compose.yml to use different port
# Change "80" to "8080:80" in the proxy service
```

## 📖 Agent Instructions

All agent instruction sets are available in the `/agents` folder:
- Each agent has a complete `.md` file with role definition, responsibilities, and protocols
- `/agents/README.md` provides a quick reference table of all agents
- Web documentation mirrors this content at `http://localhost/docs`

## 🤝 Contributing

1. Review agent documentation in `/agents` folder
2. Follow the workflow patterns and handoff protocols
3. Maintain industry standards (ISTQB, ITIL, ISO, PMBOK)
4. Update documentation when modifying agent instructions

---

*Built by the Aurorion Teams collective for intelligent multi-agent workflows* 🤖