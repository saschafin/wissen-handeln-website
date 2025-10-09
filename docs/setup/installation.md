# Installation Guide

Complete guide for setting up the Wissen & Handeln website development environment.

## Prerequisites

### Required Software

- **Git**: Version control system
  ```bash
  git --version  # Should be 2.0 or higher
  ```

- **Node.js**: (If Node.js-based project)
  ```bash
  node --version  # Should be 18.0 or higher
  npm --version   # Should be 9.0 or higher
  ```

- **Python**: (If Python-based project)
  ```bash
  python --version  # Should be 3.9 or higher
  pip --version
  ```

- **Claude Code**: AI-powered development tool
  ```bash
  claude --version
  ```

### Required Accounts

- **Anthropic Account**: For Claude API access
  - Sign up at https://console.anthropic.com
  - Generate API key from dashboard

- **GitHub Account**: For repository access (if applicable)

- **Coolify Account**: For production deployment
  - Self-hosted or managed instance

## Step 1: Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd wissen-handeln-website

# Verify directory structure
ls -la
```

## Step 2: Install Dependencies

### For Node.js Projects

```bash
# Install npm dependencies
npm install

# Or with Yarn
yarn install

# Verify installation
npm list --depth=0
```

### For Python Projects

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

## Step 3: Configure Claude Flow

### Install Claude Flow

```bash
# Install Claude Flow globally
npm install -g claude-flow@alpha

# Verify installation
npx claude-flow@alpha --version
```

### Add MCP Servers

```bash
# Add Claude Flow MCP server (required)
claude mcp add claude-flow npx claude-flow@alpha mcp start

# Add RUV Swarm (optional - enhanced coordination)
claude mcp add ruv-swarm npx ruv-swarm mcp start

# Add Flow Nexus (optional - cloud features)
claude mcp add flow-nexus npx flow-nexus@latest mcp start

# Verify MCP servers
claude mcp list
```

## Step 4: Initialize Hive Mind System

```bash
# Initialize Hive Mind
npx claude-flow@alpha hive-mind init

# Verify initialization
ls -la .hive-mind/
cat .hive-mind/config.json
```

Expected output structure:
```
.hive-mind/
├── config.json       # System configuration
├── hive.db          # SQLite database
├── sessions/        # Session data
├── memory/          # Collective memory
├── logs/            # System logs
├── backups/         # Automated backups
└── templates/       # Agent templates
```

## Step 5: Configure Environment Variables

### Create Environment File

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

### Required Environment Variables

```bash
# AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Database Configuration (adjust based on your stack)
DATABASE_URL=postgresql://user:password@localhost:5432/wissen_handeln
# Or for SQLite:
DATABASE_URL=sqlite:///./wissen_handeln.db

# Application Configuration
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=your_secret_key_here

# Server Configuration
HOST=localhost
PORT=3000  # Or 8000 for Python/Django

# Coolify Configuration (for deployment)
COOLIFY_WEBHOOK_URL=your_coolify_webhook_url
```

See [Environment Variables Guide](../operations/environment-variables.md) for complete reference.

## Step 6: Database Setup

### For PostgreSQL

```bash
# Create database
createdb wissen_handeln

# Run migrations (adjust based on framework)
# Django:
python manage.py migrate

# Node.js (Prisma example):
npx prisma migrate dev

# Verify database
psql wissen_handeln -c "\dt"
```

### For SQLite

```bash
# Database is created automatically on first run
# Run migrations
python manage.py migrate  # Django
npx prisma migrate dev    # Prisma

# Verify database
sqlite3 wissen_handeln.db ".tables"
```

## Step 7: Verify Installation

### Run Tests

```bash
# Node.js
npm test

# Python
python manage.py test
# Or with pytest:
pytest

# Claude Flow tests
npx claude-flow@alpha test
```

### Start Development Server

```bash
# Node.js
npm run dev

# Python/Django
python manage.py runserver

# Verify server is running
curl http://localhost:3000  # or port 8000
```

### Test AI Integration

```bash
# Test Claude API connection
npx claude-flow@alpha test-api

# Test content generation
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test content generation"}'
```

## Step 8: Configure IDE (Optional)

### VS Code Setup

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "files.associations": {
    "*.md": "markdown"
  }
}
```

### Install VS Code Extensions

- Claude Code Extension
- ESLint (for Node.js)
- Python (for Python projects)
- GitLens
- Prettier

## Troubleshooting

### Common Issues

#### Claude Flow not found

```bash
# Reinstall Claude Flow
npm install -g claude-flow@alpha

# Or use npx directly
npx claude-flow@alpha hive-mind init
```

#### Database connection errors

```bash
# Verify database is running
# PostgreSQL:
pg_isready

# Check connection string
echo $DATABASE_URL

# Reset database
dropdb wissen_handeln
createdb wissen_handeln
python manage.py migrate
```

#### API key not working

```bash
# Verify API key is set
echo $ANTHROPIC_API_KEY

# Test API key
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-sonnet-20240229","max_tokens":10,"messages":[{"role":"user","content":"Hi"}]}'
```

#### Port already in use

```bash
# Find process using port
lsof -i :3000  # or :8000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Getting Help

- Check [GitHub Issues](https://github.com/ruvnet/claude-flow/issues)
- Review [Claude Flow Documentation](https://github.com/ruvnet/claude-flow)
- Contact development team

## Next Steps

After successful installation:

1. Review [Architecture Documentation](../architecture/overview.md)
2. Read [AI Integration Guide](../development/ai-integration.md)
3. Set up [Coolify Deployment](deployment.md)
4. Review [Contributing Guidelines](../development/contributing.md)

## Post-Installation Checklist

- [ ] Repository cloned successfully
- [ ] Dependencies installed
- [ ] Claude Flow configured
- [ ] MCP servers running
- [ ] Hive Mind initialized
- [ ] Environment variables configured
- [ ] Database created and migrated
- [ ] Tests passing
- [ ] Development server running
- [ ] API key working
- [ ] IDE configured (optional)

---

**Ready to develop!** See [Contributing Guidelines](../development/contributing.md) for development workflow.
