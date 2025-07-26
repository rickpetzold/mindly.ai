import { VercelRequest, VercelResponse } from "@vercel/node";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  if (req.method === "POST") {
    // Extract userId
    const { userId } = req.body;

    const { VAPI_ASSISTANT_ID, N8N_WEBHOOK_BASE } = process.env;
    if (!VAPI_ASSISTANT_ID || !N8N_WEBHOOK_BASE) {
      return res.status(500).json({ error: "Missing env vars" });
    }

    const endpoint = "post-query";
    const webhookUrl = `${N8N_WEBHOOK_BASE}/${endpoint}`;

    const userDataResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const userData = await userDataResponse.json();

    return res.status(200).json({
      assistantId: VAPI_ASSISTANT_ID,
      userData,
    });
  }

  return res.status(405).send("Method not allowed");
}
