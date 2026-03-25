const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 6001; 

app.use(cors());

const isBreachMode = process.argv.includes('--mode') && process.argv.includes('breach');

app.get('/react-mock.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    
    if (isBreachMode) {
        res.send('alert("CRITICAL: CDN Compromised! Stealing data...");');
    } else {
        res.send('console.log("React v1.0.0 loaded from CDN (Port 6000)");');
    }
});

app.use(express.static(__dirname));

app.listen(port, () => {
    console.log(`CDN (StaticHost) is running on http://localhost:${port}! Breach Mode: ${isBreachMode}`);
});