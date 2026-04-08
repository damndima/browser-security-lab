const express = require('express');
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));

let bookings = [];

function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/book', (req, res) => {
    const { name, surname, email, age, date } = req.body;

    if (!name || !surname || !email || !age || !date) {
        return res.status(400).send("<h1>400 Bad Request</h1><p>Всі поля є обов'язковими.</p>");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send("<h1>400 Bad Request</h1><p>Неправильний формат email.</p>");
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
        return res.status(400).send("<h1>400 Bad Request</h1><p>Вік має бути реальним числом від 5 до 100.</p>");
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).send("<h1>400 Bad Request</h1><p>Неіснуюча дата.</p>");
    }

    bookings.push({ name, surname, email, age, date });

    res.send(`
        <h1>Бронювання успішне!</h1>
        <p><strong>Name:</strong> ${escapeHTML(name)}</p>
        <p><strong>Surname:</strong> ${escapeHTML(surname)}</p>
        <p><strong>Email:</strong> ${escapeHTML(email)}</p>
        <p><strong>Age:</strong> ${escapeHTML(age)}</p>
        <p><strong>Date:</strong> ${escapeHTML(date)}</p>
        <a href="/">Назад</a>
    `);
});

app.listen(port, () => {
    console.log(`🏕️ Camp Booking Validator running on http://localhost:${port}`);
});