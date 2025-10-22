#!/bin/bash
# Docker-Deployment für wissen-handeln.com

set -e

echo "🐳 Starting Docker Deployment..."

# 1. Build erstellen
echo "📦 Building production site..."
npm run build

# 2. Docker Image bauen
echo "🏗️  Building Docker image..."
docker build -t wissen-handeln-website .

# 3. Alten Container stoppen & löschen (falls vorhanden)
echo "🛑 Stopping old container..."
docker stop website 2>/dev/null || true
docker rm website 2>/dev/null || true

# 4. Neuen Container starten
echo "🚀 Starting new container..."
docker run -d \
  --name website \
  --restart unless-stopped \
  -p 8080:80 \
  wissen-handeln-website

echo "✅ Docker deployment complete!"
echo "🌐 Website running on: http://localhost:8080"
