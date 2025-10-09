# Deployment Architecture
## wissen-handeln.com - Coolify Production Deployment

### Deployment Overview

This document details the complete production deployment architecture for wissen-handeln.com using Coolify on server 173.249.21.101.

### Infrastructure Stack

```
┌─────────────────────────────────────────────────────────────┐
│             Server: 173.249.21.101                           │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               Coolify Platform                         │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         Docker Engine                            │  │ │
│  │  │  ┌────────────────────────────────────────────┐  │  │ │
│  │  │  │  Nginx Reverse Proxy (Coolify Managed)     │  │  │ │
│  │  │  │  - SSL/TLS termination                     │  │  │ │
│  │  │  │  - HTTPS redirect                          │  │  │ │
│  │  │  │  - Gzip/Brotli compression                 │  │  │ │
│  │  │  │  - Static file caching                     │  │  │ │
│  │  │  └────────────────────────────────────────────┘  │  │ │
│  │  │  ┌────────────────────────────────────────────┐  │  │ │
│  │  │  │  Application Container                     │  │  │ │
│  │  │  │  - Node.js 20 Alpine                       │  │  │ │
│  │  │  │  - Astro Build Output                      │  │  │ │
│  │  │  │  - Port 4321 (internal)                    │  │  │ │
│  │  │  └────────────────────────────────────────────┘  │  │ │
│  │  │  ┌────────────────────────────────────────────┐  │  │ │
│  │  │  │  Coolify Services                          │  │  │ │
│  │  │  │  - Health monitoring                       │  │  │ │
│  │  │  │  - Log aggregation                         │  │  │ │
│  │  │  │  - Metrics collection                      │  │  │ │
│  │  │  └────────────────────────────────────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Docker Configuration

#### Multi-Stage Dockerfile

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with caching
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build arguments for environment variables
ARG ANTHROPIC_API_KEY
ARG PUBLIC_SITE_URL
ARG NODE_ENV=production

# Set environment variables for build
ENV ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL
ENV NODE_ENV=$NODE_ENV

# Type check
RUN npm run typecheck

# Build Astro site
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --only=production --prefer-offline --no-audit

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Copy necessary config files
COPY astro.config.mjs ./

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro && \
    chown -R astro:nodejs /app

# Switch to non-root user
USER astro

# Expose port (internal)
EXPOSE 4321

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4321/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start command
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4321"]
```

#### .dockerignore

```
node_modules
.git
.github
.vscode
.astro
dist
.env
.env.*
!.env.example
*.log
.DS_Store
coverage
tests
docs
*.md
!README.md
.editorconfig
.prettierrc
.eslintrc
```

### Coolify Configuration

#### .coolify.json

```json
{
  "version": "1.0",
  "name": "wissen-handeln",
  "description": "AI-powered content platform",
  "type": "dockerfile",
  "build": {
    "dockerfile": "Dockerfile",
    "context": ".",
    "args": {
      "NODE_ENV": "production"
    }
  },
  "deploy": {
    "port": 4321,
    "healthcheck": {
      "enabled": true,
      "path": "/health",
      "interval": 30,
      "timeout": 10,
      "retries": 3
    },
    "replicas": 1,
    "resources": {
      "limits": {
        "memory": "1024M",
        "cpu": "1.0"
      },
      "reservations": {
        "memory": "512M",
        "cpu": "0.5"
      }
    }
  },
  "environment": {
    "required": [
      "ANTHROPIC_API_KEY",
      "PUBLIC_SITE_URL"
    ],
    "optional": [
      "BUILD_CACHE_ENABLED",
      "LOG_LEVEL"
    ]
  },
  "volumes": [
    {
      "source": "build-cache",
      "target": "/app/.astro"
    }
  ],
  "networks": [
    "coolify-network"
  ],
  "labels": {
    "app": "wissen-handeln",
    "environment": "production",
    "managed-by": "coolify"
  }
}
```

### Environment Variables

#### Production Environment (Coolify)

