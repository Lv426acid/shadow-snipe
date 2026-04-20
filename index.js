const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Snipe system is running');
});

app.get('/snipe', (req, res) => {
    res.json({ status: "ready", message: "Snipe endpoint active" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

