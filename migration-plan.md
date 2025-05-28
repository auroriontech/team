# Documentation Migration Plan

**SCRUM-KNOWLEDGE AGENT - CENTRALIZED DOCS MIGRATION**

## Migration Mapping with Tags

### PLATFORMS CATEGORY

**1. Cloudflare Platform Guide**
- **Source**: `ai_docs/2.1-DEPLOYMENT_GUIDE.md`
- **Destination**: `/docs/platforms/cloudflare.mdx`
- **Tags**: `["platform-cloudflare", "deployment", "pages", "workers", "guide"]`
- **Scope**: Reusable across all Cloudflare projects

**2. Astro Framework Guide**  
- **Source**: `ai_docs/1.2-MIGRATION_GUIDE.md` (Astro sections)
- **Destination**: `/docs/platforms/astro.mdx`
- **Tags**: `["platform-astro", "framework", "migration", "guide"]`
- **Scope**: Reusable across all Astro projects

### TOOLS CATEGORY

**3. Database Design Patterns**
- **Source**: `ai_docs/6.2-DATABASE_DESIGN.md`
- **Destination**: `/docs/tools/database-design.mdx`
- **Tags**: `["tool-database", "d1", "sqlite", "schema", "patterns", "reference"]`
- **Scope**: Reusable database design principles

**4. Testing Strategies**
- **Source**: `ai_docs/2.2-TESTING_GUIDE.md` + `ai_docs/2.2-TESTING_GUIDE_ENHANCED.md`
- **Destination**: `/docs/tools/testing-strategies.mdx`
- **Tags**: `["tool-testing", "playwright", "integration", "unit", "guide"]`
- **Scope**: Reusable testing approaches

**5. API Design Patterns**
- **Source**: `ai_docs/5.3-API_DOCUMENTATION.md`
- **Destination**: `/docs/tools/api-design.mdx`
- **Tags**: `["tool-api", "rest", "endpoints", "patterns", "reference"]`
- **Scope**: Reusable API design principles

**6. Analytics Implementation**
- **Source**: `ai_docs/ANALYTICS_IMPLEMENTATION_MATRIX.md`
- **Destination**: `/docs/tools/analytics.mdx`
- **Tags**: `["tool-analytics", "monitoring", "metrics", "implementation"]`
- **Scope**: Reusable analytics patterns

### GUIDES CATEGORY

**7. Migration Best Practices**
- **Source**: `ai_docs/WORKERS_MIGRATION_GUIDE.md` + migration sections
- **Destination**: `/docs/guides/migration.mdx`
- **Tags**: `["guide", "migration", "workers", "best-practices"]`
- **Scope**: General migration strategies

**8. Troubleshooting Guide**
- **Source**: `ai_docs/7.1-KNOWN_ISSUES.md` + `ai_docs/7.2-MIGRATION_FIXES.md`
- **Destination**: `/docs/guides/troubleshooting.mdx`
- **Tags**: `["guide", "troubleshooting", "debugging", "fixes"]`
- **Scope**: Cross-project problem solving

**9. Code Standards**
- **Source**: `ai_docs/2.3-SENIOR_LEVEL_IMPROVEMENTS.md`
- **Destination**: `/docs/guides/code-standards.mdx`
- **Tags**: `["guide", "typescript", "architecture", "best-practices"]`
- **Scope**: Development standards across projects

### REFERENCE CATEGORY

**10. Scrum Analytics**
- **Source**: `ai_docs/SCRUM_ANALYTICS_BOARD.md` + `ai_docs/9.1-SCRUM_MASTER_WORKFLOW.md`
- **Destination**: `/docs/reference/scrum-analytics.mdx`
- **Tags**: `["reference", "scrum", "analytics", "workflow", "project-management"]`
- **Scope**: Project management tools

**11. Release Process**
- **Source**: `ai_docs/RELEASE_PROCESS.md`
- **Destination**: `/docs/reference/release-process.mdx`
- **Tags**: `["reference", "release", "deployment", "workflow"]`
- **Scope**: Standard release procedures

### PROJECTS CATEGORY

**12. Aurorion Landing Project**
- **Source**: `ai_docs/1.1-PROJECT_STATUS.md` + `docs/*`
- **Destination**: `/docs/projects/aurorion-landing/`
- **Tags**: `["project-aurorion-landing", "status", "overview"]`
- **Scope**: Project-specific documentation

### SKIP/ARCHIVE

**13. Skip These:**
- `ai_docs/_archived/*` → Already archived
- `ai_docs/3.2-SESSION_TRACKING.md` → Development notes only
- `ai_docs/7.3-TYPESCRIPT_FIXES.md` → Merge into troubleshooting

**14. Move to Agents:**
- `ai_docs/agents/cloudflare-workers-observability-docs-prompt.md` → `/agents/cloudflare-observability.md`

## Tag Usage Examples

### Cross-Project Discovery
```markdown
tags: ["tool-database", "platform-cloudflare", "sqlite"]
```
*Findable by: any project using databases + Cloudflare + SQLite*

### Platform-Specific
```markdown  
tags: ["platform-cloudflare", "deployment", "guide"]
```
*Findable by: any project deploying to Cloudflare*

### Project-Specific
```markdown
tags: ["project-aurorion-landing", "status", "astro"]
```
*Findable by: aurorion-landing project context*

## Next Phase: Ready for Phase 4 - Sort & Create Structure