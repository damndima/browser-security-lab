const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());

app.use(express.static(__dirname));

app.get('/api/messages', (req, res) => {
    res.json({ status: "success", message: "У вас немає нових повідомлень від підтримки." });
});

app.listen(port, () => {
    console.log(`Partner Server (Port ${port}) is running!`);
});