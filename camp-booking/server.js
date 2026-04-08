const express = require('express');
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));

let bookings = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/book', (req, res) => {
    const booking = req.body;
    bookings.push(booking);

    res.send(`
        <h1>Бронювання успішне!</h1>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Surname:</strong> ${booking.surname}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Age:</strong> ${booking.age}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <a href="/">Назад</a>
    `);
});

app.listen(port, () => {
    console.log(`🏕️ Camp Booking Validator running on http://localhost:${port}`);
});