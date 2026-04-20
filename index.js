require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Needed to read JSON from StreamElements

// ------------------------------
// GET /snipe  (Nightbot trigger)
// ------------------------------
app.get('/snipe', (req, res) => {
    res.send("Shadow‑Snipe endpoint is online.");
});

// Utility: escape backticks for Discord
function escapeDiscord(text) {
    if (!text) return "";
    return text.replace(/`/g, "'");
}

// -----------------------------------------
// POST /snipe  (StreamElements JSON payload)
// -----------------------------------------
app.post('/snipe', async (req, res) => {
    try {
        const data = req.body;

        // Extract fields from StreamElements payload
        const twitchUser = data.user || "unknown – mod to fill in";
        const accountCreated = data.accountCreated || "";
        const firstSeen = data.firstSeen || "";
        const followerSince = data.followerSince || "";
        const subscriberFor = data.subscriberFor || "";

        const modName = data.mod || "";
        const channelName = data.channel || "";

        const chatlog = Array.isArray(data.chatlog) ? data.chatlog : [];

        // Slice logs
        const visibleLogs = chatlog.slice(0, 5);
        const fullLogs = chatlog.slice(0, 30);

        // Format visible logs
        const visibleFormatted =
            visibleLogs.length > 0
                ? visibleLogs.map(m => `• “${escapeDiscord(m)}”`).join("\n")
                : "(no chat logs available)";

        // Format hidden logs
        const hiddenFormatted =
            fullLogs.length > 0
                ? fullLogs.map(m => escapeDiscord(m)).join("\n")
                : "(no chat logs available)";

        // Build final message
        const content = `
\`\`\`
────────────────────────────────────────
⚔️  SHADOW‑SNIPE REPORT  🛡️
────────────────────────────────────────
\`\`\`

🌐 **Server/Loc:**  
🆔 **Discord ID:**  
🎮 **Steam ID:**  

🎯 **Twitch User:** ${twitchUser}  
📅 **Account Created:** ${accountCreated}  
👀 **First Seen in Chat:** ${firstSeen}  
⭐ **Follower Since:** ${followerSince}  
💎 **Subscriber For:** ${subscriberFor}  

💬 **Recent Messages (5 shown):**  
${visibleFormatted}

🔽 **click to expand more chat logs**  
||\`\`\`text
${hiddenFormatted}
\`\`\`||

🎞️ **Clip Created:**  
(no clip available)

⏱️ **VOD Timestamp:**  
(no timestamp available)

🔧 **Reported By:**  
Mod: ${modName}  
Channel: ${channelName}

📝 **Situation Analysis:**  
(Moderator will fill this in)

📌 **Result:**  
(Moderator will fill this in)

⏰ **Timestamp:**  
\`\`\`
────────────────────────────────────────
\`\`\`
`;

        // Send to Discord webhook
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
        });

        res.json({ success: true });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
