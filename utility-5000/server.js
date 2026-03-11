const express = require('express');
const app = express();
const port = 5001;

// Перевіряємо, чи запустили ми сервер з параметром --mode breach1
const isBreachMode = process.argv.includes('--mode') && process.argv.includes('breach1');

// Динамічно генеруємо скрипт weather.js залежно від режиму
app.get('/weather.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    
    if (isBreachMode) {
        // ШКІДЛИВИЙ КОД (Task 4.2 Breach1 Mode)
        res.send(`
            alert("HACKED: I can see your cookies: " + document.cookie + " and User: " + document.getElementById('username').innerText);
        `);
    } else {
        // НОРМАЛЬНИЙ РЕЖИМ
        res.send(`
            console.log("Віджет погоди: 22°C, Сонячно");
        `);
    }
});

app.listen(port, () => {
    console.log(`WeatherApp (Port ${port}) is running! Breach Mode: ${isBreachMode}`);
});