const express = require('express');
const path    = require('path');

const app     = express();
const API_KEY = process.env.ANTHROPIC_API_KEY;
const BASE    = 'https://api.anthropic.com/v1';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Shared Anthropic headers (key bleibt server-seitig)
const headers = () => ({
  'Content-Type':    'application/json',
  'x-api-key':       API_KEY,
  'anthropic-version': '2023-06-01'
});

// GET /api/models → verfügbare Claude-Modelle
app.get('/api/models', async (req, res) => {
  try {
    const r = await fetch(`${BASE}/models?limit=100`, { headers: headers() });
    res.status(r.status).json(await r.json());
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
});

// POST /api/messages → Claude-Anfrage weiterleiten
app.post('/api/messages', async (req, res) => {
  try {
    const r = await fetch(`${BASE}/messages`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(req.body)
    });
    res.status(r.status).json(await r.json());
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Lernaufgaben-Ersteller läuft auf Port ${PORT}`));
