#!/bin/bash

# ================================
# Health Check & Monitoring Script
# ================================
# Monitors the deployed application on Coolify
# Server: 173.249.21.101

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
COOLIFY_SERVER="${COOLIFY_SERVER:-173.249.21.101}"
PUBLIC_SITE_URL="${PUBLIC_SITE_URL:-}"
HEALTH_ENDPOINT="/health"
CHECK_INTERVAL="${CHECK_INTERVAL:-30}"
ALERT_EMAIL="${ALERT_EMAIL:-}"

# Functions
log_info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Check if site is reachable
check_site_health() {
    local url="$1"
    local endpoint="${url}${HEALTH_ENDPOINT}"

    if curl -f -s -o /dev/null -w "%{http_code}" "$endpoint" | grep -q "200"; then
        return 0
    else
        return 1
    fi
}

# Check response time
check_response_time() {
    local url="$1"
    local response_time=$(curl -o /dev/null -s -w "%{time_total}" "$url")
    echo "$response_time"
}

# Check SSL certificate
check_ssl_certificate() {
    local url="$1"

    if [[ $url == https://* ]]; then
        local domain=$(echo "$url" | sed -e 's|^https://||' -e 's|/.*$||')
        local expiry_date=$(echo | openssl s_client -servername "$domain" -connect "${domain}:443" 2>/dev/null | \
                           openssl x509 -noout -dates 2>/dev/null | grep notAfter | cut -d= -f2)

        if [ -n "$expiry_date" ]; then
            log_info "SSL Certificate expires: $expiry_date"

            # Calculate days until expiry
            local expiry_epoch=$(date -j -f "%b %d %T %Y %Z" "$expiry_date" "+%s" 2>/dev/null || echo "0")
            local current_epoch=$(date "+%s")
            local days_until_expiry=$(( ($expiry_epoch - $current_epoch) / 86400 ))

            if [ "$days_until_expiry" -lt 30 ]; then
                log_warning "SSL certificate expires in $days_until_expiry days!"
                return 1
            fi
        fi
    fi
    return 0
}

# Check Docker container status
check_docker_status() {
    log_info "Checking Docker container status..."

    # This requires SSH access to the Coolify server
    # Uncomment and configure if you have SSH access

    # ssh user@${COOLIFY_SERVER} "docker ps --filter name=wissen-handeln-website --format '{{.Status}}'"

    log_info "Docker status check requires SSH access to ${COOLIFY_SERVER}"
}

# Check disk space
check_disk_space() {
    log_info "Checking disk space..."

    # This requires SSH access to the Coolify server
    # ssh user@${COOLIFY_SERVER} "df -h | grep -E '^/dev/'"

    log_info "Disk space check requires SSH access to ${COOLIFY_SERVER}"
}

# Check memory usage
check_memory_usage() {
    log_info "Checking memory usage..."

    # This requires SSH access to the Coolify server
    # ssh user@${COOLIFY_SERVER} "free -h"

    log_info "Memory usage check requires SSH access to ${COOLIFY_SERVER}"
}

# Send alert
send_alert() {
    local message="$1"

    log_error "$message"

    if [ -n "$ALERT_EMAIL" ]; then
        # Send email alert (requires mail command or API)
        # echo "$message" | mail -s "Health Check Alert: wissen-handeln-website" "$ALERT_EMAIL"
        log_info "Alert email would be sent to: $ALERT_EMAIL"
    fi
}

# Comprehensive health check
comprehensive_health_check() {
    local url="$1"
    local all_checks_passed=true

    echo "========================================"
    log_info "Running comprehensive health check"
    log_info "Target: $url"
    echo "========================================"

    # Check 1: Site accessibility
    log_info "Checking site accessibility..."
    if check_site_health "$url"; then
        log_success "Site is accessible and healthy"
    else
        log_error "Site health check failed"
        send_alert "Site health check failed for $url"
        all_checks_passed=false
    fi

    # Check 2: Response time
    log_info "Checking response time..."
    local response_time=$(check_response_time "$url")
    log_info "Response time: ${response_time}s"

    if (( $(echo "$response_time > 3.0" | bc -l) )); then
        log_warning "Slow response time detected: ${response_time}s"
    else
        log_success "Response time is good"
    fi

    # Check 3: SSL certificate
    log_info "Checking SSL certificate..."
    if check_ssl_certificate "$url"; then
        log_success "SSL certificate is valid"
    else
        log_warning "SSL certificate issue detected"
    fi

    # Check 4: Docker status
    check_docker_status

    # Check 5: System resources
    check_disk_space
    check_memory_usage

    echo "========================================"
    if [ "$all_checks_passed" = true ]; then
        log_success "All health checks passed"
        return 0
    else
        log_error "Some health checks failed"
        return 1
    fi
}

# Continuous monitoring
continuous_monitoring() {
    local url="$1"

    log_info "Starting continuous monitoring (interval: ${CHECK_INTERVAL}s)"
    log_info "Press Ctrl+C to stop"

    while true; do
        comprehensive_health_check "$url"
        sleep "$CHECK_INTERVAL"
    done
}

# Quick status check
quick_status() {
    local url="$1"

    if check_site_health "$url"; then
        log_success "Site is healthy"
        exit 0
    else
        log_error "Site is down or unhealthy"
        exit 1
    fi
}

# Main function
main() {
    local mode="${1:-once}"
    local target_url="${PUBLIC_SITE_URL}"

    if [ -z "$target_url" ]; then
        log_error "PUBLIC_SITE_URL is not set"
        log_info "Usage: PUBLIC_SITE_URL=https://your-domain.com $0 [once|monitor|quick]"
        exit 1
    fi

    case "$mode" in
        once)
            comprehensive_health_check "$target_url"
            ;;
        monitor)
            continuous_monitoring "$target_url"
            ;;
        quick)
            quick_status "$target_url"
            ;;
        *)
            echo "Usage: $0 [once|monitor|quick]"
            echo "  once    - Run health check once (default)"
            echo "  monitor - Continuous monitoring"
            echo "  quick   - Quick status check (exit 0 if healthy)"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
