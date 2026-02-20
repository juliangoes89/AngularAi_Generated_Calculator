#!/bin/bash

# CI/CD Script for Angular Calculator App
# This script handles building, testing, and deploying the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default values
ENVIRONMENT="production"
REGISTRY=""
TAG="latest"
PUSH_TO_REGISTRY=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --registry)
            REGISTRY="$2"
            PUSH_TO_REGISTRY=true
            shift 2
            ;;
        --tag)
            TAG="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --env ENVIRONMENT     Set environment (development|production) [default: production]"
            echo "  --registry REGISTRY   Docker registry URL for pushing images"
            echo "  --tag TAG            Docker image tag [default: latest]"
            echo "  --help               Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Main execution
main() {
    log_info "Starting CI/CD pipeline for Angular Calculator App"
    log_info "Environment: $ENVIRONMENT"
    log_info "Tag: $TAG"
    
    # Check Node.js version
    NODE_VERSION=$(node --version)
    log_info "Node.js version: $NODE_VERSION"
    
    # Step 1: Install dependencies (if not in container)
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies..."
        npm ci
    fi
    
    # Step 2: Run linting
    log_info "Running linter..."
    npm run lint || log_warning "Linting issues found"
    
    # Step 3: Run unit tests
    log_info "Running unit tests..."
    npm run test:unit
    
    # Step 4: Build application
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "Building production Docker image..."
        docker build -t angular-calculator:$TAG .
        
        if [ "$PUSH_TO_REGISTRY" = true ]; then
            log_info "Tagging image for registry..."
            docker tag angular-calculator:$TAG $REGISTRY/angular-calculator:$TAG
            
            log_info "Pushing image to registry..."
            docker push $REGISTRY/angular-calculator:$TAG
        fi
    else
        log_info "Building development image..."
        docker build -f Dockerfile.dev -t angular-calculator:dev .
    fi
    
    log_info "Pipeline completed successfully!"
}

# Run main function
main