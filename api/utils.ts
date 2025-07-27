export async function handleOptions(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export function getWebhookUrl(endpoint: string): string {
  const { N8N_WEBHOOK_BASE, ENVIRONMENT = "test" } = process.env;

  console.log("N8N_WEBHOOK_BASE", N8N_WEBHOOK_BASE);
  console.log("ENVIRONMENT", ENVIRONMENT);

  const endpoints: Record<string, string> = {
    "new-log-audio":
      ENVIRONMENT === "test"
        ? "webhook-test/new-log-audio"
        : "webhook/new-log-audio",
    "text-log-input":
      ENVIRONMENT === "test"
        ? "webhook-test/text-log-input"
        : "webhook/text-log-input",
    "image-log-input":
      ENVIRONMENT === "test"
        ? "webhook-test/image-log-input"
        : "webhook/image-log-input",
    "vapi-call":
      ENVIRONMENT === "test" ? "webhook-test/vapi-call" : "webhook/vapi-call",
  };

  return `${N8N_WEBHOOK_BASE}/${endpoints[endpoint]}`;
}
