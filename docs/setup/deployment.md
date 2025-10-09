# Coolify Deployment Guide

Complete guide for deploying the Wissen & Handeln website to Coolify.

## What is Coolify?

Coolify is an open-source, self-hostable alternative to Heroku and Netlify. It provides:

- Docker-based deployments
- Automatic SSL certificates
- GitHub integration
- Environment variable management
- Automated backups
- Zero-downtime deployments

Official site: https://coolify.io

## Prerequisites

### Coolify Server Setup

1. **Install Coolify** (on your server):
   ```bash
   # Minimum requirements: 2 CPU, 2GB RAM, Ubuntu 20.04+
   wget -q https://get.coollabs.io/coolify/install.sh -O - | sudo bash
   ```

2. **Access Coolify Dashboard**:
   - Navigate to `http://your-server-ip:8000`
   - Complete initial setup wizard
   - Set admin credentials

### Local Requirements

- Git repository with project code
- GitHub account (or GitLab/Bitbucket)
- Environment variables prepared
- Database backup (if migrating)

## Step 1: Prepare Project for Deployment

### Create Dockerfile

Create `/Dockerfile` in project root:

```dockerfile
# For Node.js projects
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application (if needed)
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

Or for Python/Django:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
```

### Create docker-compose.yml (Optional)

For multi-service deployments:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=wissen_handeln
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Create .dockerignore

```
node_modules/
.git/
.env
.env.local
*.log
.hive-mind/
.swarm/
memory/
coordination/
tests/
docs/
*.md
.gitignore
```

### Add Health Check Endpoint

Coolify uses health checks for zero-downtime deployments.

```javascript
// For Express.js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
```

```python
# For Django - add to urls.py
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'healthy'})

urlpatterns = [
    path('health/', health_check),
    # ... other urls
]
```

## Step 2: Configure Coolify Project

### Create New Application

1. **Log into Coolify Dashboard**
2. **Click "New Application"**
3. **Select Application Type**:
   - Choose "Docker" or "Docker Compose"
   - Select "Build from GitHub"

4. **Connect Repository**:
   - Authorize GitHub access
   - Select repository: `wissen-handeln-website`
   - Choose branch: `main` or `production`

### Configure Build Settings

1. **Build Configuration**:
   - Build pack: `Dockerfile`
   - Build command: (automatic from Dockerfile)
   - Dockerfile location: `./Dockerfile`

2. **Port Configuration**:
   - Application port: `3000` (or `8000` for Python)
   - Public port: `80` (auto-redirects to 443)

