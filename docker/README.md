# Docker Configuration

This directory contains Docker-related files for containerizing the multi-agent system.

## Files

- `docker-compose.yml` - Multi-service Docker composition
- `Dockerfile.backend` - Backend container configuration
- `Dockerfile.frontend` - Frontend container configuration
- `nginx.conf` - Nginx configuration for production
- `.dockerignore` - Docker ignore patterns

## Usage

```bash
# Build and run all services
docker-compose up --build

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d
```
