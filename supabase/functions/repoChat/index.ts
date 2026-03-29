// Supabase Edge Function: repoChat
// Deploy with `supabase functions deploy repoChat` and set secret `GEMINI_API_KEY`.
// Optionally set `GEMINI_REST_URL` if your Gemini provider expects a custom endpoint.
// - If GEMINI_REST_URL is omitted, this function uses Google's official Gemini endpoint.
// - If GEMINI_REST_URL is set, it will be used as the full POST endpoint.
//   You may include a `{model}` placeholder in GEMINI_REST_URL that will be replaced by the requested model.
//
// Example:
//   GEMINI_REST_URL=https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
//   GEMINI_API_KEY=your_api_key_here
//
// Request body schema (POST):
// {
//   "messages": [{ "role": "user"|"assistant"|"system"|"model", "content": "text" }],
//   "prompt": "optional fallback prompt string",
//   "system": "optional system instruction",
//   "model": "gemini-1.5-flash" | "gemini-1.5-pro" | ...,
//   "temperature": 0.2,
//   "maxOutputTokens": 1024,
//   "topP": 0.95,
//   "topK": 40
// }
//
// Response mirrors the provider response shape. Errors return JSON with { error }.

// CORS headers for browser calls
const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, x-gemini-api-key, content-type",
};

// Utility: map generic chat messages into Gemini "contents" format
function toGeminiContents(messages: Array<{ role: string; content: string }> = []) {
  return messages
    .filter((m) => m && typeof m.content === "string" && m.content.length > 0)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : m.role === "system" ? "user" : m.role || "user",
      parts: [{ text: m.content }],
    }));
}

// Build endpoint + headers depending on environment
function buildGeminiRequest(model: string, useCustom: boolean, customUrl: string | null, apiKey: string) {
  let url: string;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (useCustom && customUrl) {
    // Allow placeholder replacement for model
    url = customUrl.replace("{model}", model).trim();
    // For custom providers, prefer Authorization: Bearer unless the provider requires query param.
    headers["Authorization"] = `Bearer ${apiKey}`;
  } else {
    // Default to Google's official Gemini REST endpoint using key as query param
    const base = "https://generativelanguage.googleapis.com";
    url = `${base}/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  }

  return { url, headers };
}

export default Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const CUSTOM_ENDPOINT = Deno.env.get("GEMINI_REST_URL")?.trim() || null;
  const USE_CUSTOM = Boolean(CUSTOM_ENDPOINT && CUSTOM_ENDPOINT.length > 0);

  let payload: any = null;
  try {
    payload = await req.json();
  } catch (_e) {
    // Allow header-only API key for local testing; payload validation happens later
  }

  const ENV_GEMINI_KEY = Deno.env.get("GEMINI_API_KEY")?.trim() || "";
  const HEADER_GEMINI_KEY = req.headers.get("x-gemini-api-key")?.trim() || "";
  const BODY_GEMINI_KEY = typeof payload?.apiKey === "string" ? payload.apiKey.trim() : "";
  const GEMINI_API_KEY = ENV_GEMINI_KEY || HEADER_GEMINI_KEY || BODY_GEMINI_KEY;

  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "GEMINI_API_KEY not set. Set it with `supabase secrets set GEMINI_API_KEY=...` and redeploy. For local testing only, you may send it in header `x-gemini-api-key` or body `apiKey` (never from browsers in production).",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  if (!payload || typeof payload !== "object") {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const model = (payload?.model as string) || "gemini-1.5-flash";
  const temperature = typeof payload?.temperature === "number" ? payload.temperature : undefined;
  const maxOutputTokens = typeof payload?.maxOutputTokens === "number" ? payload.maxOutputTokens : undefined;
  const topP = typeof payload?.topP === "number" ? payload.topP : undefined;
  const topK = typeof payload?.topK === "number" ? payload.topK : undefined;

  // Build contents from messages or fallback to prompt
  let contents = toGeminiContents(payload?.messages);
  if ((!contents || contents.length === 0) && typeof payload?.prompt === "string" && payload.prompt.length > 0) {
    contents = [{ role: "user", parts: [{ text: payload.prompt }] }];
  }

  if (!contents || contents.length === 0) {
    return new Response(JSON.stringify({ error: "Missing messages or prompt" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // System instruction if provided
  const system_instruction =
    typeof payload?.system === "string" && payload.system.length > 0
      ? { role: "system", parts: [{ text: payload.system }] }
      : undefined;

  const generationConfig: Record<string, unknown> = {};
  if (temperature !== undefined) generationConfig.temperature = temperature;
  if (maxOutputTokens !== undefined) generationConfig.maxOutputTokens = maxOutputTokens;
  if (topP !== undefined) generationConfig.topP = topP;
  if (topK !== undefined) generationConfig.topK = topK;

  const body: Record<string, unknown> = { contents };
  if (system_instruction) body["system_instruction"] = system_instruction;
  if (Object.keys(generationConfig).length > 0) body["generationConfig"] = generationConfig;

  const { url, headers } = buildGeminiRequest(model, USE_CUSTOM, CUSTOM_ENDPOINT, GEMINI_API_KEY);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    // Forward provider response, but always include CORS headers
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": res.headers.get("content-type") || "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message || "Upstream request failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
