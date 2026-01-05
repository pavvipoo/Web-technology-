// Supabase Edge Function: repoChat
// Deploy with `supabase functions deploy repoChat` and set secret `GEMINI_API_KEY`.
// Configure `GEMINI_REST_URL` if your Gemini provider expects a custom endpoint.

export default async function (req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = body.message || "";

    if (!message) {
      return new Response(JSON.stringify({ error: "message is required" }), { status: 400 });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
    const GEMINI_REST_URL = Deno.env.get("GEMINI_REST_URL") ||
      "https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.5-flash:generateContent";

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), { status: 500 });
    }

    // Payload using contents shape (compatible with earlier server code).
    const payload = {
      model: "gemini-2.5-flash",
      // Request streaming if supported by the provider. Providers may ignore this field.
      stream: true,
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    };

    const upstream = await fetch(GEMINI_REST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("Gemini request failed:", upstream.status, text);
      return new Response(JSON.stringify({ error: "Gemini API returned an error", details: text }), { status: 502 });
    }

    // If upstream returned a stream (SSE or chunked), proxy it as SSE to the client.
    const contentType = upstream.headers.get("content-type") || "";

    if (contentType.includes("text/event-stream") || contentType.includes("stream") || upstream.body) {
      // Return the raw body as an SSE stream. Set SSE headers for the client.
      const headers = new Headers();
      headers.set("Content-Type", "text/event-stream");
      headers.set("Cache-Control", "no-cache");
      headers.set("Connection", "keep-alive");

      // Note: We simply forward the upstream readable stream to the client.
      return new Response(upstream.body, { headers });
    }

    // Fallback: read JSON and return single JSON payload with content extracted.
    const data = await upstream.json().catch(() => null);
    let content = "";
    if (!data) {
      content = "(no response)";
    } else if (data.candidates && Array.isArray(data.candidates) && data.candidates[0]) {
      content = data.candidates[0].content || JSON.stringify(data.candidates[0]);
    } else if (typeof data === "string") {
      content = data;
    } else if (data.output && data.output[0] && data.output[0].content) {
      content = data.output[0].content;
    } else if (data.text) {
      content = data.text;
    } else {
      content = JSON.stringify(data);
    }

    return new Response(JSON.stringify({ content }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}
