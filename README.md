# 🎓 Wissen-Handeln.com - KI-Lernplattform für Vereine

**Conversion-optimierte Website für KI-Training speziell für Vereine und Kleinunternehmen**

## 🚀 Quick Start

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev

# Production Build
npm run build

# Preview
npm run preview
```

## ✅ Features

### 🔒 DSGVO-Konformität
- Cookie-Banner mit Ablehnung-Option
- Keine Tracking-Cookies
- Vollständige Datenschutzerklärung
- Impressum-Template

### 🎯 Conversion-Optimierung
- **Hero Section** mit klarem Wertversprechen
- **Launch-Angebot**: 2 Monate kostenlos (statt 49€)
- **Dual CTA-Strategie**: Webinar + Lead Magnet
- **Problem-Lösung-Struktur**
- **Social Proof** mit Testimonials
- **USP-Sektion** mit Tool-Garantie

### 📱 Technologie
- **Astro** (Static Site Generator)
- **TypeScript** (Type-Safe)
- **Mobile-First Design**
- **Zero External Dependencies**
- **System Fonts Only** (keine Google Fonts)

## 📁 Seiten-Struktur

- `/` - Homepage (Haupt-Conversion-Page)
- `/webinar-buchung` - Webinar-Buchungsformular
- `/danke-webinar` - Danke-Seite nach Webinar-Buchung
- `/danke-leadmagnet` - Brücken-Seite mit Webinar-Upsell
- `/impressum` - DSGVO-Impressum
- `/datenschutz` - DSGVO-Datenschutzerklärung

## 🌐 Deployment

### Nginx (Empfohlen)
```bash
npm run build
cp -r dist/* /var/www/wissen-handeln/
nginx -t && systemctl reload nginx
```

### Docker
```bash
docker build -t wissen-handeln-website .
docker run -d -p 80:80 --name website wissen-handeln-website
```

## 🔗 n8n Integration

### Webhooks (TODO):

1. **Lead Magnet**: `https://automatik.wissen-handeln.com/webhook/lead-magnet`
2. **Webinar-Buchung**: `https://automatik.wissen-handeln.com/webhook/webinar-buchung`

## 📋 TODO vor Go-Live

- [ ] Impressum-Platzhalter mit echten Daten füllen
- [ ] n8n Webhooks konfigurieren
- [ ] Brevo E-Mail-Sequenzen aufsetzen
- [ ] SSL-Zertifikat erstellen
- [ ] Testimonial-Fotos hinzufügen

---

**Stand**: Oktober 2025 | **Version**: 1.0.0
