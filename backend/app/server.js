const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://whisper2.preview.softr.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment variables (keep these secret!)
const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const N8N_WEBHOOK_BASE = process.env.N8N_WEBHOOK_BASE;
const ENVIRONMENT = process.env.ENVIRONMENT || 'local';

// Determine webhook URLs based on environment
const getWebhookUrl = (endpoint) => {
  if (ENVIRONMENT === 'local') {
    const testEndpoints = {
      'new-log-audio': 'webhook-test/new-log-audio',
      'text-log-input': 'webhook-test/post-query',
      'image-log-input': 'webhook-test/image-log-input',
      'get-user-data': 'webhook-test/post-query'
    };
    return `${N8N_WEBHOOK_BASE}/${testEndpoints[endpoint] || endpoint}`;
  }
  return `${N8N_WEBHOOK_BASE}/${endpoint}`;
};

// Proxy endpoints
app.post("/api/vapi/start", async (req, res) => {
  console.log(`${req.method} ${req.url} from ${req.headers.origin}`);
  console.log('Request headers:', req.headers);
  
  try {
    const { userId } = req.body;

    // Call n8n to get user data
    const userDataResponse = await fetch(getWebhookUrl('get-user-data'), {
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
      getWebhookUrl('new-log-audio'),
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
      getWebhookUrl('text-log-input'),
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
      getWebhookUrl('image-log-input'),
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: ENVIRONMENT });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${ENVIRONMENT}`);
});
