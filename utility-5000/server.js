const express = require('express');
const app = express();
const port = 5001;

const isBreachMode = process.argv.includes('--mode') && process.argv.includes('breach1');

app.get('/weather.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    
    if (isBreachMode) {
        res.send(`
            alert("HACKED: I can see your cookies: " + document.cookie + " and User: " + document.getElementById('username').innerText);
        `);
    } else {
        res.send(`
            console.log("Віджет погоди: 22°C, Сонячно");
        `);
    }
});

app.listen(port, () => {
    console.log(`WeatherApp (Port ${port}) is running! Breach Mode: ${isBreachMode}`);
});
