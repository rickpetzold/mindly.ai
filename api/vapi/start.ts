import { handleOptions, getWebhookUrl } from "../utils";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "3600",
  vary: "Origin",
};

export async function OPTIONS(request: Request) {
  return handleOptions(request);
}

export async function POST(request: Request) {
  const { VAPI_API_KEY, VAPI_WEBHOOK_BASE } = process.env;

  if (!VAPI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "VAPI configuration missing" }),
      {
        status: 500,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { userId } = body;

    // Get user data from n8n
    const userDataResponse = await fetch(getWebhookUrl("vapi-call"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const userData = await userDataResponse.json();

    // Create VAPI assistant with user-specific configuration
    const assistantConfig = {
      model: {
        provider: "openai",
        model: "gpt-4o",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: userData.userData.final_prompt,
          },
        ],
      },
      voice: {
        provider: "openai",
        model: "gpt-4o-mini-tts",
        speed: 1.5,
        voiceId: "echo",
      },
      firstMessage:
        "Hello Rick! Its a wonderful day in Berlin today. How can I assist you?",
      // Configure the store_information tool
      tools: [
        {
          type: "function",
          function: {
            name: "store_information",
            description:
              "Store important information from the conversation to the user's journal",
            parameters: {
              type: "object",
              properties: {
                summary: {
                  type: "string",
                  description: "Condensed summary of the information to store",
                },
                intent: {
                  type: "string",
                  enum: ["post"],
                  description: "Intent to store the information",
                },
                userId: {
                  type: "string",
                  description: "User ID for the journal entry",
                },
              },
              required: ["summary", "intent", "userId"],
            },
          },
          server: {
            url: `${VAPI_WEBHOOK_BASE || "https://mindly-ai-zeta.vercel.app"}/api/vapi/webhook`,
          },
        },
      ],
    };

    // Create assistant via VAPI API
    const assistantResponse = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assistantConfig),
    });

    if (!assistantResponse.ok) {
      const errorText = await assistantResponse.text();
      throw new Error(`VAPI assistant creation failed: ${errorText}`);
    }

    const assistant = await assistantResponse.json();

    return new Response(
      JSON.stringify({
        assistantId: assistant.id,
        success: true,
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
    console.error("VAPI start error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to initialize VAPI assistant",
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
