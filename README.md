# Kino Royal 2.0 - Kinoreservierungssystem

Eine vollständige Web-Anwendung zur Verwaltung eines Kinos mit Reservierungssystem und QR-Code-Generierung.

## 🎬 Projektübersicht

Kino Royal ist eine moderne Webanwendung, die es Kinobetreibern ermöglicht, Säle und Vorstellungen zu verwalten, während Kunden Plätze reservieren und QR-Codes für ihre Tickets erhalten können.

### Entwickelt von
- Aahd Abi Alhaj
- Niklas Hencke

**Hochschule:** Hochschule Trier  
**Kurs:** Web-Entwicklung WS 2025/26  


---

## ✨ Features

### Für Betreiber
- ✅ Kinosäle anlegen (Name, Anzahl Reihen, Sitze pro Reihe)
- ✅ Vorstellungen anlegen (Film, Datum, Uhrzeit, Saal, Genre, FSK, Beschreibung)
- ✅ Übersicht aller Säle und Vorstellungen
- ✅ Tab-Navigation zwischen Sälen und Vorstellungen

### Für Kunden
- ✅ Vorstellungen durchsuchen mit **automatischer Paginierung**
- ✅ Mehrere Sitzplätze reservieren (mit `Strg`-Taste)
- ✅ Dropdown-Auswahl: Kinosaal → Reihe → Sitz
- ✅ Belegte Plätze werden rot markiert
- ✅ QR-Code nach erfolgreicher Reservierung
- ✅ QR-Code drucken

### Technische Features
-  **Responsive Design** (Desktop & Mobil)
-  **Dynamische Paginierung** - passt sich Fenstergröße an
-  **Modernes Schwarz/Rot Design**
-  **MongoDB** Persistierung
-  **REST API** Backend
-  **Semistandard** Code-Style

---

## 🛠️ Technologie-Stack

### Frontend
- **Vanilla JavaScript** (ES6+ Module)
- **LESS** für CSS-Präprozessing
- **esbuild** für JavaScript-Bundling
- **QRCode.js** für QR-Code-Generierung

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **REST API**

### Build-Tools
- **lessc** (CSS-Kompilierung)
- **terser** (JS-Minifizierung)
- **semistandard** (Code-Linting)
- **rimraf** (Cross-platform cleaning)

---

## 📁 Projektstruktur
```
Kino-Royal-2.0/
├── .gitignore
├── package-lock.json
├── package.json
├── dist (generiert)
├── node_modules (generiert)
├── public/
│   ├── assets/
│   │   └── logo.png
│   ├── bundle.js
│   ├── index.html
│   └── style.css
├── README.md
├── Scripts/
│   └── copy-assets.js
├── Server/
│   ├── kinosaal.js
│   ├── reservierung.js
│   ├── server.js
│   └── vorstellung.js
└── Webapp/
    └── src/
        ├── js/
        │   ├── Main.mjs
        │   ├── router.js
        │   ├── Scripts/
        │   │   └── copy-assets.js
        │   └── Views/
        │       ├── bestaetigung.js
        │       ├── betreiber.js
        │       ├── kunde.js
        │       ├── reservierung.js
        │       └── rollen.js
        └── styles/
            ├── bestaetigung.less
            ├── betreiber.less
            ├── kunde.less
            ├── main.less
            ├── reservierung.less
            └── rollen.less
**Hinweis:** Die Ordner `dist/` und `node_modules/` werden automatisch generiert und sind nicht Teil des Repositories.
```

---

## 🚀 Installation & Start

### Voraussetzungen
- **Node.js** (v16 oder höher)
- **MongoDB** (lokal installiert und gestartet)
- **npm** (kommt mit Node.js)

### 1. MongoDB starten
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 2. Projekt initialisieren
```bash
# Abhängigkeiten installieren
npm install

# Projekt builden
npm run build

# Server starten
npm start
```

Die Anwendung läuft nun auf **http://localhost:8080**

---

## 📜 Verfügbare NPM-Scripts

| Script | Beschreibung |
|--------|--------------|
| `npm run clean` | Löscht alle generierten Dateien (`dist/`) |
| `npm run lint` | Prüft Code auf semistandard-Fehler |
| `npm run debug` | Build ohne Minifizierung (für Entwicklung) |
| `npm run build` | Production-Build mit Minifizierung |
| `npm start` | Startet Server auf Port 8080 |

---

## 🎯 Benutzung

### 1. **Rollenauswahl**
Beim ersten Besuch wählst du deine Rolle:
- **Kunde** - Vorstellungen ansehen und reservieren
- **Betreiber** - Säle und Vorstellungen verwalten

### 2. **Als Betreiber**

#### Kinosaal anlegen:
1. Tab "Kinosäle" auswählen
2. Name, Anzahl Reihen und Sitze eingeben
3. "Anlegen" klicken

