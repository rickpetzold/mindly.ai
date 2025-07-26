import { handleOptions, getWebhookUrl } from "../utils";

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
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "Failed to forward to webhook",
        details: err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function OPTIONS(request: Request) {
  return handleOptions(request);
}
