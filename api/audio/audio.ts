import { handleOptions, getWebhookUrl } from "../utils";

export async function POST(request: Request) {
  try {
    // Extract data from FormData (what frontend sends)
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return new Response(JSON.stringify({ error: "No audio file provided" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Create a new FormData for n8n with binary file
    const n8nFormData = new FormData();
    n8nFormData.append("file", file); // Send the actual file
    n8nFormData.append("userId", userId);

    // Send FormData to n8n (n8n can handle multipart/form-data)
    const response = await fetch(getWebhookUrl("new-log-audio"), {
      method: "POST",
      body: n8nFormData, // Send as FormData, not JSON
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
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
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export async function OPTIONS(request: Request) {
  return handleOptions(request);
}
