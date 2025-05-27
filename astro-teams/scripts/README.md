# Aurorion Teams - Automation Scripts

This folder contains automation scripts for the Aurorion Teams project.

## Project Documentation Generator

### `generate-project-docs.js`

Automatically creates a complete documentation folder structure for new projects.

#### Usage

```bash
# Direct script usage
node scripts/generate-project-docs.js <project-slug>

# Using npm script
npm run project:docs <project-slug>
```

#### What it creates

When you run the script for a project, it creates:

```
src/content/docs/projects/<project-slug>/
├── index.mdx          # Documentation index and navigation
├── overview.mdx       # Project overview and architecture
├── api.mdx           # API documentation and endpoints  
├── deployment.mdx    # Deployment and infrastructure guide
└── contributing.mdx  # Development and contribution guidelines
```

#### Features

- **Auto-generates** documentation structure from project metadata
- **Reads project data** from existing MDX files in `src/content/projects/`
- **Creates templated docs** with proper frontmatter and structure
- **Integrates with web docs** - appears automatically in sidebar navigation
- **Maintains consistency** across all project documentation

#### Example

```bash
# Create docs for a project called "my-awesome-app"
npm run project:docs my-awesome-app
```

This will:
1. ✅ Check that `src/content/projects/my-awesome-app.mdx` exists
2. ✅ Create `src/content/docs/projects/my-awesome-app/` folder
3. ✅ Generate 5 documentation files with proper templates
4. ✅ Make docs available at `http://team.homedevenv.com/docs/projects/my-awesome-app`

#### Templates Generated

Each generated file includes:

- **Proper frontmatter** with title, description, category, priority, tags
- **Structured content** following documentation best practices
- **Consistent formatting** with other project documentation
- **Cross-references** between related documentation files
- **Web integration** for the smart docs site

#### Workflow Integration

**When adding a new project:**

1. Create the project MDX file in `src/content/projects/project-name.mdx`
2. Run `npm run project:docs project-name`
3. Customize the generated documentation templates
4. Commit all files to git

**Benefits:**

- ✅ **Consistent structure** across all project documentation
- ✅ **Time saving** - no need to create docs from scratch
- ✅ **Best practices** - templates follow documentation standards
- ✅ **Web integration** - automatically appears in sidebar navigation
- ✅ **Maintenance** - easy to update and maintain over time

## Future Scripts

This folder can be extended with additional automation scripts:

- `validate-projects.js` - Validate project schemas and content
- `generate-project-summary.js` - Create project summary reports
- `sync-project-data.js` - Sync project data with external services
- `cleanup-project-docs.js` - Clean up unused documentation files

## Development

### Adding New Scripts

1. Create the script file in this folder
2. Make it executable: `chmod +x script-name.js`
3. Add corresponding npm script in `package.json`
4. Document usage in this README

### Script Requirements

- Use ES modules (`import`/`export`)
- Include proper error handling
- Provide clear console output
- Follow existing code style
- Include JSDoc documentation