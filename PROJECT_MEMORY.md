# Projekt-Gedächtnis
*Zuletzt aktualisiert: 2026-05-24*

---

## Aktive Projekte

### Webseite Alexander Mäding – Webdesign für Arztpraxen
- **Status**: In Arbeit
- **Ordner**: `/Volumes/Ext_aM_1TB/_Akquise/Interessenten/Webseite_Alexander_Maeding/`
- **Datei**: `index.html` (Single-Page)
- **Zuletzt gemacht**: Komplettes Redesign v3 — Nische auf Arztpraxen/Privatpraxen fokussiert, Farbpalette auf Medizinal-Teal (#0D7A8A) umgestellt, Hero mit dunklem Teal-Hintergrund + warmen organischen Glüheffekten (kein Browser-Mockup mehr), WA-Button teal statt grün, alle Texte auf Arztpraxis-Zielgruppe ausgerichtet (Privatpatienten, DSGVO, deutschlandweit)
- **Offene Aufgaben**:
  - Impressum + Datenschutz-Seite erstellen
  - Calendly-URL von Alexander eintragen (aktuell Platzhalter)
  - Echtes Foto oder finale Entscheidung zum Hero-Visual (aktuell: dunkles Teal + Glow)
  - Evtl. weitere Referenzen ergänzen

### Farbpalette Alexander Mäding v3 (Forschungs-basiert)
- **Haupt-Teal**: `#0D7A8A` (CTAs, Tags, Icons, WA-Button)
- **Hover-Teal**: `#0A6070`
- **Cognac-Gold**: `#C4956A` (Zahlen, em-Highlights)
- **Text**: `#0D2B33` (dunkles Teal-Schwarz)
- **BG Sektionen**: `#F2F9FA` (zartes Teal-Weiß)
- **Footer/Trust-Strip**: `#073540` (dunkel-teal)
- **Hero**: `linear-gradient(145deg, #0A4A55, #073540, #0B3D47)` + warme Glüheffekte

### Webseite Schuldnerberatung Richter München
- **Status**: In Arbeit
- **Ordner**: `/Volumes/Ext_aM_1TB/_Akquise/Interessenten/Webseite_Schuldnerberatung_Richter_München/`
- **Zuletzt gemacht**: WhatsApp-Öffnungszeiten-Modal + "Heute geöffnet/geschlossen"-Badge auf allen 15 Seiten inkl. bayerischer Feiertage. WA-Check auf beide Links erweitert (`wa.me/message/Z6VKT3Z65OFEH1` + `wa.me/4908985635744`). Wochenende/Feiertag-Text in Nav-Badge ergänzt.
- **Offene Aufgaben**:
  - Inhalte für `schuldnerberater.html` erstellen (Task #17)
  - Inhalte für `impressum.html` & `datenschutz.html` prüfen/ergänzen (Task #23)
  - E-Mail an Dino Richter wegen Kalender/Terminbuchung (Task #30)
  - **Alle Änderungen noch auf GitHub pushen** (bisher nur lokal)

### Webseite Dr. Gold – Die Familienpraxis
- **Status**: Abgeschlossen (Badge + Feiertage)
- **Ordner**: `/Volumes/Ext_aM_1TB/_Akquise/Interessenten/Dr. Gold – Die Familienpraxis/Webseite_Dr. Gold/`
- **Badge IDs**: `oa-g-nav` (Desktop), `oa-g-mob` (Mobil)
- **Farbe**: `#3a7268`

### Webseite Bajorsky
- **Status**: Abgeschlossen (Badge + Feiertage + Mobile-Fix)
- **Ordner**: `/Volumes/Ext_aM_1TB/_Akquise/Interessenten/Webseite_Bajorsky/`
- **Badge IDs**: `oa-b-nav` (Desktop, mobile ausgeblendet), `oa-b-mob`

### Kinderpraxis Gandenberger-Bachem
- **Status**: Abgeschlossen (Badge + Feiertage)
- **Ordner**: `/Volumes/Ext_aM_1TB/_Akquise/Interessenten/Dr. Gandenberger-Bachem – Kinderpraxis/Kinderpraxis - Gandenberger-Bachem/`
- **Badge IDs**: `oa-k-nav`, `oa-k-mob`
- **Farbe**: `#2563EB`

---

## Technische Details (Richter)

### WhatsApp-Modal-Script
- Klick auf beide WA-Links → prüft Berliner Zeit (Mo–Fr 09–16 Uhr)
- Bayerische Feiertage: 8 feste + 5 Oster-basierte
- Kein "Trotzdem senden"-Button

### Badge-Script (alle Praxen)
- Zeigt: Heute geöffnet / Geschlossen / Feiertag / Wochenende
- Auto-Refresh alle 60 Sekunden
- Berliner Zeitzone: `toLocaleString('en-US', {timeZone:'Europe/Berlin'})`

---

## Letzte Aktionen
*(Neueste zuerst)*

- 2026-05-24 Hero redesign: dunkles Teal + organische Glüheffekte (kein Browser-Mockup)
- 2026-05-24 WA-Button + Float-Button: grün → teal (#0D7A8A)
- 2026-05-24 Alle Texte auf Arztpraxen-Nische ausgerichtet (Privatpatienten, DSGVO, deutschlandweit)
- 2026-05-24 Farbpalette auf Medizinal-Teal umgestellt (Forschungs-basiert: Blau+Grün=Vertrauen+Gesundheit)
- 2026-05-24 Öffnungszeiten-Badge Kinderpraxis Gandenberger-Bachem eingebaut
- 2026-05-23 Bajorsky mobile Badge-Fix + Feiertage + Wochenende-Text
- 2026-05-23 Dr. Gold Feiertage + Wochenende/Feiertag-Text in Nav-Badge
- 2026-05-23 Richter: WA-Check auf beide Links, Nav-Badge Stundentext ergänzt
- 2026-05-23 `privatpraxis-bogenhausen.html` aus Richter-Ordner gelöscht

---

## Wichtige Entscheidungen

- **Alexander Mäding Nische**: Ausschließlich Arztpraxen & Privatpraxen (deutschlandweit, nicht nur München)
- **Farbe Teal statt Blau**: Forschung zeigt Teal = wärmer, medizinischer, moderner als reines Blau 2025
- **Kein Browser-Mockup im Hero**: Wirkt zu technisch, zu wenig Emotion → durch organische Glüheffekte ersetzt
- **WA-Button teal statt grün**: Grün beißt sich mit Teal-Design
- **Kein "Trotzdem schreiben"-Button** im Richter-Modal
- **Berliner Zeitzone** explizit berechnet (nicht Systemzeit)

---

## Notizen

- Alexander Mäding: WhatsApp `wa.me/4917643433973`, Email `amaeding80@gmail.com`, Calendly Platzhalter
- Richter: WhatsApp `wa.me/message/Z6VKT3Z65OFEH1` + `wa.me/4908985635744`, Mo–Fr 09–16 Uhr
- Alle Praxis-Webseiten: bayerische Feiertage mit Gaussian-Easter-Algorithmus
