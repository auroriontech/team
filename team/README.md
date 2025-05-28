# Aurorion Teams - Agent Documentation

This folder contains the complete instruction sets for all Aurorion Teams AI agents. Each agent has specialized responsibilities, decision authority, and handoff protocols.

## Agent Instruction Sets

### Core Workflow Agents
- **[architect-engineer.md](./architect-engineer.md)** - System architecture design and direct implementation
- **[tester-reviewer.md](./tester-reviewer.md)** - Quality validation using ISTQB, ISO 25010, and IEEE 829 standards
- **[optimizer-watchdog.md](./optimizer-watchdog.md)** - Performance optimization and risk mitigation using ITIL/DevOps practices
- **[scrum-knowledge.md](./scrum-knowledge.md)** - Workflow coordination and documentation using Agile/PMBOK methodologies

### Operational Support Agents
- **[morale-catalyst.md](./morale-catalyst.md)** - Team health, loop detection, and intervention authority
- **[technical-enablement.md](./technical-enablement.md)** - Tool provisioning, credential management, and MCP integration
- **[standup-facilitator.md](./standup-facilitator.md)** - Cross-agent synthesis, status reporting, and meeting orchestration

## Usage

Each agent file contains:
- **Role Definition**: Clear scope and accountability
- **Dual Responsibilities**: Primary and secondary duties
- **Decision Authority**: What decisions the agent owns vs advises on
- **Workflow Instructions**: Step-by-step operational procedures
- **Handoff Protocols**: How to transfer work to other agents
- **Loop Prevention**: Mechanisms to avoid infinite loops
- **Industry Standards**: Relevant frameworks (ISTQB, ITIL, ISO, PMBOK, etc.)

## Quick Reference

| Agent | Primary Focus | Industry Standards |
|-------|---------------|-------------------|
| Architect-Engineer | System design & implementation | IEEE, architectural patterns |
| Tester-Reviewer | Quality validation | ISTQB, ISO 25010, IEEE 829 |
| Optimizer-Watchdog | Performance & risk | ITIL, DevOps practices |
| Scrum-Knowledge | Workflow coordination | Agile, PMBOK |
| Morale-Catalyst | Team health | Psychological safety frameworks |
| Technical Enablement | Tool provisioning | MCP, infrastructure management |
| Standup Facilitator | Meeting orchestration | Agile ceremonies, synthesis |

## Integration

These agent instruction sets are also available through the web documentation interface at:
- **Web Interface**: http://team.homedevenv.com/docs
- **Individual Docs**: `/docs/agent-prompts-[agent-name]`

The web interface provides additional features like search, navigation, and editing capabilities.

## Workflow Patterns

All agents follow standardized patterns:
- **Decision Flow**: `[Agent] DECISION: [Brief decision] → STATUS: [Status] → NEXT: [Next Agent]`
- **Loop Prevention**: Maximum 2 iterations per decision before escalation
- **Escalation**: Clear protocols for CEO/CTO escalation when agents cannot resolve issues

## Maintenance

When updating agent instructions:
1. Edit the `.md` file in this folder
2. Update corresponding MDX file in `astro-teams/src/content/docs/` if needed
3. Test changes through the web interface
4. Ensure consistency across all agent handoff protocols