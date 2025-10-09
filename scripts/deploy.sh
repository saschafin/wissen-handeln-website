#!/bin/bash

# ================================
# Deployment Script for Coolify
# ================================
# This script handles the deployment process for the Wissen & Handeln website
# Server: 173.249.21.101

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="wissen-handeln-website"
DOCKER_IMAGE="${PROJECT_NAME}:latest"
COOLIFY_SERVER="${COOLIFY_SERVER:-173.249.21.101}"
BUILD_OUTPUT_DIR="${BUILD_OUTPUT_DIR:-dist}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Pre-deployment checks
pre_deployment_checks() {
    log_info "Running pre-deployment checks..."

    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    # Check if required files exist
    if [ ! -f "Dockerfile" ]; then
        log_error "Dockerfile not found in current directory"
        exit 1
    fi

    if [ ! -f "nginx.conf" ]; then
        log_error "nginx.conf not found in current directory"
        exit 1
    fi

    log_success "Pre-deployment checks passed"
}

# Build Docker image
build_image() {
    log_info "Building Docker image..."

    docker build \
        --tag "${DOCKER_IMAGE}" \
        --file Dockerfile \
        --no-cache \
        .

    log_success "Docker image built successfully: ${DOCKER_IMAGE}"
}

# Test image locally
test_image() {
    log_info "Testing Docker image locally..."

    # Stop any existing test container
    docker rm -f "${PROJECT_NAME}-test" 2>/dev/null || true

    # Run test container
    docker run -d \
        --name "${PROJECT_NAME}-test" \
        -p 8080:80 \
        "${DOCKER_IMAGE}"

    # Wait for container to start
    sleep 5

    # Test health endpoint
    if curl -f http://localhost:8080/health &> /dev/null; then
        log_success "Health check passed"
    else
        log_error "Health check failed"
        docker logs "${PROJECT_NAME}-test"
        docker rm -f "${PROJECT_NAME}-test"
        exit 1
    fi

    # Test main page
    if curl -f http://localhost:8080/ &> /dev/null; then
        log_success "Main page accessible"
    else
        log_warning "Main page returned non-200 status"
    fi

    # Cleanup test container
    docker rm -f "${PROJECT_NAME}-test"
    log_success "Local testing completed"
}

# Deploy to Coolify
deploy_to_coolify() {
    log_info "Deploying to Coolify server: ${COOLIFY_SERVER}"

    # This section depends on your Coolify setup
    # Option 1: Git-based deployment (recommended)
    if [ -d ".git" ]; then
        log_info "Git repository detected. Pushing to remote..."
        git add .
        git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || true
        git push origin main
        log_success "Changes pushed to repository. Coolify will auto-deploy."
    else
        log_warning "No git repository found. Manual deployment required."
        log_info "Please configure Coolify to pull from your repository."
    fi

    # Option 2: Direct Docker deployment (if SSH access is configured)
    # Uncomment and configure if you have SSH access to Coolify server
    # log_info "Deploying via SSH to ${COOLIFY_SERVER}..."
    # ssh user@${COOLIFY_SERVER} "cd /path/to/project && docker-compose up -d"
}

# Post-deployment verification
post_deployment_verification() {
    log_info "Running post-deployment verification..."

    # Wait for deployment to complete
    sleep 10

    # Check if site is accessible (update with your actual domain)
    if [ -n "${PUBLIC_SITE_URL:-}" ]; then
        log_info "Checking ${PUBLIC_SITE_URL}..."
        if curl -f "${PUBLIC_SITE_URL}/health" &> /dev/null; then
            log_success "Deployment verified: Site is accessible"
        else
            log_warning "Unable to verify deployment. Please check manually."
        fi
    else
        log_warning "PUBLIC_SITE_URL not set. Skipping verification."
    fi
}

# Rollback function
rollback() {
    log_warning "Rolling back deployment..."
    # Implement rollback logic based on your Coolify setup
    log_info "Please use Coolify dashboard to rollback to previous version"
}

# Main deployment flow
main() {
    log_info "Starting deployment process for ${PROJECT_NAME}"
    echo "========================================"

    # Run deployment steps
    pre_deployment_checks
    build_image
    test_image
    deploy_to_coolify
    post_deployment_verification

    echo "========================================"
    log_success "Deployment completed successfully!"
    log_info "Monitor your deployment at: http://${COOLIFY_SERVER}"
}

# Handle script arguments
case "${1:-deploy}" in
    deploy)
        main
        ;;
    build)
        pre_deployment_checks
        build_image
        ;;
    test)
        test_image
        ;;
    rollback)
        rollback
        ;;
    *)
        echo "Usage: $0 {deploy|build|test|rollback}"
        exit 1
        ;;
esac
