# 🚀 QUICK DEPLOYMENT GUIDE

## Option 1: Automatisches Script (EMPFOHLEN)

```bash
cd ~/wissen-handeln-new
./DEPLOY_NOW.sh
```

**Das war's!** Das Script wird 3x nach dem SSH-Passwort fragen: `Baby2069!`

---

## Option 2: Manuelles Deployment (Alternative)

### Schritt 1: Files hochladen

```bash
cd ~/wissen-handeln-new
scp -r deployment-package/* root@173.249.21.101:/var/www/wissen-handeln/
# Password: Baby2069!
```

### Schritt 2: Nginx konfigurieren

```bash
ssh root@173.249.21.101
# Password: Baby2069!

# Nginx-Config erstellen
cat > /etc/nginx/sites-available/wissen-handeln.com << 'EOF'
server {
    listen 80;
    server_name wissen-handeln.com www.wissen-handeln.com;
    root /var/www/wissen-handeln;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Config aktivieren
ln -sf /etc/nginx/sites-available/wissen-handeln.com /etc/nginx/sites-enabled/

# Nginx neu laden
nginx -t && systemctl reload nginx
```

### Schritt 3: DNS konfigurieren

**Bei deinem Domain-Provider:**
- A Record: `wissen-handeln.com` → `173.249.21.101`
- A Record: `www.wissen-handeln.com` → `173.249.21.101`

### Schritt 4: SSL aktivieren (nach DNS-Propagation)

```bash
ssh root@173.249.21.101
certbot --nginx -d wissen-handeln.com -d www.wissen-handeln.com
```

---

## ✅ Deployment-Checkliste

- [ ] Build erstellt (`npm run build`)
- [ ] Files auf Server hochgeladen
- [ ] Nginx konfiguriert
- [ ] DNS eingerichtet (A Records)
- [ ] SSL-Zertifikat erstellt
- [ ] Website-Test erfolgreich
- [ ] n8n Webhooks konfiguriert

---

## 🧪 Testing

### Test 1: Direkt über IP
```bash
curl -I http://173.249.21.101
```

### Test 2: Mit Domain (nach DNS)
```bash
curl -I http://wissen-handeln.com
```

### Test 3: Browser
Öffne: http://173.249.21.101

---

## 🆘 Troubleshooting

### Problem: 502 Bad Gateway
```bash
ssh root@173.249.21.101
systemctl status nginx
nginx -t
```

### Problem: DNS funktioniert nicht
```bash
dig wissen-handeln.com
# Sollte 173.249.21.101 anzeigen
```

### Problem: SSL schlägt fehl
```bash
# DNS muss zuerst konfiguriert sein!
# Warte 10-30 Minuten nach DNS-Änderung
certbot --nginx -d wissen-handeln.com -d www.wissen-handeln.com
```

---

## 📞 Quick Links

- **Server**: ssh root@173.249.21.101 (Password: Baby2069!)
- **n8n**: https://automatik.wissen-handeln.com
- **GitHub**: https://github.com/saschafin/wissen-handeln-website
