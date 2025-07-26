export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "3600",
  vary: "Origin",
};

export function OPTIONS() {
  return new Response(JSON.stringify({ message: "Hello, world!" }), {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: Request) {
  const { VAPI_API_KEY, VAPI_ASSISTANT_ID, N8N_WEBHOOK_BASE } = process.env;

  if (!VAPI_ASSISTANT_ID || !N8N_WEBHOOK_BASE) {
    return new Response(
      JSON.stringify({ error: "Missing environment variables" }),
      {
        status: 500,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  }

  const getWebhookUrl = (endpoint: string) => {
    const endpoints: Record<string, string> = {
      "new-log-audio": "new-log-audio",
      "text-log-input": "post-query",
      "image-log-input": "image-log-input",
      "get-user-data": "post-query",
    };
    return `${N8N_WEBHOOK_BASE}/${endpoints[endpoint]}`;
  };

  try {
    const body = await request.json();
    const { userId } = body;

    const userDataResponse = await fetch(getWebhookUrl("get-user-data"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const userData = await userDataResponse.json();

    return new Response(
      JSON.stringify({
        assistantId: VAPI_ASSISTANT_ID,
        userData,
      }),
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch user data",
        details: error.message,
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
