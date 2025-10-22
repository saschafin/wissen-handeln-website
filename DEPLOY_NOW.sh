#!/bin/bash
# 🚀 EINFACHES DEPLOYMENT-SCRIPT - KOPIERE & FÜHRE AUS!
# Dieses Script macht ALLES automatisch

echo "🔐 SSH Password wird gleich 3x benötigt: Baby2069!"
echo ""
read -p "Drücke ENTER um fortzufahren..."

SERVER="root@173.249.21.101"
DOMAIN="wissen-handeln.com"

echo ""
echo "📤 Step 1/6: Uploading website files..."
scp -r deployment-package/* $SERVER:/tmp/wissen-handeln-temp/

echo ""
echo "🚀 Step 2/6: Moving files to web directory..."
ssh $SERVER << 'ENDSSH'
mkdir -p /var/www/wissen-handeln
cp -r /tmp/wissen-handeln-temp/* /var/www/wissen-handeln/
rm -rf /tmp/wissen-handeln-temp
chown -R www-data:www-data /var/www/wissen-handeln
chmod -R 755 /var/www/wissen-handeln
ls -la /var/www/wissen-handeln/
ENDSSH

echo ""
echo "⚙️  Step 3/6: Configuring Nginx..."
ssh $SERVER << 'ENDSSH'
cat > /etc/nginx/sites-available/wissen-handeln.com << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name wissen-handeln.com www.wissen-handeln.com;

    root /var/www/wissen-handeln;
    index index.html;

    # DSGVO: Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
}
EOF

ln -sf /etc/nginx/sites-available/wissen-handeln.com /etc/nginx/sites-enabled/
ENDSSH

echo ""
echo "🧪 Step 4/6: Testing Nginx configuration..."
ssh $SERVER "nginx -t"

echo ""
echo "🔄 Step 5/6: Reloading Nginx..."
ssh $SERVER "systemctl reload nginx"

echo ""
echo "🔒 Step 6/6: Creating SSL certificate..."
echo "   (Dies kann fehlschlagen wenn DNS noch nicht konfiguriert ist)"
ssh $SERVER "certbot --nginx -d wissen-handeln.com -d www.wissen-handeln.com --non-interactive --agree-tos --email saschafinster@icloud.com || echo 'SSL wird später eingerichtet wenn DNS bereit ist'"

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "🌐 Website ist erreichbar unter:"
echo "   http://173.249.21.101 (direkt über IP)"
echo "   http://wissen-handeln.com (wenn DNS konfiguriert)"
echo ""
echo "📋 NÄCHSTE SCHRITTE:"
echo ""
echo "1️⃣  DNS KONFIGURIEREN:"
echo "   - A Record: wissen-handeln.com → 173.249.21.101"
echo "   - A Record: www.wissen-handeln.com → 173.249.21.101"
echo ""
echo "2️⃣  SSL AKTIVIEREN (nach DNS-Propagation):"
echo "   ssh root@173.249.21.101"
echo "   certbot --nginx -d wissen-handeln.com -d www.wissen-handeln.com"
echo ""
echo "3️⃣  N8N WEBHOOKS EINRICHTEN:"
echo "   Siehe N8N_INTEGRATION.md"
echo ""
