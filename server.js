const express = require('express');
const fs = require('fs');
const cors = require('cors');
const Fuse = require('fuse.js'); // npm install fuse.js

const app = express();
app.use(cors());

const PORT = 3000;

// Load monastery data
const monasteries = JSON.parse(fs.readFileSync('./monasteries.json', 'utf-8'));

// Configure Fuse.js fuzzy search
const fuse = new Fuse(monasteries, {
  keys: ['Name', 'Postal_Address', 'District'],
  threshold: 0.3, // Lower = stricter matching
  includeScore: true
});

// AI Search Endpoint
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  if (!query) {
    return res.json(monasteries); // Return all if no query
  }

  const results = fuse.search(query).map(r => r.item); // Ranked results
  res.json(results);
});

// Categorization Endpoint
app.get('/categories', (req, res) => {
  const categories = {};

  monasteries.forEach(m => {
    const district = m.District || 'Unknown';
    if (!categories[district]) {
      categories[district] = [];
    }
    categories[district].push(m);
  });

  res.json(categories); // { "East Sikkim": [...], "West Sikkim": [...] }
});

app.listen(PORT, () => {
  console.log(`AI Search Server running on http://localhost:${PORT}`);
});
