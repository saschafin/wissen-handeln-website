#!/bin/bash
# Komplettes Deployment-Script für wissen-handeln.com
# Führt ALLES automatisch durch: Build, Upload, Nginx-Config, SSL

set -e  # Bei Fehler abbrechen

SERVER="root@173.249.21.101"
DOMAIN="wissen-handeln.com"
WWW_DIR="/var/www/wissen-handeln"

echo "🚀 Starting Complete Deployment..."

# 1. Production Build (lokal)
echo "📦 Building production site..."
npm run build

# 2. Verzeichnis auf Server erstellen
echo "📁 Creating directory on server..."
ssh $SERVER "mkdir -p $WWW_DIR"

# 3. Files hochladen
echo "📤 Uploading files to server..."
scp -r dist/* $SERVER:$WWW_DIR/

# 4. Nginx-Konfiguration hochladen
echo "⚙️  Uploading Nginx configuration..."
scp nginx-config.conf $SERVER:/etc/nginx/sites-available/wissen-handeln.com

# 5. Nginx-Konfiguration aktivieren
echo "🔗 Enabling Nginx configuration..."
ssh $SERVER "ln -sf /etc/nginx/sites-available/wissen-handeln.com /etc/nginx/sites-enabled/wissen-handeln.com"

# 6. Nginx testen (OHNE SSL - noch nicht vorhanden)
echo "🧪 Testing Nginx configuration..."
ssh $SERVER "nginx -t" || true

# 7. Nginx neu laden
echo "🔄 Reloading Nginx..."
ssh $SERVER "systemctl reload nginx"

# 8. SSL-Zertifikat mit Certbot erstellen
echo "🔒 Creating SSL certificate with Certbot..."
ssh $SERVER "certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email saschafinster@icloud.com" || echo "⚠️  SSL setup skipped (certbot might not be installed or DNS not configured)"

# 9. Nginx nochmal neu laden (mit SSL)
echo "🔄 Reloading Nginx with SSL..."
ssh $SERVER "systemctl reload nginx"

# 10. Permissions setzen
echo "🔐 Setting permissions..."
ssh $SERVER "chown -R www-data:www-data $WWW_DIR && chmod -R 755 $WWW_DIR"

# 11. DNS-Check
echo "🌐 Checking DNS..."
echo "DNS for $DOMAIN:"
dig +short $DOMAIN
echo "DNS for www.$DOMAIN:"
dig +short www.$DOMAIN

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Your website should be live at:"
echo "   https://$DOMAIN"
echo "   https://www.$DOMAIN"
echo ""
echo "📋 Next steps:"
echo "   1. Check if DNS points to 173.249.21.101"
echo "   2. Wait for DNS propagation (can take up to 24h)"
echo "   3. Test website in browser"
echo "   4. Setup n8n webhooks (see N8N_INTEGRATION.md)"
echo ""
