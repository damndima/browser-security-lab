const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const version = fs.readFileSync('version.txt', 'utf8').trim();

console.log(`[System] Starting ${config.appName} v${version}...`);

if (config.mode === "mode1") {
    app.use(cors()); 
}

app.use(express.static(__dirname));

const emails = [
  { id: 1, sender: "boss@company.com", subject: "Звіт", body: "Будь ласка, надішліть звіт до вечора." },
  { id: 2, sender: "promo@shop.com", subject: "Знижки!", body: "Тільки сьогодні -50% на все." }
];

app.get('/api/emails', (req, res) => {
  res.json(emails);
});

app.listen(port, () => {
  console.log(`GoodHost is running on http://localhost:${port}`);
});
