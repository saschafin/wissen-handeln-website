# Environment Variables Reference

Complete reference for all environment variables used in the Wissen & Handeln website.

## Table of Contents

- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Environment-Specific Variables](#environment-specific-variables)
- [Security Best Practices](#security-best-practices)

## Configuration File

Environment variables are stored in `.env` file in the project root.

```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

**Important**: Never commit `.env` to version control!

## Required Variables

These variables must be set for the application to run.

### AI & API Configuration

#### ANTHROPIC_API_KEY

Claude API key for AI-powered content generation.

```bash
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to obtain**:
1. Sign up at https://console.anthropic.com
2. Navigate to API Keys section
3. Generate new API key
4. Copy and paste into `.env`

**Security**: Keep this secret! Never expose in client-side code.

---

#### ANTHROPIC_MODEL

Claude model to use for content generation.

```bash
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

**Available models**:
- `claude-3-opus-20240229` - Most capable (highest cost)
- `claude-3-sonnet-20240229` - Balanced performance (recommended)
- `claude-3-haiku-20240307` - Fast and efficient (lowest cost)

**Default**: `claude-3-sonnet-20240229`

---

#### ANTHROPIC_MAX_TOKENS

Maximum tokens for AI responses.

```bash
ANTHROPIC_MAX_TOKENS=4096
```

**Recommended values**:
- Short content: `2048`
- Medium content: `4096`
- Long content: `8192`

**Default**: `4096`

---

### Application Configuration

#### ENVIRONMENT

Application environment mode.

```bash
ENVIRONMENT=development
```

**Valid values**:
- `development` - Development mode (verbose logging, debug enabled)
- `staging` - Staging environment (similar to production)
- `production` - Production mode (optimized, minimal logging)

**Default**: `development`

---

#### DEBUG

Enable/disable debug mode.

```bash
DEBUG=true
```

**Values**:
- `true` - Enable debug logging and stack traces
- `false` - Disable debug features (use in production)

**Default**: `false` in production, `true` in development

---

#### SECRET_KEY

Application secret key for session encryption and security.

```bash
SECRET_KEY=your-long-random-secret-key-here-min-32-chars
```

**Generation**:
```bash
# Generate secure random key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or for Python
python -c "import secrets; print(secrets.token_hex(32))"
```

**Security**: Must be at least 32 characters. Change in production.

---

### Server Configuration

#### HOST

Server host address.

```bash
HOST=localhost
```

**Values**:
- `localhost` - Local development
- `0.0.0.0` - Listen on all interfaces (production)
- Specific IP address

**Default**: `localhost`

---

#### PORT

Server port number.

```bash
PORT=3000
```

**Common ports**:
- `3000` - Node.js/Next.js default
- `8000` - Django/Python default
- `8080` - Alternative HTTP port

**Default**: `3000` (Node.js) or `8000` (Python)

---

### Database Configuration

#### DATABASE_URL

Database connection string.

**PostgreSQL**:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/wissen_handeln
```

**MySQL**:
```bash
DATABASE_URL=mysql://username:password@localhost:3306/wissen_handeln
```

**SQLite** (development):
```bash
DATABASE_URL=sqlite:///./wissen_handeln.db
```

**Format**: `protocol://user:password@host:port/database`

---

#### DATABASE_POOL_SIZE

Database connection pool size.

```bash
DATABASE_POOL_SIZE=10
```

**Recommended**:
- Development: `5`
- Production: `10-20` (based on traffic)

**Default**: `10`

---

## Optional Variables

### Claude Flow Configuration

#### CLAUDE_FLOW_ENABLED

Enable/disable Claude Flow coordination.

```bash
CLAUDE_FLOW_ENABLED=true
```

**Default**: `true`

---

#### HIVE_MIND_ENABLED

Enable/disable Hive Mind multi-agent system.

```bash
HIVE_MIND_ENABLED=true
```

**Note**: Typically disabled in production, enabled in development.

**Default**: `false` in production

---

### Logging Configuration

#### LOG_LEVEL

Application logging level.

```bash
LOG_LEVEL=info
```

**Levels** (from most to least verbose):
- `debug` - All messages including debug info
- `info` - Informational messages
- `warn` - Warnings only
- `error` - Errors only

**Default**: `info` in production, `debug` in development

---

#### LOG_FILE

Log file path (if file logging is enabled).

```bash
LOG_FILE=/var/log/wissen-handeln/app.log
```

**Default**: Console logging only

---

### Email Configuration

#### EMAIL_HOST

SMTP server hostname.

```bash
EMAIL_HOST=smtp.gmail.com
```

---

#### EMAIL_PORT

SMTP server port.

```bash
EMAIL_PORT=587
```

**Common ports**:
- `587` - TLS (recommended)
- `465` - SSL
- `25` - Unencrypted (not recommended)

---

#### EMAIL_USER

SMTP authentication username.

```bash
EMAIL_USER=your-email@example.com
```

---

#### EMAIL_PASSWORD

SMTP authentication password.

```bash
EMAIL_PASSWORD=your-email-password
```

**Security**: Use app-specific passwords for Gmail/other providers.

---

#### EMAIL_FROM

Default "from" email address.

```bash
EMAIL_FROM=noreply@wissen-handeln.com
```

---

### Cache Configuration

#### REDIS_URL

Redis connection URL (if using Redis for caching).

```bash
REDIS_URL=redis://localhost:6379/0
```

**Format**: `redis://[username:password@]host:port/database`

---

#### CACHE_TTL

Default cache TTL (time-to-live) in seconds.

```bash
CACHE_TTL=3600
```

**Common values**:
- `300` - 5 minutes
- `3600` - 1 hour (default)
- `86400` - 24 hours

---

### File Storage

#### STORAGE_DRIVER

File storage driver.

```bash
STORAGE_DRIVER=local
```

**Options**:
- `local` - Local filesystem
- `s3` - AWS S3
- `gcs` - Google Cloud Storage

---

#### STORAGE_PATH

Local storage path.

```bash
STORAGE_PATH=/var/www/storage
```

**Default**: `./storage`

---

#### S3_BUCKET

AWS S3 bucket name (if using S3).

```bash
S3_BUCKET=wissen-handeln-assets
```

---

#### S3_REGION

AWS S3 region.

```bash
S3_REGION=eu-central-1
```

---

#### AWS_ACCESS_KEY_ID

AWS access key ID.

```bash
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
```

---

#### AWS_SECRET_ACCESS_KEY

AWS secret access key.

```bash
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

---

### Third-Party Integrations

#### GOOGLE_ANALYTICS_ID

Google Analytics tracking ID.

```bash
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

#### SENTRY_DSN

Sentry error tracking DSN.

```bash
SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456
```

---

### Coolify Deployment

#### COOLIFY_WEBHOOK_URL

Coolify deployment webhook URL.

```bash
COOLIFY_WEBHOOK_URL=https://coolify.example.com/api/v1/deploy/webhook/xxxxx
```

---

#### COOLIFY_PROJECT_ID

Coolify project identifier.

```bash
COOLIFY_PROJECT_ID=proj_abc123xyz
```

---

## Environment-Specific Variables

### Development (.env.development)

```bash
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=debug
HOST=localhost
PORT=3000
DATABASE_URL=sqlite:///./dev.db
HIVE_MIND_ENABLED=true
```

### Staging (.env.staging)

```bash
ENVIRONMENT=staging
DEBUG=true
LOG_LEVEL=info
HOST=0.0.0.0
PORT=3000
DATABASE_URL=postgresql://user:pass@staging-db:5432/wissen_handeln_staging
HIVE_MIND_ENABLED=false
```

### Production (.env.production)

```bash
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=warn
HOST=0.0.0.0
PORT=3000
DATABASE_URL=postgresql://user:pass@prod-db:5432/wissen_handeln
HIVE_MIND_ENABLED=false
SECRET_KEY=production-secret-key-very-long-and-random
```

---

## Security Best Practices

### 1. Never Commit Secrets

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

### 2. Use Strong Secrets

```bash
# Generate secure random secrets
openssl rand -base64 32

# Or with Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Rotate Secrets Regularly

- Rotate API keys every 90 days
- Change secrets after team member departure
- Use different secrets per environment

### 4. Limit Access

- Use environment-specific service accounts
- Apply principle of least privilege
- Use secret management tools (Vault, AWS Secrets Manager)

### 5. Validate Variables

```typescript
// Example validation
function validateEnv() {
  const required = [
    'ANTHROPIC_API_KEY',
    'DATABASE_URL',
    'SECRET_KEY',
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  // Validate format
  if (process.env.SECRET_KEY.length < 32) {
    throw new Error('SECRET_KEY must be at least 32 characters');
  }
}
```

### 6. Use Secret Management

For production:

```bash
# AWS Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id wissen-handeln/production/api-keys

# HashiCorp Vault
vault kv get secret/wissen-handeln/production
```

---

## Environment Variable Loading

### Node.js (with dotenv)

```typescript
// Load at application start
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Load environment-specific file
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

// Access variables
const apiKey = process.env.ANTHROPIC_API_KEY;
```

### Python (with python-dotenv)

```python
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# Load environment-specific file
load_dotenv(f'.env.{os.getenv("ENVIRONMENT", "development")}')

# Access variables
api_key = os.getenv('ANTHROPIC_API_KEY')
```

---

## Troubleshooting

### Variable Not Loading

```bash
# Check if .env file exists
ls -la .env

# Verify variable is set
echo $ANTHROPIC_API_KEY

# Check for syntax errors
cat .env | grep ANTHROPIC_API_KEY
```

### Variable Override Priority

Variables are loaded in this order (highest to lowest priority):

1. System environment variables
2. `.env.{environment}.local`
3. `.env.{environment}`
4. `.env.local`
5. `.env`

### Common Issues

**Issue**: Variables not loading
- **Solution**: Ensure `.env` is in project root
- Check file permissions: `chmod 600 .env`

**Issue**: Quotes in values
- **Solution**: Don't quote values in `.env` unless they contain spaces

```bash
# Correct
SECRET_KEY=my-secret-key

# Also correct (with spaces)
SECRET_KEY="my secret key with spaces"

# Incorrect (unnecessary quotes)
SECRET_KEY="my-secret-key"
```

---

## Validation Script

Create `scripts/validate-env.sh`:

```bash
#!/bin/bash

# Required variables
REQUIRED_VARS=(
  "ANTHROPIC_API_KEY"
  "DATABASE_URL"
  "SECRET_KEY"
  "ENVIRONMENT"
)

# Check each required variable
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required variable: $var"
    exit 1
  else
    echo "✅ $var is set"
  fi
done

echo "✅ All required environment variables are set"
```

Run validation:
```bash
chmod +x scripts/validate-env.sh
./scripts/validate-env.sh
```

---

## Reference

- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [Coolify Documentation](https://coolify.io/docs)

---

**Last Updated**: 2025-10-09
