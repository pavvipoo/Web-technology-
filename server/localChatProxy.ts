import express from "express";
import bodyParser from "body-parser";
import { appendFile } from "fs/promises";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8787;

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
    const GEMINI_REST_URL = process.env.GEMINI_REST_URL ||
      "https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.5-flash:generateContent";

    if (!GEMINI_API_KEY) {
      await appendFile("localChatProxy.log", `[${new Date().toISOString()}] GEMINI_API_KEY missing\n`);
      return res.status(500).json({ error: "GEMINI_API_KEY not set in environment" });
    }

    const payload = {
      model: "gemini-2.5-flash",
      // request streaming if provider supports it
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
      const text = await upstream.text().catch(() => "");
      const msg = `[${new Date().toISOString()}] Upstream error: ${upstream.status} ${text}\n`;
      console.error(msg);
      await appendFile("localChatProxy.log", msg);
      return res.status(502).json({ error: "Upstream Gemini API error", details: text });
    }

    const contentType = upstream.headers.get("content-type") || "";

    // If upstream provided a stream (SSE or chunked), proxy it as SSE to the client.
    if (contentType.includes("text/event-stream") || contentType.includes("stream") || upstream.body) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = (upstream.body as any).getReader?.();
      if (!reader) {
        // Fallback: pipe raw response text
        const text = await upstream.text();
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
        return res.end();
      }

      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          // Forward raw chunk(s) to client. If upstream uses SSE, chunks will contain 'data: ...' lines.
          res.write(chunk);
        }
      } catch (err) {
        const msg = `[${new Date().toISOString()}] Streaming read error: ${String(err)}\n`;
        console.error(msg);
        await appendFile("localChatProxy.log", msg);
      } finally {
        try {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        } catch {}
        res.end();
      }

      return;
    }

    // Fallback: parse JSON and return { content }
    const data = await upstream.json().catch(() => null);
    let content = "";
    if (!data) content = "(no response)";
    else if (data.candidates && Array.isArray(data.candidates) && data.candidates[0]) content = data.candidates[0].content || JSON.stringify(data.candidates[0]);
    else if (data.text) content = data.text;
    else content = JSON.stringify(data);

    return res.json({ content });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Internal proxy error" });
  }
});

app.listen(PORT, () => {
  console.log(`Local chat proxy listening on http://localhost:${PORT}`);
});