#### Vorstellung anlegen:
1. Tab "Vorstellungen" auswählen
2. Filmdetails eingeben (Name, Genre, FSK, Dauer, Datum, Uhrzeit)
3. Kinosaal aus Dropdown wählen
4. "Anlegen" klicken

### 3. **Als Kunde**

#### Platz reservieren:
1. Film aus der Liste auswählen
2. "Reservieren" klicken
3. **Kinosaal** aus Dropdown wählen
4. **Reihe** auswählen
5. **Sitz** auswählen (belegte Sitze sind rot markiert)
6. Namen eingeben
7. "Reservierung bestätigen"

#### QR-Code:
- Nach erfolgreicher Reservierung erscheint der QR-Code
- Enthält alle Reservierungsdetails
- Kann mit "QR-Code drucken" ausgedruckt werden

---

## 🎨 Design-Konzept

### Farbschema
- **Primär:** Schwarz (#0a0a0a)
- **Akzent:** Rot (#dc2626)
- **Text:** Weiß (#ffffff)
- **Sekundär:** Dunkelgrau (#1a1a1a)

### Typografie
- **Font:** Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Stil:** Modern, minimalistisch, professionell

### Animationen
- Fade-In Effekte beim Laden
- Hover-Transformationen
- Glow-Effekt auf dem Logo
- Button-Shine-Effekt

---

## 🗄️ Datenbank-Schema

### Kinosaal
```javascript
{
  name: String,
  sitzreihen: Number,
  sitzeProReihe: Number
}
```

### Vorstellung
```javascript
{
  filmName: String,
  genre: String,
  ageRating: Number,
  duration: Number,
  description: String,
  startTime: Date,
  posterUrl: String,
  kinosaal: ObjectId (ref: 'Kinosaal')
}
```

### Reservierung
```javascript
{
  kundenName: String,
  vorstellung: ObjectId (ref: 'Vorstellung'),
  kinosaal: ObjectId (ref: 'Kinosaal'),
  sitz: {
    reihe: Number,
    nummer: Number
  }
  qrCode: String,
  erstelltAm: Date
}
```

---

## 🌐 API-Endpunkte

### Kinosäle
- `GET /api/kinosaele` - Alle Säle abrufen
- `POST /api/kinosaele` - Neuen Saal erstellen
```json
  {
    "name": "Saal 1",
    "sitzreihen": 10,
    "sitzeProReihe": 15
  }
```

### Vorstellungen
- `GET /api/vorstellungen` - Alle Vorstellungen abrufen
- `GET /api/vorstellungen/:id` - Einzelne Vorstellung abrufen
- `GET /api/vorstellungen/:id/reservierungen` - Alle Reservierungen einer Vorstellung
- `POST /api/vorstellungen` - Neue Vorstellung erstellen
```json
  {
    "filmName": "Inception",
    "genre": "Sci-Fi",
    "ageRating": 12,
    "duration": 148,
    "description": "Ein Dieb...",
    "startTime": "2025-03-15T20:00:00",
    "kinosaal": "507f1f77bcf86cd799439011"
  }
```

### Reservierungen
- `GET /api/reservierungen` - Alle Reservierungen abrufen
- `POST /api/reservierungen` - Neue Reservierung erstellen
```json
  {
    "vorstellungId": "507f1f77bcf86cd799439011",
    "kundenName": "Max Mustermann",
    "sitze": [
      { "reihe": 5, "platz": 10 },
      { "reihe": 5, "platz": 11 }
    ]
  }
```
  **Response:** Enthält automatisch generierten QR-Code als Base64

---

## ⚙️ Konfiguration

### Port ändern
```bash
npm start 3000  # Startet auf Port 3000 statt 8080
```

### MongoDB-Verbindung
In `server/server.js`:
```javascript
mongoose.connect('mongodb://127.0.0.1:27017/kino')
```

---

## 🔧 Entwicklung

### Code-Style
Das Projekt folgt **semistandard** Regeln:
```bash
npm run lint
```

### Automatisches Fixing
```bash
npx semistandard --fix
```

### Browser-Kompatibilität
✅ Google Chrome (aktuell)  
✅ Mozilla Firefox (aktuell)  
✅ Edge (aktuell)

---

## 📦 Dependencies

### Production
- `express` - ^4.18.2
- `mongoose` - ^7.5.1
- `qrcode` - ^1.5.3

### Development
- `esbuild` - ^0.19.3
- `less` - ^4.5.1
- `less-plugin-clean-css` - ^1.5.1
- `rimraf` - ^5.0.5
- `semistandard` - ^16.0.0
- `terser` - ^5.21.0

---

##  Bekannte Einschränkungen

- ⚠️ Keine Benutzer-Authentifizierung
- ⚠️ Keine Bearbeitung/Löschung von Einträgen
- ⚠️ QR-Code enthält nur JSON-Daten (keine echte Ticket-Validierung)

---