3. **Domain Settings**:
   - Add domain: `wissen-handeln.com`
   - Enable SSL: ✓ (automatic Let's Encrypt)
   - Force HTTPS: ✓

## Step 3: Configure Environment Variables

### Add Environment Variables in Coolify

Navigate to Application → Environment Variables:

```bash
# AI Configuration
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Database
DATABASE_URL=postgresql://user:pass@postgres:5432/wissen_handeln

# Application
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-production-secret-key-here

# Server
HOST=0.0.0.0
PORT=3000

# Claude Flow
CLAUDE_FLOW_ENABLED=true
HIVE_MIND_ENABLED=false  # Disable in production

# Logging
LOG_LEVEL=info
```

### Sensitive Variables

For sensitive data:
1. Use Coolify's "Secret" toggle for each variable
2. Never commit secrets to Git
3. Use different keys for staging/production

## Step 4: Configure Database

### Option A: External Database

Use managed database (recommended for production):

```bash
# Example with Supabase
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres

# Or with Railway
DATABASE_URL=postgresql://postgres:xxx@containers-us-west-xxx.railway.app:6789/railway
```

### Option B: Coolify PostgreSQL

1. **Create Database Service**:
   - Click "Add Database"
   - Select PostgreSQL
   - Configure: Name, user, password

2. **Link to Application**:
   - Coolify automatically provides internal URL
   - Use in `DATABASE_URL` variable

3. **Run Migrations**:
   ```bash
   # Add to deployment script
   python manage.py migrate  # Django
   npx prisma migrate deploy  # Prisma
   ```

## Step 5: Configure Build & Deploy Scripts

### Add Build Scripts to package.json

```json
{
  "scripts": {
    "build": "your-build-command",
    "start": "node dist/server.js",
    "deploy": "npm run build && npm run migrate",
    "migrate": "npx prisma migrate deploy"
  }
}
```

### Create Deployment Hook Script

Create `/scripts/deploy.sh`:

```bash
#!/bin/bash
set -e

echo "Starting deployment..."

# Run database migrations
if [ "$ENVIRONMENT" = "production" ]; then
  echo "Running migrations..."
  python manage.py migrate --noinput
fi

# Collect static files (Django)
if [ -f "manage.py" ]; then
  python manage.py collectstatic --noinput
fi

# Clear cache (if applicable)
echo "Clearing cache..."
# python manage.py clear_cache

echo "Deployment complete!"
```

Make executable:
```bash
chmod +x scripts/deploy.sh
```

### Configure in Coolify

1. **Pre-deployment command**:
   ```bash
   ./scripts/deploy.sh
   ```

2. **Post-deployment command**:
   ```bash
   curl -X POST https://wissen-handeln.com/health
   ```

## Step 6: Configure Automatic Deployments

### GitHub Webhook

Coolify automatically configures webhooks for:
- Push to main branch → Auto-deploy
- Pull request merge → Auto-deploy

### Manual Configuration

If needed:
1. Go to GitHub Repository → Settings → Webhooks
2. Add webhook URL from Coolify
3. Select events: Push, Pull Request
4. Save webhook

### Deployment Branches

Configure in Coolify:
- **Production**: `main` or `production` branch
- **Staging**: `staging` or `develop` branch

## Step 7: Configure SSL/TLS

### Automatic SSL (Recommended)

Coolify auto-provisions Let's Encrypt certificates:

1. Navigate to Application → Domains
2. Add domain: `wissen-handeln.com`
3. Enable SSL toggle
4. Certificate auto-generates in ~2 minutes

### Custom SSL Certificate

For custom certificates:

1. Navigate to Application → SSL
2. Upload certificate files:
   - Certificate (`.crt`)
   - Private key (`.key`)
   - Chain file (`.ca-bundle`)

## Step 8: Initial Deployment

### Deploy Application

1. **Verify Configuration**:
   - ✓ Repository connected
   - ✓ Environment variables set
   - ✓ Database configured
   - ✓ Domain added
   - ✓ SSL enabled

2. **Trigger Deployment**:
   - Click "Deploy" button
   - Monitor build logs
   - Wait for completion (2-5 minutes)

3. **Verify Deployment**:
   ```bash
   # Check health endpoint
   curl https://wissen-handeln.com/health

   # Test application
   curl https://wissen-handeln.com/
   ```

## Step 9: Post-Deployment Tasks

### Create Superuser/Admin (if applicable)

```bash
# For Django applications
# SSH into Coolify container or use console
python manage.py createsuperuser
```

### Seed Database (if needed)

```bash
# Run seed script
python manage.py loaddata initial_data.json
```

### Test AI Integration

```bash
# Test content generation endpoint
curl -X POST https://wissen-handeln.com/api/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"prompt": "Generate test content"}'
```

### Configure Monitoring

1. Enable Coolify monitoring
2. Set up uptime alerts
3. Configure log aggregation

## Ongoing Maintenance

### Zero-Downtime Deployments

Coolify automatically handles:
- Health checks before switching traffic
- Gradual traffic migration
- Automatic rollback on failure

### Rollback Procedure

If deployment fails:

1. **Automatic Rollback**:
   - Coolify auto-reverts on health check failure

2. **Manual Rollback**:
   - Navigate to Deployments
   - Select previous successful deployment
   - Click "Redeploy"

### Database Backups

Configure automatic backups:

1. Navigate to Database → Backups
2. Enable automatic backups
3. Set schedule: Daily at 2 AM UTC
4. Retention: 7 days

### Monitoring & Logs

Access logs:
```bash
# Application logs
Coolify Dashboard → Application → Logs

# Database logs
Coolify Dashboard → Database → Logs
```

## Troubleshooting

### Build Failures

```bash
# Check build logs in Coolify
# Common issues:
- Missing environment variables
- Dependency installation failures
- Build command errors

# Fix: Update Dockerfile or environment config
```

### Application Won't Start

```bash
# Check:
1. Port configuration matches Dockerfile EXPOSE
2. Health check endpoint responds
3. Database connection works
4. All required environment variables set
```

### SSL Certificate Issues

```bash
# Regenerate certificate
Coolify Dashboard → SSL → Regenerate

# Verify DNS points to Coolify server
dig wissen-handeln.com
```

### Database Connection Errors

```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Check database is running
Coolify Dashboard → Database → Status

# Test connection from app
psql $DATABASE_URL
```

## Performance Optimization

### Enable Caching

```bash
# Add Redis for caching
Coolify → Add Database → Redis

# Update environment
REDIS_URL=redis://redis:6379/0
```

### Configure CDN

Use Cloudflare in front of Coolify:
1. Point DNS to Cloudflare
2. Configure Cloudflare → Coolify origin
3. Enable caching rules

### Horizontal Scaling

For high traffic:
1. Coolify Dashboard → Scale
2. Increase instance count
3. Load balancer auto-configured

## Security Checklist

- [ ] SSL/TLS enabled and working
- [ ] Environment variables secured
- [ ] Database not publicly accessible
- [ ] Firewall configured
- [ ] Secrets rotated regularly
- [ ] Automatic security updates enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured

## Next Steps

- Set up [Monitoring](../operations/monitoring.md)
- Configure [CI/CD Pipeline](../development/cicd.md)
- Review [Security Best Practices](../operations/security.md)

---

**Deployment Complete!** Your application is now live at https://wissen-handeln.com
