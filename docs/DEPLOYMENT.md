# Deployment Guide - Wissen & Handeln Website

## Overview

This document provides comprehensive instructions for deploying the Wissen & Handeln website to Coolify on server `173.249.21.101`.

## Prerequisites

- Access to Coolify instance at `173.249.21.101`
- Git repository set up and accessible
- Docker installed locally (for testing)
- Environment variables configured

## Quick Start

### 1. Local Testing

Before deploying to production, test the Docker build locally:

```bash
# Build the Docker image
docker build -t wissen-handeln-website .

# Run locally
docker run -p 8080:80 wissen-handeln-website

# Test health endpoint
curl http://localhost:8080/health

# Or use Docker Compose
cd config
docker-compose up
```

### 2. Deploy to Coolify

#### Option A: Automatic Deployment (Recommended)

1. Push your changes to the main branch:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

2. Coolify will automatically detect the changes and deploy

#### Option B: Using Deployment Script

```bash
# Full deployment with tests
./scripts/deploy.sh deploy

# Build only
./scripts/deploy.sh build

# Test only
./scripts/deploy.sh test

# Rollback
./scripts/deploy.sh rollback
```

## Configuration Files

### 1. Dockerfile (`/Dockerfile`)

Multi-stage build configuration:
- **Stage 1**: Builds the Astro site with Node.js
- **Stage 2**: Serves the built site with Nginx

Key features:
- Optimized layer caching
- Security-hardened Nginx configuration
- Built-in health checks
- Minimal production image size

### 2. Nginx Configuration (`/nginx.conf`)

Production-ready Nginx setup:
- Gzip compression enabled
- Security headers configured
- Static asset caching
- Health check endpoint at `/health`
- Custom error pages

### 3. Coolify Configuration (`/config/coolify.json`)

Deployment settings for Coolify:
- Auto-deployment enabled on main branch
- Health checks configured
- Resource limits set
- Logging enabled
- SSL/HTTPS configuration

### 4. Environment Variables (`/config/env.example`)

Copy to `.env` and configure:

```bash
# Required variables
PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production

# Optional variables
PUBLIC_API_URL=https://api.your-domain.com
COOLIFY_SERVER=173.249.21.101
```

## Coolify Setup

### Initial Configuration

1. **Add New Resource** in Coolify dashboard
2. **Select Resource Type**: Docker (Dockerfile)
3. **Configure Git Repository**:
   - Repository URL: Your Git repository
   - Branch: `main`
   - Build Pack: Docker

4. **Set Build Configuration**:
   - Dockerfile Location: `./Dockerfile`
   - Build Context: `.`
   - Auto Deploy: Enabled

5. **Configure Environment Variables**:
   - Add all variables from `config/env.example`
   - Mark sensitive variables as "secret"

6. **Set Domain**:
   - Add your custom domain
   - Enable SSL/TLS
   - Enable force HTTPS redirect

7. **Resource Limits**:
   - CPU: 1 core
   - Memory: 512MB (limit), 256MB (reservation)

8. **Health Checks**:
   - Endpoint: `/health`
   - Interval: 30s
   - Timeout: 3s
   - Retries: 3

### Watch Paths

Coolify will monitor these paths for changes:
- `src/**/*`
- `public/**/*`
- `astro.config.mjs`
- `package.json`

## Health Monitoring

### Using the Health Check Script

```bash
# One-time health check
PUBLIC_SITE_URL=https://your-domain.com ./scripts/health-check.sh once

# Continuous monitoring
PUBLIC_SITE_URL=https://your-domain.com ./scripts/health-check.sh monitor

# Quick status check (for CI/CD)
PUBLIC_SITE_URL=https://your-domain.com ./scripts/health-check.sh quick
```

### Monitoring Features

The health check script monitors:
- Site accessibility
- Response times
- SSL certificate validity
- Docker container status (requires SSH)
- System resources (requires SSH)

## Troubleshooting

### Build Fails

1. **Check build logs** in Coolify dashboard
2. **Verify Dockerfile** syntax:
   ```bash
   docker build -t test .
   ```
3. **Check dependencies** in `package.json`

### Deployment Fails

