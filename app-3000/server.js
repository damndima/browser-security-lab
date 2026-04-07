const express = require('express');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto');
const https = require('https');
const http = require('http');

const app = express();

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const version = fs.readFileSync('version.txt', 'utf8').trim();

console.log(`[System] Starting ${config.appName} v${version}...`);

if (config.mode === "mode1") {
    app.use(cors()); 
}

app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

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

let emails = [
  { id: 1, sender: "boss@company.com", subject: "Звіт", body: "Будь ласка, надішліть звіт до вечора." },
  { id: 2, sender: "promo@shop.com", subject: "Знижки!", body: "Тільки сьогодні -50% на все." }
];

const users = {
    "mario": "session-mario-777",
    "luigi": "session-luigi-888"
};

let activeSessions = {}; 

app.get('/login', (req, res) => {
    const username = req.query.username; 
    
    if (users[username]) {
        const sessionId = users[username];
        const csrfToken = crypto.randomBytes(16).toString('hex');
        
        activeSessions[sessionId] = {
            loginTime: Date.now(),
            csrfToken: csrfToken
        }; 

        res.setHeader('Set-Cookie', `SessionID=${sessionId}; Path=/api; HttpOnly; Secure; SameSite=Strict`);
        res.json({ success: true, message: "Login Successful!", token: csrfToken });
    } else {
        res.status(401).json({ success: false, message: "User not found" });
    }
});

app.get('/api/logout', (req, res) => {
    const cookieHeader = req.headers.cookie;
    if (cookieHeader && cookieHeader.includes('SessionID=')) {
        const sessionId = cookieHeader.split('SessionID=')[1].split(';')[0];
        delete activeSessions[sessionId]; 
    }
    res.setHeader('Set-Cookie', `SessionID=; Path=/api; HttpOnly; Secure; expires=Thu, 01 Jan 1970 00:00:00 UTC`);
    res.json({ success: true, message: "Logged out from server" });
});

app.get('/api/emails', (req, res) => {
    const cookieHeader = req.headers.cookie;

    if (cookieHeader && cookieHeader.includes('SessionID=')) {
        const sessionId = cookieHeader.split('SessionID=')[1].split(';')[0];
        
        if (activeSessions[sessionId]) {
            const sessionAgeMs = Date.now() - activeSessions[sessionId].loginTime;
            if (sessionAgeMs > 2 * 60 * 1000) {
                delete activeSessions[sessionId];
                return res.status(401).json({ error: "401 Unauthorized: Session expired" });
            }
            return res.json(emails);
        }
    }
    res.status(401).json({ error: "401 Unauthorized" });
});

app.post('/api/emails/delete/:id', (req, res) => {
    const cookieHeader = req.headers.cookie;
    const clientCsrfToken = req.headers['x-csrf-token']; 

    if (cookieHeader && cookieHeader.includes('SessionID=')) {
        const sessionId = cookieHeader.split('SessionID=')[1].split(';')[0];
        
        if (activeSessions[sessionId]) {
            const serverCsrfToken = activeSessions[sessionId].csrfToken;
            
            if (!clientCsrfToken || clientCsrfToken !== serverCsrfToken) {
                return res.status(403).json({ error: "403 Forbidden: Invalid CSRF Token" });
            }

            const emailIdToDelete = parseInt(req.params.id);
            emails = emails.filter(email => email.id !== emailIdToDelete);
            return res.json({ success: true, message: "Email deleted" });
        }
    }
    res.status(401).json({ error: "Unauthorized" });
});

const httpsOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

https.createServer(httpsOptions, app).listen(3443, () => {
    console.log(`🔒 Secure Server is running on https://localhost:3443`);
});

const redirectApp = express();
redirectApp.use((req, res) => {
    res.redirect(301, `https://localhost:3443${req.url}`);
});

http.createServer(redirectApp).listen(3000, () => {
    console.log(`➡️ HTTP Redirect Server is catching requests on http://localhost:3000`);
});