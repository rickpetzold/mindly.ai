import { handleOptions, getWebhookUrl } from "../utils";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "3600",
  vary: "Origin",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(getWebhookUrl("text-log-input"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "Failed to forward to webhook",
        details: err.message,
      }),
      {
        status: 500,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function OPTIONS(request: Request) {
  return handleOptions(request);
}
