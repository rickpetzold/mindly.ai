export const runtime = "nodejs";

export async function POST(request: Request) {
  const { N8N_WEBHOOK_BASE, ENVIRONMENT = "local" } = process.env;

  const getWebhookUrl = (endpoint: string) => {
    const localMap: Record<string, string> = {
      "new-log-audio": "webhook-test/new-log-audio",
      "text-log-input": "webhook-test/post-query",
      "image-log-input": "webhook-test/image-log-input",
      "get-user-data": "webhook-test/post-query",
    };
    return `${N8N_WEBHOOK_BASE}/${localMap[endpoint]}`;
  };

  try {
    const body = await request.json();

    const response = await fetch(getWebhookUrl("new-log-audio"), {
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
