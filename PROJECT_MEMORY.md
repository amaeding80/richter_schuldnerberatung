# Projekt-Gedächtnis
*Zuletzt aktualisiert: 2026-05-23*

---

## Aktive Projekte

### Webseite Schuldnerberatung Richter München
- **Status**: In Arbeit
- **Ordner**: `/Volumes/Ext_aM_1TB/_Akquise/Interessenten/Webseite_Schuldnerberatung_Richter_München/`
- **Zuletzt gemacht**: WhatsApp-Öffnungszeiten-Modal + "Heute geöffnet/geschlossen"-Badge auf allen 15 Seiten eingebaut — inklusive bayerischer Feiertage (Gaussian Easter + 13 Feiertage). Farbstil: Dunkelblau (#0d1f3c) + Cognac (#c4a06a).
- **Offene Aufgaben**:
  - Inhalte für `schuldnerberater.html` erstellen (Task #17)
  - Inhalte für `impressum.html` & `datenschutz.html` prüfen/ergänzen (Task #23)
  - E-Mail an Dino Richter wegen Kalender/Terminbuchung (Task #30)
  - **Alle Änderungen noch auf GitHub pushen** (bisher nur lokal)
- **Alle bearbeiteten Dateien (15 Seiten)**:
  - index.html, leistungen.html, privatinsolvenz.html, pfaendung.html
  - aussergerichtlich.html, schulden-loswerden.html, unternehmen.html
  - p-konto.html, insolvenz.html, schuldnerberater.html
  - pfaendungstabelle.html, pfaendungsrechner.html, terminbuchung.html
  - impressum.html, datenschutz.html

---

## Technische Details

### WhatsApp-Modal-Script (`/* WhatsApp Öffnungszeiten-Check */`)
- Klick auf `wa.me/message/Z6VKT3Z65OFEH1` → prüft Berliner Zeit (Mo–Fr 09–16 Uhr)
- Bei geschlossen: Modal erscheint (kein WhatsApp-Öffnen)
- Bayerische Feiertage: 8 feste + 5 Oster-basierte (Karfreitag, Ostermontag, Himmelfahrt, Pfingstmontag, Fronleichnam)
- Kein "Trotzdem senden"-Button — bewusste Entscheidung

### Öffnungszeiten-Badge-Script (`/* Öffnungszeiten-Badge */`)
- Badge erscheint in: Desktop-Nav (`.nav-links`), Mobil-Menü (`#mob-menu`), Kontaktbereich (`.k-note`)
- Zeigt: grüner pulsierender Punkt + "Heute geöffnet · 09–16 Uhr" ODER grauer Punkt + "Geschlossen" / "Feiertag" / "Wochenende"
- Auto-Refresh alle 60 Sekunden

---

## Letzte Aktionen
*(Neueste zuerst)*

- 2026-05-23 Bayerische Feiertage in beide Scripts auf allen 15 Seiten eingebaut
- 2026-05-23 "Trotzdem schreiben"-Button aus WhatsApp-Modal entfernt
- 2026-05-23 Modal-Text geändert zu: "Sie schreiben mir gerade außerhalb meiner Sprechzeiten. Ich bin gerne persönlich für Sie da – Mo–Fr · 09:00–16:00 Uhr"
- 2026-05-23 Modal-Farbstil an Webseite angepasst (Dunkelblau + Cognac)
- 2026-05-23 Öffnungszeiten-Badge auf allen 3 Positionen (Nav, Mobil, Kontakt) eingebaut
- 2026-05-23 WhatsApp-Öffnungszeiten-Check auf allen 15 Seiten eingebaut

---

## Wichtige Entscheidungen

- Kein "Trotzdem schreiben"-Button im Modal (Nutzer sollen außerhalb der Zeiten nicht schreiben können)
- Badge als `<li>` in `.nav-links` eingefügt (Desktop), da `.nav-cta` nicht existiert
- Berliner Zeitzone explizit über `toLocaleString('en-US', {timeZone:'Europe/Berlin'})` berechnet
- Alle HTML-Seiten lokal bearbeitet — Push auf GitHub steht noch aus

---

## Notizen

- Webseite ist für Dino Richter (Schuldnerberater, München)
- WhatsApp-Link: `wa.me/message/Z6VKT3Z65OFEH1`
- Öffnungszeiten: Mo–Fr 09:00–16:00 Uhr