```bash
# API Keys (Secrets - stored in Coolify)
ANTHROPIC_API_KEY=sk-ant-***                    # Required
GITHUB_TOKEN=ghp_***                            # Optional (for GitHub integration)

# Application Configuration
NODE_ENV=production                              # Required
PUBLIC_SITE_URL=https://wissen-handeln.com      # Required
BASE_URL=/                                       # Optional (default: /)

# Build Configuration
BUILD_CACHE_ENABLED=true                         # Optional (default: false)
ASTRO_TELEMETRY_DISABLED=1                      # Optional

# Feature Flags
ENABLE_AI_GENERATION=true                        # Optional (default: true)
ENABLE_SEARCH=false                              # Optional (default: false)
ENABLE_COMMENTS=false                            # Optional (default: false)

# Performance Configuration
MAX_CONCURRENT_BUILDS=1                          # Optional
IMAGE_OPTIMIZATION_LEVEL=80                      # Optional (quality)

# Logging
LOG_LEVEL=info                                   # Optional (error|warn|info|debug)
LOG_FORMAT=json                                  # Optional (json|pretty)

# Rate Limiting
AI_RATE_LIMIT_RPM=10                            # Optional (requests per minute)
API_TIMEOUT_MS=30000                            # Optional (30 seconds)

# Caching
RESPONSE_CACHE_TTL=3600                         # Optional (1 hour in seconds)
STATIC_CACHE_MAX_AGE=31536000                   # Optional (1 year in seconds)
```

#### .env.example (Repository)

```bash
# API Keys (NEVER commit real keys)
ANTHROPIC_API_KEY=sk-ant-your-key-here
GITHUB_TOKEN=ghp-your-token-here

# Application Configuration
NODE_ENV=development
PUBLIC_SITE_URL=http://localhost:4321

# Build Configuration
BUILD_CACHE_ENABLED=false
ASTRO_TELEMETRY_DISABLED=1

# Feature Flags
ENABLE_AI_GENERATION=true
ENABLE_SEARCH=false
ENABLE_COMMENTS=false

# Logging
LOG_LEVEL=debug
LOG_FORMAT=pretty

# Rate Limiting
AI_RATE_LIMIT_RPM=10
API_TIMEOUT_MS=30000
```

### CI/CD Pipeline

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  NODE_VERSION: '20'

jobs:
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run typecheck

      - name: Run tests
        run: npm run test

  build-test:
    name: Test Build
    runs-on: ubuntu-latest
    needs: lint-and-test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site
        run: npm run build
        env:
          PUBLIC_SITE_URL: https://wissen-handeln.com
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Check build output
        run: |
          if [ ! -d "dist" ]; then
            echo "Build failed: dist directory not found"
            exit 1
          fi
          echo "Build successful: $(du -sh dist)"

  deploy:
    name: Deploy to Coolify
    runs-on: ubuntu-latest
    needs: build-test
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Trigger Coolify deployment
        run: |
          curl -X POST "${{ secrets.COOLIFY_WEBHOOK_URL }}" \
            -H "Content-Type: application/json" \
            -d '{"ref": "refs/heads/main", "repository": "${{ github.repository }}"}'

      - name: Wait for deployment
        run: sleep 60

      - name: Health check
        run: |
          for i in {1..10}; do
            if curl -f -s https://wissen-handeln.com/health > /dev/null; then
              echo "Deployment successful!"
              exit 0
            fi
            echo "Waiting for deployment... (attempt $i/10)"
            sleep 10
          done
          echo "Deployment health check failed"
          exit 1

      - name: Notify on failure
        if: failure()
        run: |
          echo "Deployment failed! Check Coolify logs."
          # Add notification logic (Slack, email, etc.)
```

### Deployment Process

#### Automated Deployment Flow

```
1. Developer pushes to main branch
   ↓
2. GitHub Actions triggered
   ├── Lint & Type Check
   ├── Run Tests
   └── Test Build
   ↓
3. Webhook triggers Coolify
   ↓
4. Coolify pulls latest code
   ↓
5. Docker build process
   ├── Stage 1: Build
   │   ├── Install dependencies
   │   ├── Type check
   │   └── Build Astro site
   ├── Stage 2: Production
   │   ├── Copy build artifacts
   │   ├── Install production deps
   │   └── Create container image
   ↓
6. Container deployment
   ├── Stop old container
   ├── Start new container
   ├── Health check (30s max)
   └── Traffic switch
   ↓
7. Post-deployment
   ├── Log aggregation
   ├── Metrics collection
   └── Cleanup old images
```

#### Manual Deployment (Emergency)

```bash
# SSH into Coolify server
ssh root@173.249.21.101

# Navigate to Coolify projects
cd /var/lib/coolify/applications/wissen-handeln

# Pull latest changes
git pull origin main

# Rebuild and deploy
docker compose up -d --build

# Check logs
docker compose logs -f

# Health check
curl http://localhost:4321/health
```

### Health Check Endpoint

```typescript
// src/pages/health.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // Basic health check
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  };

  // Optional: Check dependencies
  try {
    // Check if build directory exists
    const fs = await import('fs');
    const distExists = fs.existsSync('./dist');

    if (!distExists) {
      health.status = 'degraded';
      health.error = 'Build directory not found';
    }
  } catch (error) {
    health.status = 'unhealthy';
    health.error = error.message;
  }

  const statusCode = health.status === 'ok' ? 200 : 503;

  return new Response(JSON.stringify(health, null, 2), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};