1. **Check Coolify logs** in the dashboard
2. **Verify environment variables** are set correctly
3. **Check health endpoint**:
   ```bash
   curl https://your-domain.com/health
   ```

### Container Keeps Restarting

1. **Check container logs** in Coolify
2. **Verify health check** endpoint is responding
3. **Check resource limits** (CPU/Memory)
4. **Verify Nginx configuration**:
   ```bash
   docker run --rm wissen-handeln-website nginx -t
   ```

### Slow Performance

1. **Check response times**:
   ```bash
   curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com
   ```
2. **Review Nginx caching** configuration
3. **Check resource usage** in Coolify metrics
4. **Enable gzip compression** (already configured)

### SSL Certificate Issues

1. **Verify DNS** is pointing to correct server
2. **Check Coolify SSL** configuration
3. **Force certificate renewal** in Coolify
4. **Verify certificate expiration**:
   ```bash
   ./scripts/health-check.sh once
   ```

## Performance Optimization

### Image Size Optimization

The multi-stage build already optimizes image size:
- Development dependencies excluded
- Only production files included
- Alpine Linux base images used

### Nginx Optimization

Current optimizations:
- Gzip compression enabled
- Static asset caching (1 year)
- Sendfile enabled
- TCP optimizations

### Additional Optimizations

Consider these for further improvements:
- **CDN**: Use Cloudflare or similar
- **Image Optimization**: Use Astro's image optimization
- **Code Splitting**: Leverage Astro's built-in code splitting
- **Preloading**: Add resource hints in HTML

## Rollback Procedure

### Using Coolify Dashboard

1. Navigate to your application in Coolify
2. Go to "Deployments" tab
3. Select previous successful deployment
4. Click "Redeploy"

### Using Git

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

## Security Considerations

### Implemented Security Measures

1. **Security Headers**:
   - X-Frame-Options: SAMEORIGIN
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection: enabled
   - Referrer-Policy configured

2. **Container Security**:
   - Non-root user in production
   - Minimal base image (Alpine)
   - No unnecessary packages

3. **Network Security**:
   - HTTPS enforced
   - HTTP to HTTPS redirect
   - SSL/TLS configured

### Recommended Additional Measures

1. **Content Security Policy**: Add CSP headers
2. **Rate Limiting**: Configure in Nginx or Cloudflare
3. **DDoS Protection**: Use Cloudflare or similar
4. **Regular Updates**: Keep dependencies updated
5. **Secrets Management**: Use Coolify's secret management

## Maintenance

### Regular Tasks

1. **Monitor Health**: Run health checks daily
2. **Check Logs**: Review application logs weekly
3. **Update Dependencies**: Monthly security updates
4. **SSL Renewal**: Automatic via Let's Encrypt
5. **Backup**: Configure backup strategy in Coolify

### Update Procedure

```bash
# 1. Update dependencies
npm update

# 2. Test locally
npm run build
docker build -t wissen-handeln-website .
docker run -p 8080:80 wissen-handeln-website

# 3. Deploy
git add package-lock.json
git commit -m "Update dependencies"
git push origin main
```

## Support and Resources

- **Coolify Documentation**: https://coolify.io/docs
- **Astro Documentation**: https://docs.astro.build
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Docker Documentation**: https://docs.docker.com

## Deployment Checklist

Before going live, ensure:

- [ ] All environment variables are set in Coolify
- [ ] Custom domain is configured and DNS is updated
- [ ] SSL certificate is issued and valid
- [ ] Health checks are passing
- [ ] Build completes successfully
- [ ] Site is accessible via HTTPS
- [ ] All pages load correctly
- [ ] Static assets are loading
- [ ] Forms work correctly (if applicable)
- [ ] Analytics are tracking (if configured)
- [ ] Error pages display correctly
- [ ] Performance is acceptable (< 3s load time)
- [ ] Security headers are present
- [ ] Backups are configured

## Contact

For issues or questions regarding deployment:
- Check Coolify dashboard logs
- Review this documentation
- Test locally first
- Contact system administrator if needed

---

**Last Updated**: 2025-10-09
**Server**: 173.249.21.101
**Platform**: Coolify
