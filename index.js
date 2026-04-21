require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // JSON parsing (not used by GET but harmless)

// ------------------------------
// GET /snipe (Nightbot trigger)
// ------------------------------
app.get('/snipe', async (req, res) => {
    try {
        const mod = req.query.mod || "unknown_mod";
        const msg = req.query.msg || "no message provided";

        // Build the payload for Discord
        const payload = {
            content: `🔫 **SNIPE**\nModerator: ${mod}\nMessage: ${msg}`
        };

        // Load config
        const config = require('./config.json');

        // Send to all webhooks in config
        for (const stream of config.streams) {
            for (const webhook of stream.discord_webhooks) {
                console.log("Sending webhook to:", webhook);

                await fetch(webhook, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }
        }

        // Silent response — Nightbot says nothing
        res.status(204).send();

    } catch (err) {
        console.error("Error in /snipe:", err);
        res.status(500).send("Error processing snipe.");
    }
});

// ------------------------------
// Root endpoint (optional)
// ------------------------------
app.get('/', (req, res) => {
    res.send("Shadow-Snipe system is running.");
});

// ------------------------------
// Start server
// ------------------------------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
