# Docker Commands for Angular Calculator App

## Requirements
- **Node.js**: >=20.19.0 (for Angular 18+ and ESLint 9+)
- **npm**: >=8.0.0
- **Docker**: Latest version

## Quick Start Commands

### Production Build & Run
```bash
# Build and run production version
docker-compose up angular-calculator-prod

# Run in detached mode
docker-compose up -d angular-calculator-prod

# Access the app at http://localhost:8080
```

### Development Mode
```bash
# Run development version with live reload
docker-compose --profile dev up angular-calculator-dev

# Access the app at http://localhost:4200
```

### Running Tests
```bash
# Run unit tests in container
docker-compose --profile test up angular-calculator-test

# Run tests and exit
docker-compose --profile test run --rm angular-calculator-test
```

### Useful Commands
```bash
# Build production image only
docker-compose build angular-calculator-prod

# Stop all services
docker-compose down

# Remove containers and volumes
docker-compose down -v

# View logs
docker-compose logs angular-calculator-prod

# Rebuild without cache
docker-compose build --no-cache angular-calculator-prod
```

## CI/CD Integration

### Building for Production
```bash
# Build production image
docker build -t angular-calculator:latest .

# Tag for registry
docker tag angular-calculator:latest your-registry/angular-calculator:v1.0.0

# Push to registry
docker push your-registry/angular-calculator:v1.0.0
```

### Environment Variables
You can override environment variables in docker-compose.override.yml:

```yaml
version: '3.8'
services:
  angular-calculator-prod:
    environment:
      - NODE_ENV=production
      - API_URL=https://your-api-url.com
```