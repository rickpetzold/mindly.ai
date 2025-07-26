const fetch = require("node-fetch");

// Load config.env only in local development
if (!process.env.VERCEL) {
  require("dotenv").config({ path: 'backend/config.env' });
}

// Environment variables
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

module.exports = async (req, res) => {
  // Handle CORS
  const allowedOrigins = ['https://whisper2.preview.softr.app', 'https://whisper2.softr.app'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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
};