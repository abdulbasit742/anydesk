#!/bin/bash
set -e

echo "Setting up RemoteDesk infrastructure..."

# Create directories
mkdir -p /backups/remotedesk
mkdir -p /var/log/coturn
mkdir -p /var/log/remotedesk

# Generate secrets if not present
if [ ! -f .env ]; then
  echo "Generating .env file..."
  cp infra/.env.template .env

  DB_PASS=$(openssl rand -hex 32)
  JWT_SECRET=$(openssl rand -hex 64)
  TURN_PASS=$(openssl rand -hex 32)

  sed -i "s/change_me_in_production/$DB_PASS/g" .env
  sed -i "s/generate_a_random_32_char_string/$JWT_SECRET/g" .env
  sed -i "s/change_me_turn_password/$TURN_PASS/g" .env

  echo "Generated .env - please review and configure Stripe keys"
fi

# SSL certificates
if [ ! -f infra/nginx/ssl/cert.pem ]; then
  echo "Generating self-signed SSL certificates..."
  mkdir -p infra/nginx/ssl
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout infra/nginx/ssl/key.pem \
    -out infra/nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=RemoteDesk/CN=remotedesk.io"
  echo "Self-signed certs generated - replace with real certs for production"
fi

echo "Setup complete. Run: docker compose -f infra/docker/docker-compose.prod.yml up -d"
