# 🔗 n8n Webhook Integration Guide

## 📋 Übersicht

Die Website ist vorbereitet für die Integration mit n8n-Workflows für:
1. **Lead Magnet** (Kostenloser KI-Guide)
2. **Webinar-Buchung** (Live-Webinar oder On-Demand)

---

## 🚀 Setup-Schritte

### 1️⃣ Lead Magnet Webhook (n8n)

**Ziel**: E-Mail-Opt-In für kostenlosen KI-Guide

#### n8n Workflow erstellen:

1. **Webhook Node** erstellen:
   - Method: `POST`
   - Path: `/webhook/lead-magnet`
   - Response: `Immediately`

2. **Brevo Node** (E-Mail senden):
   - Template: "Lead Magnet Welcome"
   - Empfänger: `{{$json.email}}`
   - Anhang: PDF-Guide
   - Personalisierung: `{{$json.firstname}}`

3. **Brevo List Node** (zu Liste hinzufügen):
   - Liste: "Lead Magnet Subscribers"
   - E-Mail: `{{$json.email}}`
   - Vorname: `{{$json.firstname}}`

4. **3-teilige E-Mail-Sequenz** (Delay Nodes):
   - **E-Mail 1** (Sofort): PDF-Guide + Willkommensnachricht
   - **E-Mail 2** (+2 Tage): Zusätzlicher Prompt + Praxistipp
   - **E-Mail 3** (+4 Tage): Webinar-Einladung mit Rabatt

#### Webhook-URL:
```
https://automatik.wissen-handeln.com/webhook/lead-magnet
```

#### Erwartete Payload:
```json
{
  "email": "max@example.com",
  "firstname": "Max" // optional
}
```

---

### 2️⃣ Webinar-Buchung Webhook (n8n)

**Ziel**: Webinar-Anmeldung mit Terminauswahl

#### n8n Workflow erstellen:

1. **Webhook Node**:
   - Method: `POST`
   - Path: `/webhook/webinar-buchung`

2. **Function Node** (Daten validieren):
   ```javascript
   if (!$json.email || !$json.termin) {
     throw new Error('Missing required fields');
   }
   return { ...$json };
   ```

3. **Brevo Node** (Bestätigungs-E-Mail):
   - Template: "Webinar Confirmation"
   - Empfänger: `{{$json.email}}`
   - Variablen:
     - `{{$json.firstname}} {{$json.lastname}}`
     - `{{$json.termin}}`
     - `{{$json.organisation}}`

4. **Calendar Node** (optional - für Live-Webinare):
   - Google Calendar / Outlook
   - Termin erstellen mit Zoom-Link

5. **Delay Node** (-24h vor Termin):
   - Erinnerungs-E-Mail senden

6. **Brevo List Node**:
   - Liste: "Webinar Attendees"

#### Webhook-URL:
```
https://automatik.wissen-handeln.com/webhook/webinar-buchung
```

#### Erwartete Payload:
```json
{
  "termin": "2025-10-25-19:00",
  "firstname": "Max",
  "lastname": "Mustermann",
  "email": "max@example.com",
  "organisation": "Sportverein Musterhausen e.V.", // optional
  "datenschutz": true
}
```

---

## 📧 Brevo E-Mail-Templates

### Template 1: Lead Magnet Welcome
**Betreff**: "Hier ist Ihr kostenloser KI-Guide 🎉"

```
Hallo {{firstname}},

vielen Dank für Ihr Interesse!

Hier ist Ihr kostenloser KI-Guide für Vereine:
[PDF-ANHANG]

Darin finden Sie 3 praxiserprobte Wege, wie KI Ihnen sofort hilft.

**Bonus-Tipp**: Probieren Sie den ersten Prompt noch heute aus!

Viel Erfolg,
Ihr Wissen-Handeln Team

---
P.S.: In 2 Tagen erhalten Sie von uns einen weiteren wertvollen Tipp!
```

---

### Template 2: Webinar Confirmation
**Betreff**: "Ihr Webinar-Platz ist reserviert! ✅"

```
Hallo {{firstname}},

großartig! Ihr Platz im KI-Starter Webinar ist reserviert.

**Ihre Details:**
- Termin: {{termin}}
- Dauer: 90 Minuten
- Zugangslink: [WIRD 1H VOR START GESENDET]

**Was Sie erwartet:**
✅ Mindestens 3 sofort einsetzbare KI-Tools
✅ Vereins-spezifische Beispiele
✅ Live Q&A Session

**Wichtig**: Fügen Sie noreply@wissen-handeln.com zu Ihrem Adressbuch hinzu!

Wir freuen uns auf Sie!
Ihr Wissen-Handeln Team

---
Bei Fragen: support@wissen-handeln.com
```

---

## 🧪 Testing

### Lead Magnet testen:
```bash
curl -X POST \
  https://automatik.wissen-handeln.com/webhook/lead-magnet \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstname": "Test"
  }'
```

### Webinar-Buchung testen:
```bash
curl -X POST \
  https://automatik.wissen-handeln.com/webhook/webinar-buchung \
  -H "Content-Type: application/json" \
  -d '{
    "termin": "2025-10-25-19:00",
    "firstname": "Test",
    "lastname": "User",
    "email": "test@example.com",
    "organisation": "Test Verein",
    "datenschutz": true
  }'
```

---

## ✅ Checkliste vor Go-Live

- [ ] Beide n8n-Webhooks erstellt und getestet
- [ ] Brevo-Templates erstellt (Lead Magnet, Webinar-Confirmation, Reminder)
- [ ] Brevo-Listen erstellt ("Lead Magnet Subscribers", "Webinar Attendees")
- [ ] E-Mail-Sequenzen (3 Teile) für Lead Magnet konfiguriert
- [ ] Test-E-Mails versendet und geprüft
- [ ] PDF-Guide für Lead Magnet vorbereitet
- [ ] Zoom-Links für Live-Webinare erstellt (falls zutreffend)
- [ ] DSGVO-konformes Double-Opt-In aktiviert (Brevo)

---

## 🔒 Sicherheit

- ✅ Webhooks nur über HTTPS
- ✅ Rate-Limiting in n8n aktivieren
- ✅ E-Mail-Validierung in Function Node
- ✅ DSGVO-konforme Datenspeicherung in Brevo
- ✅ Keine sensiblen Daten in Logs

---

## 📊 Empfohlene Metriken

**Zu tracken in n8n:**
- Lead Magnet Conversion Rate
- Webinar-Anmeldungen pro Tag
- E-Mail Open-Rate (Brevo)
- Click-Through-Rate auf Webinar-Upsell

---

**Stand**: Oktober 2025
**Version**: 1.0.0
