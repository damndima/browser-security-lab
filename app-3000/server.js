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

app.use((req, res, next) => {
    if (config.mode === "csp-strict") {
        res.setHeader("Content-Security-Policy", "default-src 'self';");
    } else if (config.mode === "csp-balanced") {
        res.setHeader("Content-Security-Policy", "default-src 'self'; img-src *; style-src * 'unsafe-inline'; script-src 'self' http://localhost:4000 http://localhost:6001; connect-src 'self' http://localhost:4000;");    }
    next();
});

app.get('/', (req, res) => {
    let html = fs.readFileSync('index.html', 'utf8');
    let reactScript = '';

    if (config.mode === 'mode-sri-active') {
        reactScript = '<script src="http://localhost:6001/react-mock.js" integrity="sha256-ZUbuC7W+uSiutmjIyPPY/QRd+CnexOXX8ClnzumKbEk=" crossorigin="anonymous"></script>';
    } else if (config.mode === 'mode-insecure') {
        reactScript = '<script src="http://localhost:6001/react-mock.js"></script>';
    }

    html = html.replace('', reactScript);
    
    res.send(html);
});

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