const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static("frontend/src"));

// Environment variables (keep these secret!)
const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const N8N_WEBHOOK_BASE = process.env.N8N_WEBHOOK_BASE;

// Proxy endpoints
app.post("/api/vapi/start", async (req, res) => {
  try {
    const { userId } = req.body;

    // Call n8n to get user data
    const userDataResponse = await fetch(`${N8N_WEBHOOK_BASE}/get-user-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const userData = await userDataResponse.json();

    // Return Vapi config without exposing API key
    res.json({
      assistantId: VAPI_ASSISTANT_ID,
      userData,
      // Frontend will use Vapi's client-side SDK with their own API key
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy n8n webhooks
app.post("/api/logs/audio", async (req, res) => {
  try {
    const response = await fetch(
      `${N8N_WEBHOOK_BASE}/webhook-test/new-log-audio`,
      {
        method: "POST",
        body: req.body,
        headers: req.headers,
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/logs/text", async (req, res) => {
  try {
    const response = await fetch(
      `${N8N_WEBHOOK_BASE}/webhook-test/text-log-input`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/logs/image", async (req, res) => {
  try {
    const response = await fetch(
      `${N8N_WEBHOOK_BASE}/webhook-test/image-log-input`,
      {
        method: "POST",
        body: req.body,
        headers: req.headers,
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
