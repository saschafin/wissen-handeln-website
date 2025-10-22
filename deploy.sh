#!/bin/bash
# Deployment-Script für wissen-handeln.com
# Automatisches Deployment zum Contabo-Server

set -e  # Bei Fehler abbrechen

echo "🚀 Starting Deployment to wissen-handeln.com..."

# 1. Build erstellen
echo "📦 Building production site..."
npm run build

# 2. Auf Server deployen (via SCP)
echo "📤 Uploading to server..."
scp -r dist/* root@173.249.21.101:/var/www/wissen-handeln/

# 3. Nginx neu laden
echo "🔄 Reloading Nginx..."
ssh root@173.249.21.101 "nginx -t && systemctl reload nginx"

echo "✅ Deployment complete!"
echo "🌐 Website live at: https://wissen-handeln.com"
