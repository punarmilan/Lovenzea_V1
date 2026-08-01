#!/bin/bash
set -e

TARGET_DIR="/var/www/punarmilan/source"
REPO_URL="https://github.com/punarmilan/LovenZea_Native_App.git"

echo "========================================="
echo " Starting Punarmilan VPS Setup & Deploy  "
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

# 4. Sync gateway.nginx.conf to parent path /var/www/punarmilan/
echo "-> Copying Nginx Gateway configuration..."
cp gateway.nginx.conf /var/www/punarmilan/gateway.nginx.conf

# 5. Pull latest Docker images
echo "-> Pulling latest Docker images..."
docker compose pull

# 6. Start / update Docker containers
echo "-> Launching Docker Compose stack..."
docker compose up -d --remove-orphans

# 7. Cleanup unused docker images
echo "-> Cleaning up old images..."
docker image prune -f

echo "========================================="
echo " Deployment successful! Container status:"
echo "========================================="
docker compose ps
