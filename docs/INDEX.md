# Documentation Index

Complete guide to the Wissen & Handeln website documentation.

## Quick Start

New to the project? Start here:

1. [README](../README.md) - Project overview
2. [Installation Guide](setup/installation.md) - Get up and running
3. [Architecture Overview](architecture/overview.md) - Understand the system
4. [Contributing Guidelines](development/contributing.md) - Start contributing

## Documentation Structure

### Setup & Installation

**Getting the project running**

- [Installation Guide](setup/installation.md) - Complete installation walkthrough
  - Prerequisites and requirements
  - Step-by-step setup instructions
  - Troubleshooting common issues
  - Post-installation checklist

- [Deployment Guide](setup/deployment.md) - Deploy to Coolify
  - Coolify server setup
  - Application configuration
  - Database setup
  - SSL/TLS configuration
  - Automated deployments
  - Rollback procedures

### Development

**Building and contributing to the project**

- [AI Integration](development/ai-integration.md) - AI-powered content generation
  - Claude API setup
  - Content generation services
  - API endpoints
  - Best practices
  - Testing AI features
  - Security considerations

- [Contributing Guidelines](development/contributing.md) - How to contribute
  - Development workflow
  - Code standards and conventions
  - Testing requirements
  - Pull request process
  - Using Claude Flow and Hive Mind
  - Git best practices

### API Documentation

**Using the API**

- [Content Generation API](api/content-generation.md) - Complete API reference
  - Authentication
  - Rate limits
  - All endpoints documented
  - Request/response examples
  - Error handling
  - SDK usage examples

### Operations

**Configuration and deployment**

- [Environment Variables](operations/environment-variables.md) - Configuration reference
  - Required variables
  - Optional variables
  - Environment-specific configs
  - Security best practices
  - Validation scripts

### Architecture

**Understanding the system**

- [Architecture Overview](architecture/overview.md) - System design and architecture
  - High-level architecture
  - Component structure
  - Technology stack
  - Design patterns
  - Data flow
  - Security architecture
  - Scalability considerations

## Documentation by Role

### For Developers

**I want to contribute code**

1. [Installation Guide](setup/installation.md)
2. [Architecture Overview](architecture/overview.md)
3. [Contributing Guidelines](development/contributing.md)
4. [AI Integration](development/ai-integration.md)
5. [Environment Variables](operations/environment-variables.md)

### For DevOps

**I want to deploy and manage the application**

1. [Installation Guide](setup/installation.md)
2. [Deployment Guide](setup/deployment.md)
3. [Environment Variables](operations/environment-variables.md)
4. [Architecture Overview](architecture/overview.md)

### For API Users

**I want to integrate with the API**

1. [Content Generation API](api/content-generation.md)
2. [AI Integration](development/ai-integration.md)
3. [Environment Variables](operations/environment-variables.md)

### For Project Managers

**I want to understand the project**

1. [README](../README.md)
2. [Architecture Overview](architecture/overview.md)
3. [Contributing Guidelines](development/contributing.md)

## Common Tasks

### Setting Up Development Environment

1. Follow [Installation Guide](setup/installation.md)
2. Configure [Environment Variables](operations/environment-variables.md)
3. Read [Contributing Guidelines](development/contributing.md)

### Deploying to Production

1. Complete [Installation Guide](setup/installation.md)
2. Follow [Deployment Guide](setup/deployment.md)
3. Set production [Environment Variables](operations/environment-variables.md)

### Generating Content with AI

1. Review [AI Integration](development/ai-integration.md)
2. Check [API Documentation](api/content-generation.md)
3. Configure [Environment Variables](operations/environment-variables.md)

### Contributing Code

1. Read [Contributing Guidelines](development/contributing.md)
2. Understand [Architecture](architecture/overview.md)
3. Follow development workflow in [Contributing](development/contributing.md)

## File Tree

```
docs/
├── INDEX.md                          # This file
│
├── setup/                            # Installation & Deployment
│   ├── installation.md               # Complete installation guide
│   └── deployment.md                 # Coolify deployment guide
│
├── development/                      # Development Guides
│   ├── ai-integration.md             # AI content generation system
│   └── contributing.md               # Contribution guidelines
│
├── api/                              # API Documentation
│   └── content-generation.md         # Content generation API reference
│
├── operations/                       # Operations & Configuration
│   └── environment-variables.md      # Environment variable reference
│
└── architecture/                     # Architecture Documentation
    └── overview.md                   # System architecture overview
```