```

### Nginx Configuration (Coolify Managed)

```nginx
# Coolify automatically generates this configuration
# This is for reference only

upstream wissen_handeln {
  server localhost:4321;
  keepalive 64;
}

server {
  listen 80;
  server_name wissen-handeln.com www.wissen-handeln.com;

  # HTTPS redirect
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name wissen-handeln.com www.wissen-handeln.com;

  # SSL configuration (Let's Encrypt)
  ssl_certificate /etc/letsencrypt/live/wissen-handeln.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/wissen-handeln.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # Compression
  gzip on;
  gzip_vary on;
  gzip_min_length 1024;
  gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

  # Static file caching
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
    proxy_pass http://wissen_handeln;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Dynamic content
  location / {
    proxy_pass http://wissen_handeln;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }

  # Health check
  location /health {
    access_log off;
    proxy_pass http://wissen_handeln/health;
  }
}
```

### Monitoring & Logging

#### Log Aggregation

```bash
# View application logs
docker logs -f wissen-handeln-app --tail=100

# View Nginx logs
docker logs -f coolify-proxy --tail=100

# Export logs for analysis
docker logs wissen-handeln-app > /var/log/wissen-handeln.log
```

#### Metrics Collection

```typescript
// src/lib/metrics.ts
export class MetricsCollector {
  static async collectMetrics() {
    return {
      timestamp: new Date().toISOString(),
      container: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
      requests: {
        total: globalThis.requestCount || 0,
        errors: globalThis.errorCount || 0,
      },
    };
  }
}
```

#### Alerting (Future Enhancement)

```yaml
# alerts.yml (for future integration)
alerts:
  - name: high_error_rate
    condition: error_rate > 5%
    duration: 5m
    notification: email, slack

  - name: high_memory_usage
    condition: memory_usage > 90%
    duration: 10m
    notification: email

  - name: deployment_failure
    condition: health_check_failed
    duration: 2m
    notification: email, slack, sms
```

### Backup & Recovery

#### Backup Strategy

```bash
# Automated backup script (run via cron)
#!/bin/bash

# Backup content
tar -czf /backups/wissen-handeln-content-$(date +%Y%m%d).tar.gz \
  /var/lib/coolify/applications/wissen-handeln/src/content

# Backup configuration
tar -czf /backups/wissen-handeln-config-$(date +%Y%m%d).tar.gz \
  /var/lib/coolify/applications/wissen-handeln/.env \
  /var/lib/coolify/applications/wissen-handeln/.coolify.json

# Keep only last 30 days
find /backups -name "wissen-handeln-*" -mtime +30 -delete
```

#### Recovery Procedure

```bash
# 1. Stop current deployment
docker compose down

# 2. Restore from backup
tar -xzf /backups/wissen-handeln-content-YYYYMMDD.tar.gz -C /

# 3. Rebuild and deploy
docker compose up -d --build

# 4. Verify health
curl http://localhost:4321/health
```

### Rollback Procedure

```bash
# Using Coolify UI
1. Navigate to Application > Deployments
2. Select previous successful deployment
3. Click "Rollback"
4. Confirm action

# Manual rollback
docker tag wissen-handeln:previous wissen-handeln:latest
docker compose up -d
```

### Security Considerations

#### Container Security
- Non-root user (astro:nodejs)
- Minimal Alpine base image
- No unnecessary packages
- Regular security updates

#### Network Security
- Internal Docker network
- Nginx reverse proxy only
- SSL/TLS termination
- HTTPS enforcement

#### Secrets Management
- Environment variables in Coolify
- No secrets in repository
- API key rotation strategy
- Access logging

### Performance Optimization

#### Build Optimization
```dockerfile
# Layer caching
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
```

#### Runtime Optimization
- Gzip/Brotli compression
- Static asset caching (1 year)
- HTTP/2 enabled
- CDN-ready headers

### Scaling Strategy

#### Vertical Scaling (Current)
- Increase container resources
- Monitor CPU/Memory usage
- Adjust limits in .coolify.json

#### Horizontal Scaling (Future)
- Multiple container replicas
- Load balancer (Nginx upstream)
- Shared cache (Redis)
- Database for sessions

---

**Document Version**: 1.0
**Last Updated**: 2025-10-09
**Owner**: Architecture Team
**Status**: Active
