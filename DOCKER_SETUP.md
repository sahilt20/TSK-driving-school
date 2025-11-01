# Docker Setup Guide for Cricket Club Platform

This guide will help you run the Cricket Club Platform using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or higher)
- Supabase account (for cloud database) OR use the local PostgreSQL instance

## Quick Start with Docker Compose

### Option 1: Using Supabase Cloud (Recommended)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a free account
   - Create a new project
   - Note down your project URL and anon key from Settings → API

2. **Set up the database schema**
   - In your Supabase project, go to SQL Editor
   - Copy the contents of `supabase/schema.sql`
   - Paste and run it in the SQL Editor

3. **Configure Environment Variables**

   Create a `.env` file in the project root:
   ```bash
   cp .env.local.example .env
   ```

   Update the `.env` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Build and Run with Docker Compose**
   ```bash
   # Build the Docker image
   docker-compose build

   # Start the application
   docker-compose up -d app

   # View logs
   docker-compose logs -f app
   ```

5. **Access the Application**
   - Open your browser and go to: http://localhost:3000
   - You should see the Cricket Club Platform landing page

### Option 2: Using Local PostgreSQL (For Development)

If you want to run everything locally without Supabase Cloud:

1. **Update docker-compose.yml**

   Uncomment the PostgreSQL service (it's already included by default).

2. **Configure Environment for Local Database**

   Create a `.env` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-local-service-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   **Note:** For local PostgreSQL without Supabase, you'll need to set up Supabase CLI locally. See [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development) for more details.

3. **Start All Services**
   ```bash
   docker-compose up -d

   # Check that all services are running
   docker-compose ps
   ```

## Docker Commands Reference

### Build and Start

```bash
# Build the Docker image
docker-compose build

# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d app

# Start with logs in foreground
docker-compose up
```

### Logs and Debugging

```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app

# View last 100 lines
docker-compose logs --tail=100 app
```

### Stop and Restart

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete your local database data)
docker-compose down -v

# Restart a service
docker-compose restart app

# Rebuild and restart
docker-compose up -d --build app
```

### Database Management

```bash
# Access PostgreSQL container
docker-compose exec postgres psql -U cricket_user -d cricket_db

# Import schema manually
docker-compose exec -T postgres psql -U cricket_user -d cricket_db < supabase/schema.sql

# Backup database
docker-compose exec postgres pg_dump -U cricket_user cricket_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U cricket_user -d cricket_db < backup.sql
```

### Inspect and Troubleshoot

```bash
# Check running containers
docker-compose ps

# Inspect container details
docker inspect cricket-platform-app

# Execute commands inside container
docker-compose exec app sh

# Check container resource usage
docker stats cricket-platform-app

# View network configuration
docker network inspect cricket-field-planner_cricket-network
```

## Production Deployment

### Building for Production

```bash
# Build production image with tag
docker build -t cricket-platform:latest .

# Run production container
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  -e SUPABASE_SERVICE_ROLE_KEY=your-service-key \
  --name cricket-platform \
  cricket-platform:latest
```

### Docker Hub Deployment

```bash
# Tag for Docker Hub
docker tag cricket-platform:latest username/cricket-platform:latest

# Push to Docker Hub
docker push username/cricket-platform:latest

# Pull and run on another machine
docker pull username/cricket-platform:latest
docker run -d -p 3000:3000 --env-file .env username/cricket-platform:latest
```

### Environment-Specific Configurations

For different environments (dev, staging, production), create separate `.env` files:

- `.env.development`
- `.env.staging`
- `.env.production`

Use them with:
```bash
docker-compose --env-file .env.production up -d
```

## Kubernetes Deployment (Advanced)

For Kubernetes deployment, see `k8s/` directory (to be created) or use the Dockerfile directly:

```yaml
# Example Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cricket-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cricket-platform
  template:
    metadata:
      labels:
        app: cricket-platform
    spec:
      containers:
      - name: cricket-platform
        image: cricket-platform:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_SUPABASE_URL
          valueFrom:
            secretKeyRef:
              name: supabase-secrets
              key: url
```

## Performance Optimization

### Multi-stage Build Benefits

The Dockerfile uses multi-stage builds to:
- Reduce final image size (from ~1GB to ~150MB)
- Separate build dependencies from runtime
- Improve security by not including dev dependencies

### Caching Strategies

```bash
# Use BuildKit for better caching
DOCKER_BUILDKIT=1 docker build -t cricket-platform .

# Use layer caching from registry
docker build --cache-from cricket-platform:latest -t cricket-platform .
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 3000
   netstat -ano | findstr :3000  # Windows
   lsof -i :3000  # Mac/Linux

   # Change port in docker-compose.yml
   ports:
     - "3001:3000"
   ```

2. **Container fails to start**
   ```bash
   # Check logs
   docker-compose logs app

   # Check environment variables
   docker-compose exec app env
   ```

3. **Database connection issues**
   ```bash
   # Verify Supabase credentials in .env
   # Check network connectivity
   docker-compose exec app ping your-project.supabase.co
   ```

4. **Build fails**
   ```bash
   # Clear Docker cache
   docker builder prune

   # Rebuild without cache
   docker-compose build --no-cache
   ```

5. **Hot reload not working**

   For development with hot reload, use:
   ```bash
   npm install
   npm run dev
   ```

   Docker is optimized for production builds. For development, run locally.

## Health Checks

The PostgreSQL service includes a health check. Monitor it with:

```bash
# Check health status
docker-compose ps

# Manual health check for app
docker-compose exec app wget -O- http://localhost:3000 || echo "App not healthy"
```

## Scaling with Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml cricket

# Scale the app service
docker service scale cricket_app=3

# View services
docker service ls
```

## Security Best Practices

1. **Never commit `.env` files to git**
   - Use `.env.example` as a template
   - Add `.env` to `.gitignore`

2. **Use secrets for sensitive data**
   ```bash
   echo "your-secret-key" | docker secret create supabase_key -
   ```

3. **Run as non-root user** (already configured in Dockerfile)

4. **Scan for vulnerabilities**
   ```bash
   docker scan cricket-platform:latest
   ```

5. **Keep base images updated**
   ```bash
   docker pull node:18-alpine
   docker-compose build --no-cache
   ```

## Monitoring and Logging

### Centralized Logging

Integrate with logging services:

```yaml
# docker-compose.yml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Monitoring with Prometheus

```yaml
# Add Prometheus metrics endpoint
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

## Backup and Restore

### Automated Backups

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U cricket_user cricket_db > "backups/backup_$DATE.sql"
echo "Backup created: backup_$DATE.sql"
```

### Restore from Backup

```bash
# Restore latest backup
docker-compose exec -T postgres psql -U cricket_user -d cricket_db < backups/backup_20250131_120000.sql
```

## Support

For issues or questions:
- GitHub Issues: Create an issue in the repository
- Documentation: Check `README.md` and `SETUP_GUIDE.md`
- Supabase Docs: https://supabase.com/docs

## License

This project is open-source. See LICENSE file for details.
