#!/usr/bin/env node

/**
 * Generate Project Documentation Script
 * 
 * Automatically creates documentation folder structure when a new project is added.
 * Usage: node scripts/generate-project-docs.js <project-slug>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectSlug = process.argv[2];

if (!projectSlug) {
  console.error('❌ Error: Project slug is required');
  console.log('Usage: node scripts/generate-project-docs.js <project-slug>');
  process.exit(1);
}

// Paths
const projectRoot = path.resolve(__dirname, '..');
const docsPath = path.join(projectRoot, 'src', 'content', 'docs');
const projectDocsPath = path.join(docsPath, 'projects', projectSlug);
const projectFilePath = path.join(projectRoot, 'src', 'content', 'projects', `${projectSlug}.mdx`);

// Check if project file exists
if (!fs.existsSync(projectFilePath)) {
  console.error(`❌ Error: Project file not found: ${projectFilePath}`);
  console.log('Please create the project MDX file first in src/content/projects/');
  process.exit(1);
}

// Create project docs directory
if (!fs.existsSync(projectDocsPath)) {
  fs.mkdirSync(projectDocsPath, { recursive: true });
  console.log(`📁 Created project docs directory: ${projectDocsPath}`);
} else {
  console.log(`📁 Project docs directory already exists: ${projectDocsPath}`);
}

// Read project metadata from MDX file
let projectData;
try {
  const projectContent = fs.readFileSync(projectFilePath, 'utf8');
  const frontmatterMatch = projectContent.match(/^---\\n([\\s\\S]*?)\\n---/);
  
  if (!frontmatterMatch) {
    throw new Error('No frontmatter found in project file');
  }
  
  // Extract basic info for templates (simplified parsing)
  const frontmatter = frontmatterMatch[1];
  const nameMatch = frontmatter.match(/name:\\s*["']([^"']+)["']/);
  const descriptionMatch = frontmatter.match(/description:\\s*["']([^"']+)["']/);
  
  projectData = {
    name: nameMatch ? nameMatch[1] : projectSlug,
    description: descriptionMatch ? descriptionMatch[1] : 'Project description',
    slug: projectSlug
  };
} catch (error) {
  console.error(`❌ Error reading project data: ${error.message}`);
  projectData = {
    name: projectSlug,
    description: 'Project description',
    slug: projectSlug
  };
}

// Generate documentation templates
const templates = [
  {
    filename: 'overview.mdx',
    content: `---
title: "${projectData.name} - Overview"
description: "Project overview and architecture for ${projectData.name}"
category: "architecture"
priority: "high"
lastUpdated: ${new Date().toISOString().split('T')[0]}
status: "active"
tags: ["project", "${projectSlug}", "overview", "architecture"]
authors: ["Aurorion Teams"]
---

# ${projectData.name} - Project Overview

## Project Description

${projectData.description}

## Architecture Overview

*This section should describe the overall system architecture, key components, and design decisions.*

### Core Components

- **Frontend**: 
- **Backend**: 
- **Database**: 
- **Infrastructure**: 

### Key Features

*List the main features and capabilities of this project.*

## Technology Stack

*Document the technologies, frameworks, and tools used in this project.*

### Frontend Technologies
- Framework: 
- Language: 
- Styling: 

### Backend Technologies
- Runtime: 
- Framework: 
- Database: 

### Development Tools
- Build Tool: 
- Testing: 
- Deployment: 

## Getting Started

### Prerequisites

*List any software or tools needed to work on this project.*

### Installation

\`\`\`bash
# Add installation steps here
\`\`\`

### Development

\`\`\`bash
# Add development setup steps here
\`\`\`

## Related Documentation

- [API Documentation](./api.mdx)
- [Deployment Guide](./deployment.mdx)
- [Contributing Guidelines](./contributing.mdx)
`
  },
  {
    filename: 'api.mdx',
    content: `---
title: "${projectData.name} - API Documentation"
description: "API endpoints and integration guide for ${projectData.name}"
category: "reference"
priority: "medium"
lastUpdated: ${new Date().toISOString().split('T')[0]}
status: "active"
tags: ["project", "${projectSlug}", "api", "reference"]
authors: ["Aurorion Teams"]
---

# ${projectData.name} - API Documentation

## Overview

This document describes the API endpoints and integration patterns for ${projectData.name}.

## Base URL

\`\`\`
https://api.example.com/v1
\`\`\`

## Authentication

*Describe authentication methods (API keys, JWT, OAuth, etc.)*

## Endpoints

### Core Endpoints

*Document the main API endpoints here*

#### GET /endpoint
*Describe what this endpoint does*

**Parameters:**
- \`param1\` (string): Description
- \`param2\` (number): Description

**Response:**
\`\`\`json
{
  "status": "success",
  "data": {}
}
\`\`\`

## Error Handling

*Document error response formats and common error codes*

## Rate Limiting

*Document any rate limiting policies*

## Examples

### Example Request

\`\`\`bash
curl -X GET "https://api.example.com/v1/endpoint" \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

### Example Response

\`\`\`json
{
  "status": "success",
  "data": {
    "message": "Hello World"
  }
}
\`\`\`

## SDKs and Libraries

*List any available SDKs or client libraries*

## Webhooks

*Document webhook endpoints if applicable*
`
  },
  {
    filename: 'deployment.mdx',
    content: `---
title: "${projectData.name} - Deployment Guide"
description: "Deployment and infrastructure guide for ${projectData.name}"
category: "implementation"
priority: "high"
lastUpdated: ${new Date().toISOString().split('T')[0]}
status: "active"
tags: ["project", "${projectSlug}", "deployment", "infrastructure"]
authors: ["Aurorion Teams"]
---

# ${projectData.name} - Deployment Guide

## Overview

This guide covers the deployment process and infrastructure setup for ${projectData.name}.

## Environments

### Development
- **URL**: http://localhost:3000
- **Purpose**: Local development and testing
- **Database**: Local instance

### Staging
- **URL**: https://staging.example.com
- **Purpose**: Pre-production testing
- **Database**: Staging database

### Production
- **URL**: https://example.com
- **Purpose**: Live production environment
- **Database**: Production database

## Infrastructure

### Architecture Diagram

*Add architecture diagram here*

### Required Services

- **Application Server**: 
- **Database**: 
- **Cache**: 
- **CDN**: 
- **Monitoring**: 

## Deployment Process

### Automated Deployment

*Document CI/CD pipeline setup*

\`\`\`yaml
# Example GitHub Actions workflow
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        run: echo "Add deployment steps"
\`\`\`

### Manual Deployment

*Document manual deployment steps if needed*

\`\`\`bash
# Build application
npm run build

# Deploy to server
npm run deploy
\`\`\`

## Environment Variables

*Document required environment variables*

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| \`API_KEY\` | API authentication key | Yes | - |
| \`DATABASE_URL\` | Database connection string | Yes | - |

## Security

### SSL Certificates

*Document SSL certificate setup*

### Security Headers

*Document security header configuration*

### Access Control

*Document access control and firewall rules*

## Monitoring

### Health Checks

*Document health check endpoints*

### Logging

*Document logging configuration*

### Alerts

*Document alerting setup*

## Backup and Recovery

### Database Backups

*Document backup procedures*

### Disaster Recovery

*Document disaster recovery procedures*

## Troubleshooting

### Common Issues

*Document common deployment issues and solutions*

### Rollback Procedures

*Document how to rollback deployments*
`
  },
  {
    filename: 'contributing.mdx',
    content: `---
title: "${projectData.name} - Contributing Guidelines"
description: "Development guidelines and contribution process for ${projectData.name}"
category: "guides"
priority: "medium"
lastUpdated: ${new Date().toISOString().split('T')[0]}
status: "active"
tags: ["project", "${projectSlug}", "contributing", "development"]
authors: ["Aurorion Teams"]
---

# ${projectData.name} - Contributing Guidelines

## Overview

Thank you for your interest in contributing to ${projectData.name}! This document provides guidelines for development and contribution.

## Development Setup

### Prerequisites

*List required software versions*

- Node.js: v18+
- npm: v8+
- Git: v2.30+

### Getting Started

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ${projectSlug}
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

## Code Standards

### Code Style

*Document coding standards and style guidelines*

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting

### File Organization

*Document file structure conventions*

\`\`\`
src/
├── components/     # Reusable UI components
├── pages/         # Application pages
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── styles/        # Global styles
\`\`\`

### Naming Conventions

*Document naming conventions*

- **Files**: kebab-case (\`user-profile.tsx\`)
- **Components**: PascalCase (\`UserProfile\`)
- **Functions**: camelCase (\`getUserProfile\`)
- **Constants**: UPPER_SNAKE_CASE (\`API_BASE_URL\`)

## Git Workflow

### Branch Naming

*Document branch naming conventions*

- **Features**: \`feature/description\`
- **Bug fixes**: \`fix/description\`
- **Documentation**: \`docs/description\`

### Commit Messages

*Document commit message format*

\`\`\`
type(scope): description

- feat: new feature
- fix: bug fix
- docs: documentation
- style: formatting
- refactor: code refactoring
- test: adding tests
- chore: maintenance
\`\`\`

### Pull Request Process

1. Create feature branch from \`main\`
2. Make changes following code standards
3. Add tests for new functionality
4. Update documentation if needed
5. Submit pull request with clear description
6. Address review feedback
7. Merge after approval

## Testing

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

### Writing Tests

*Document testing guidelines*

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for UI components

## Documentation

### Code Documentation

*Document inline documentation standards*

- Use JSDoc for function documentation
- Include type information
- Provide usage examples

### README Updates

*Document when to update README*

- New features
- Changed installation process
- Updated requirements

## Review Process

### Code Review Checklist

*Document what reviewers should check*

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed

### Review Timeline

*Document expected review timeline*

- Initial review: 24-48 hours
- Follow-up reviews: 12-24 hours

## Release Process

### Version Numbering

*Document versioning strategy*

- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### Release Notes

*Document release note requirements*

- Summary of changes
- Breaking changes
- Migration guide if needed

## Getting Help

### Development Questions

*Document where to get help*

- Project discussions
- Development chat
- Issue tracker

### Bug Reports

*Document bug reporting process*

1. Check existing issues
2. Create detailed bug report
3. Include reproduction steps
4. Provide environment details
`
  }
];

// Create template files
for (const template of templates) {
  const filePath = path.join(projectDocsPath, template.filename);
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, template.content);
    console.log(`📄 Created: ${template.filename}`);
  } else {
    console.log(`📄 Already exists: ${template.filename}`);
  }
}

// Create index file that lists all project docs
const indexContent = `---
title: "${projectData.name} - Documentation"
description: "Complete documentation for ${projectData.name} project"
category: "guides"
priority: "high"
lastUpdated: ${new Date().toISOString().split('T')[0]}
status: "active"
tags: ["project", "${projectSlug}", "documentation", "index"]
authors: ["Aurorion Teams"]
---

# ${projectData.name} - Documentation Index

Welcome to the documentation for ${projectData.name}. This section contains comprehensive guides and references for the project.

## Quick Navigation

### 📖 Getting Started
- [Project Overview](./overview) - Architecture and key concepts
- [Contributing Guidelines](./contributing) - Development setup and standards

### 🔧 Technical Documentation
- [API Documentation](./api) - Endpoints and integration guide
- [Deployment Guide](./deployment) - Infrastructure and deployment process

## Project Information

**Name**: ${projectData.name}  
**Description**: ${projectData.description}  
**Last Updated**: ${new Date().toLocaleDateString()}

## Documentation Structure

This documentation is organized into the following sections:

- **Overview**: High-level architecture and project concepts
- **API**: Complete API reference and integration examples
- **Deployment**: Infrastructure setup and deployment procedures
- **Contributing**: Development guidelines and contribution process

## Need Help?

If you can't find what you're looking for in this documentation:

1. Check the main [documentation index](/docs)
2. Search for related topics using the documentation search
3. Contact the development team

## Maintenance

This documentation is automatically generated when the project is created and should be maintained alongside the project code. Please keep it up-to-date as the project evolves.
`;

const indexPath = path.join(projectDocsPath, 'index.mdx');
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, indexContent);
  console.log('📄 Created: index.mdx');
} else {
  console.log('📄 Already exists: index.mdx');
}

console.log(`\\n✅ Project documentation generated successfully!`);
console.log(`📁 Location: ${projectDocsPath}`);
console.log(`🌐 Web access: http://team.homedevenv.com/docs/projects/${projectSlug}`);
console.log(`\\n📚 Generated files:`);
templates.forEach(template => console.log(`   - ${template.filename}`));
console.log(`   - index.mdx`);