## Additional Resources

### External Documentation

- [Anthropic Claude API](https://docs.anthropic.com) - Claude API documentation
- [Claude Flow](https://github.com/ruvnet/claude-flow) - Claude Flow framework
- [Coolify](https://coolify.io/docs) - Coolify deployment platform
- [Astro](https://docs.astro.build) - Astro framework documentation
- [TypeScript](https://www.typescriptlang.org/docs) - TypeScript documentation

### Related Files

- [CLAUDE.md](../CLAUDE.md) - Claude Code project instructions
- [.gitignore](../.gitignore) - Git ignore rules
- [package.json](../package.json) - Project dependencies

### Tools & Utilities

- **Claude Code**: AI-powered development tool
- **Claude Flow**: Multi-agent orchestration system
- **Hive Mind**: Collective intelligence coordination
- **SPARC**: Systematic development methodology

## Search Tips

### Finding Information

**Use Ctrl+F (Cmd+F) to search within documents**

Common search terms:
- "API key" → Environment Variables, AI Integration
- "deployment" → Deployment Guide
- "testing" → Contributing Guidelines
- "authentication" → API Documentation, Contributing
- "database" → Installation, Deployment, Environment Variables
- "error" → Troubleshooting sections in all guides

### Quick Reference

| Need to... | See Document | Section |
|------------|-------------|---------|
| Set up project | [Installation](setup/installation.md) | All |
| Deploy to production | [Deployment](setup/deployment.md) | All |
| Generate content | [AI Integration](development/ai-integration.md) | Content Generation Services |
| Use the API | [API Docs](api/content-generation.md) | Endpoints |
| Configure environment | [Environment Vars](operations/environment-variables.md) | Required Variables |
| Contribute code | [Contributing](development/contributing.md) | Development Workflow |
| Understand architecture | [Architecture](architecture/overview.md) | System Architecture |

## Documentation Standards

### Format

All documentation follows these standards:

- **Markdown format** (`.md` files)
- **Clear headings** with proper hierarchy (H1 → H6)
- **Code examples** with syntax highlighting
- **Tables** for structured data
- **Diagrams** using ASCII art or Mermaid
- **Links** to related documentation

### Structure

Each document includes:

1. **Title** - Clear, descriptive title
2. **Overview** - Brief introduction
3. **Table of Contents** - For longer documents
4. **Main Content** - Well-organized sections
5. **Examples** - Practical code examples
6. **Troubleshooting** - Common issues and solutions
7. **Related Links** - References to other docs

### Code Examples

```typescript
// All code examples include:
// 1. Syntax highlighting
// 2. Clear comments
// 3. Realistic examples
// 4. Error handling

async function exampleFunction() {
  try {
    // Implementation
  } catch (error) {
    // Error handling
  }
}
```

## Maintenance

### Updating Documentation

When updating documentation:

1. **Keep in sync** - Update related docs
2. **Version control** - Track changes in Git
3. **Review changes** - Check for accuracy
4. **Test examples** - Verify code works
5. **Update index** - Add new sections here

### Documentation Checklist

- [ ] Clear and concise
- [ ] Code examples tested
- [ ] Links verified
- [ ] Formatting correct
- [ ] Spelling checked
- [ ] Cross-references updated
- [ ] Index updated

## Support

### Getting Help

If documentation is unclear:

1. **Check related docs** - Use cross-references
2. **Search repository** - Use GitHub search
3. **Open issue** - Report unclear documentation
4. **Ask community** - GitHub Discussions

### Contributing to Documentation

Found an issue or want to improve documentation?

1. Follow [Contributing Guidelines](development/contributing.md)
2. Create branch: `docs/your-improvement`
3. Make changes
4. Submit pull request

## Version

- **Documentation Version**: 1.0.0
- **Last Updated**: 2025-10-09
- **Project Version**: See [package.json](../package.json)

---

**Start here**: [README](../README.md) → [Installation](setup/installation.md) → [Contributing](development/contributing.md)
