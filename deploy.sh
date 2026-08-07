#!/bin/bash
set -e

export DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-worknai009}"
export COMPOSE_PROJECT_NAME=lovenzea

TARGET_DIR="/var/www/lovenzea/source"
REPO_URL="https://github.com/punarmilan/Lovenzea_V1.git"

echo "========================================="
echo " Starting LovenZea VPS Setup & Deploy  "
echo "========================================="

# 1. Ensure target directory exists
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

# 2. Clone or update repository
if [ ! -d ".git" ]; then
    echo "-> Cloning repository into $TARGET_DIR..."
    git clone "$REPO_URL" .
else
    echo "-> Updating existing repository..."
    git fetch origin main || git fetch origin master
    git reset --hard origin/$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
fi

# 3. Setup .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "-> Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️ Please edit $TARGET_DIR/.env with your production credentials."
fi

# 4. Sync gateway.nginx.conf to parent path /var/www/lovenzea/
echo "-> Copying Nginx Gateway configuration..."
cp gateway.nginx.conf /var/www/lovenzea/gateway.nginx.conf
nginx -t 2>/dev/null || docker exec lovenzea-gateway nginx -t 2>/dev/null || true

# 5. Pull latest Docker images (all services)
echo "-> Pulling latest Docker images..."
docker compose pull backend web-frontend admin-frontend

# 5.1 Clean up old containers from previous projects
echo "-> Cleaning up old containers from previous projects..."
docker rm -f punarmilan-backend punarmilan-frontend punarmilan-login-server punarmilan-gateway punarmilan-mysql punarmilan-redis punarmilan-rabbitmq punarmilan-minio punarmilan-minio-config punarmilan-watchtower truth-life-frontend 2>/dev/null || true
docker rm -f lovenzea-watchtower lovenzea-gateway lovenzea-backend lovenzea-web-frontend lovenzea-admin-frontend lovenzea-mysql lovenzea-redis lovenzea-rabbitmq lovenzea-minio lovenzea-minio-config 2>/dev/null || true

# 6. Start / update Docker containers
echo "-> Launching Docker Compose stack..."
docker compose up -d --remove-orphans

# 7. Reload nginx gateway to pick up new config
echo "-> Reloading Nginx Gateway..."
docker exec lovenzea-gateway nginx -s reload 2>/dev/null || true

# 8. Cleanup unused docker images
echo "-> Cleaning up old images..."
docker image prune -f

echo "========================================="
echo " Deployment successful! Container status:"
echo "========================================="
docker compose ps