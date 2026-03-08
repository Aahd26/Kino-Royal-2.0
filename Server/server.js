import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Kinosaal from './kinosaal.js';
import Vorstellung from './vorstellung.js';
import Reservierung from './reservierung.js';
import QRCode from 'qrcode';

const app = express();
const PORT = process.argv[2] || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API

app.post('/api/kinosaele', async (req, res) => { // kinosäle
  try {
    const { name, sitzreihen, sitzeProReihe } = req.body;

    const parsedRows = Number(sitzreihen);
    const parsedSeats = Number(sitzeProReihe);

    const kinosaal = await Kinosaal.create({
      name,
      sitzreihen: parsedRows,
      sitzeProReihe: parsedSeats
    });
    res.json(kinosaal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/kinosaele', async (req, res) => {
  try {
    const saele = await Kinosaal.find();
    res.json(saele);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vorstellungen', async (req, res) => { // kinovorstellungen
  try {
    const { filmName, genre, ageRating, duration, description, startTime, kinosaal } = req.body;

    const parsedDate = new Date(startTime);
    if (!parsedDate || isNaN(parsedDate)) {
      return res.status(400).json({ error: 'Ungültiges Datum' });
    }

    // Kinosaal laden
    const kinosaalDoc = await Kinosaal.findById(kinosaal);
    if (!kinosaalDoc) return res.status(404).json({ error: 'Kinosaal nicht gefunden' });

    // Alle Sitze als frei initialisieren
    const freieSitze = [];
    for (let r = 1; r <= kinosaalDoc.sitzreihen; r++) {
      for (let p = 1; p <= kinosaalDoc.sitzeProReihe; p++) {
        freieSitze.push({ reihe: r, platz: p });
      }
    }

    const vorstellung = await Vorstellung.create({
      filmName,
      genre,
      ageRating: Number(ageRating),
      duration: Number(duration),
      description,
      startTime: parsedDate,
      kinosaal: kinosaalDoc
    });
    res.json(vorstellung);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/vorstellungen', async (req, res) => {
  try {
    const vorstellungen = await Vorstellung.find().populate('kinosaal');
    res.json(vorstellungen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/vorstellungen/:id', async (req, res) => {
  try {
    const vorstellung = await Vorstellung
      .findById(req.params.id)
      .populate('kinosaal');

    if (!vorstellung) {
      return res.status(404).json({ error: 'Nicht gefunden' });
    }

    res.json(vorstellung);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/vorstellungen/:id/reservierungen', async (req, res) => {
  try {
    const reservierungen = await Reservierung.find({
      vorstellung: req.params.id
    });
    res.json(reservierungen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reservierungen', async (req, res) => {
  try {
    const { vorstellungId, kundenName, sitze } = req.body;

    if (!Array.isArray(sitze) || sitze.length === 0) {
      return res.status(400).json({ error: 'Keine Sitze ausgewählt' });
    }

    const vorstellungDoc = await Vorstellung.findById(vorstellungId).populate('kinosaal');
    if (!vorstellungDoc) return res.status(404).json({ error: 'Vorstellung nicht gefunden' });

    const { sitzreihen, sitzeProReihe } = vorstellungDoc.kinosaal;

    for (const s of sitze) {
      if (
        s.reihe < 1 || s.reihe > sitzreihen ||
        s.platz < 1 || s.platz > sitzeProReihe
      ) {
        return res.status(400).json({
          error: `Ungültiger Sitz ${s.reihe}-${s.platz}`
        });
      }
    }

    const bestehendeReservierungen = await Reservierung.find({
      vorstellung: vorstellungId
    });

    const belegteSitze = new Set();

    bestehendeReservierungen.forEach(r => {
      r.sitze.forEach(s => {
        belegteSitze.add(`${s.reihe}-${s.platz}`);
      });
    });

    for (const s of sitze) {
      if (belegteSitze.has(`${s.reihe}-${s.platz}`)) {
        return res.status(400).json({
          error: `Sitz ${s.reihe}-${s.platz} ist bereits reserviert`
        });
      }
    }

    // QR-Code generieren
    const qrData = `Vorstellung:${vorstellungId}|Kunde:${kundenName}|Sitze:${JSON.stringify(sitze)}`;
    const qrCode = await QRCode.toDataURL(qrData);

    const reservierung = await Reservierung.create({ vorstellung: vorstellungId, kinosaal: vorstellungDoc.kinosaal._id, kundenName, sitze, qrCode, erstelltAm: new Date() });
    res.json(reservierung);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reservierungen', async (req, res) => {
  const reservierungen = await Reservierung.find();
  res.json(reservierungen);
});
// Start server
async function start () {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/kino');
    console.log('✓ MongoDB connected');

    // Create sample document if needed
    app.listen(PORT, () => {
      console.log(`✓ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

start();
