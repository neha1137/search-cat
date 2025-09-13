// preprocess.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser'); // npm install csv-parser

const inputFile = path.join(__dirname, 'sikkimmonastery.csv');
const outputFile = path.join(__dirname, 'monasteries.json');

const results = [];

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    results.push(row);
  })
  .on('end', () => {
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`CSV converted to JSON at ${outputFile}`);
  });
