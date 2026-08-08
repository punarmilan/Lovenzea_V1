#!/bin/bash
set -e

export DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-worknai009}"
export COMPOSE_PROJECT_NAME=lovenzea

TARGET_DIR="${DEPLOY_DIR:-/var/www/lovenzea_v1}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
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
    git clone --branch "$DEPLOY_BRANCH" "$REPO_URL" .
else
    echo "-> Updating existing repository..."
    git fetch origin "$DEPLOY_BRANCH"
    git reset --hard "origin/$DEPLOY_BRANCH"
fi

# 3. Setup .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "-> Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️ Please edit $TARGET_DIR/.env with your production credentials."
fi

# 4. Sync gateway.nginx.conf into the deployment directory used by docker-compose
echo "-> Copying Nginx Gateway configuration..."
cp gateway.nginx.conf "$TARGET_DIR/gateway.nginx.conf"

# 4.1 Issue/expand SSL certificates for all live domains
echo "-> Ensuring SSL certificates exist..."
mkdir -p /var/www/certbot

if ! command -v certbot >/dev/null 2>&1; then
    echo "certbot not found. Installing certbot..."
    if command -v apt-get >/dev/null 2>&1; then
        if [ "$(id -u)" -eq 0 ]; then
            apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y certbot
        else
            sudo -n apt-get update && sudo -n env DEBIAN_FRONTEND=noninteractive apt-get install -y certbot
        fi
    else
        echo "certbot is required but could not be installed automatically."
        exit 1
    fi
fi

ensure_cert() {
    cert_name="$1"
    shift
    common_args="--non-interactive --agree-tos --register-unsafely-without-email --keep-until-expiring --expand --cert-name $cert_name"

    if docker ps --format '{{.Names}}' | grep -qx 'lovenzea-gateway'; then
        certbot certonly --webroot -w /var/www/certbot $common_args "$@" || {
            docker stop lovenzea-gateway || true
            certbot certonly --standalone --preferred-challenges http $common_args "$@"
        }
    else
        docker rm -f lovenzea-gateway 2>/dev/null || true
        certbot certonly --standalone --preferred-challenges http $common_args "$@" || \
            certbot certonly --webroot -w /var/www/certbot $common_args "$@"
    fi
}

ensure_cert lovenzea.com \
    -d lovenzea.com -d www.lovenzea.com \
    -d lovenzea.in -d www.lovenzea.in \
    -d lovenzea.online -d www.lovenzea.online
ensure_cert api.lovenzea.online -d api.lovenzea.online
ensure_cert asp-admin.lovenzea.online -d asp-admin.lovenzea.online

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
