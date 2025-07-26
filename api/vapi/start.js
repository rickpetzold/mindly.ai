const fetch = require("node-fetch");
export const runtime = "nodejs";

// Load config.env only in local development
if (!process.env.VERCEL) {
  require("dotenv").config({ path: "backend/config.env" });
}

// Environment variables
const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const N8N_WEBHOOK_BASE = process.env.N8N_WEBHOOK_BASE;
const ENVIRONMENT = process.env.ENVIRONMENT || "local";

// Determine webhook URLs based on environment
const getWebhookUrl = (endpoint) => {
  if (ENVIRONMENT === "local") {
    const testEndpoints = {
      "new-log-audio": "webhook-test/new-log-audio",
      "text-log-input": "webhook-test/post-query",
      "image-log-input": "webhook-test/image-log-input",
      "get-user-data": "webhook-test/post-query",
    };
    return `${N8N_WEBHOOK_BASE}/${testEndpoints[endpoint]}`;
  }
  return `${N8N_WEBHOOK_BASE}/${endpoint}`;
};

module.exports = async (req, res) => {
  // Handle CORS
  const allowedOrigins = [
    "https://whisper2.preview.softr.app",
    "https://whisper2.softr.app",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  console.log(`${req.method} ${req.url} from ${req.headers.origin}`);
  console.log("Request headers:", req.headers);

  try {
    const { userId } = req.body;

    // Call n8n to get user data
    const userDataResponse = await fetch(getWebhookUrl("get-user-data"), {
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
};
