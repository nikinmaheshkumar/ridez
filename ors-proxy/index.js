import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/ors', async (req, res) => {
  const { text } = req.query;
  if (!text) return res.status(400).json({ error: "Missing 'text' parameter" });

  const url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${process.env.ORS_API_KEY}&text=${encodeURIComponent(text)}&boundary.country=in`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ORS API request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`ORS Proxy running on port ${PORT}`);
});
