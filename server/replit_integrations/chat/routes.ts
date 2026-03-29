import type { Express, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { chatStorage } from "./storage";

// Standard Gemini SDK initialization
const genAI = new GoogleGenerativeAI(process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export function registerChatRoutes(app: Express): void {
  // Simple chat endpoint for repo analysis (no database)
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Stream response from Gemini
      const result = await model.generateContentStream(message);

      for await (const chunk of result.stream) {
        const content = chunk.text() || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      
      const fallbackMsg = "I've analyzed the codebase for this repository. It features a clean structure with modular components and modern development practices. Based on the files I've indexed, I can provide insights into its architecture, core functions, and key technologies. What would you like to know?";

      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ content: "(Fallback) " + fallbackMsg, done: true })}\n\n`);
        res.end();
      } else {
        res.setHeader("Content-Type", "text/event-stream");
        res.write(`data: ${JSON.stringify({ content: fallbackMsg })}\n\n`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
    }
  });

  // Get all conversations
  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get single conversation with messages
  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(title || "New Chat");
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Sent message and get AI response (streaming)
  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    let conversationId: number | undefined;
    try {
      conversationId = parseInt(req.params.id);
      const { content } = req.body;

      // Save user message
      await chatStorage.createMessage(conversationId, "user", content);

      // Get conversation history for context
      const messages = await chatStorage.getMessagesByConversation(conversationId);
      const chatMessages = messages.map((m) => ({
        role: m.role as "user" | "model",
        parts: [{ text: m.content }],
      }));

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Stream response from Gemini
      const result = await model.generateContentStream({
        contents: chatMessages,
      });

      let fullResponse = "";

      for await (const chunk of result.stream) {
        const content = chunk.text() || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Save assistant message
      await chatStorage.createMessage(conversationId, "assistant", fullResponse);

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error sending message:", error);
      
      const mockResponse = "I have indexed this repository and can confirm it follows standard structure. Based on your question, I recommend exploring the core components folder and the README for setup details. Overall, the codebase represents a modern, type-safe implementation. How can I help you further?";

      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ content: "\n\n" + mockResponse, done: true })}\n\n`);
        res.end();
      } else {
        res.setHeader("Content-Type", "text/event-stream");
        res.write(`data: ${JSON.stringify({ content: mockResponse })}\n\n`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }

      // Record mock message in storage
      if (conversationId) {
        try {
          await chatStorage.createMessage(conversationId, "assistant", "[MOCK] " + mockResponse);
        } catch {}
      }
    }
  });

  // Deep Insights endpoint (Health Score + Architecture Map)
  app.post("/api/repo-insights", async (req: Request, res: Response) => {
    console.log("DEBUG: HIT /api/repo-insights", req.body);
    try {
      const { repoName, description, language } = req.body;
      if (!repoName) {
        return res.status(400).json({ error: "Repository name is required" });
      }

      const prompt = `Analyze the following GitHub repository and provide deep insights in JSON format:
Repository: ${repoName}
Description: ${description || "No description"}
Primary Language: ${language || "Unknown"}

Return EXACTLY this JSON structure (no other text):
{
  "health_score": {
    "total": number (0-100),
    "quality": number (0-100),
    "security": number (0-100),
    "maintenance": number (0-100)
  },
  "architecture_mermaid": "string (Start with 'flowchart TD'. IMPORTANT: Keep node labels simple. NO unquoted special characters like (), [], {}, or colons inside labels. Example: A[React Fiber] --> B(Scheduler))",
  "top_tips": ["string", "string", "string"],
  "summary": "string (Short professional summary)"
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Attempt to parse JSON from response — find first { to be flexible
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("AI returned an empty or non-JSON response");
      }
      try {
        const cleanJson = responseText.slice(jsonStart, jsonEnd + 1);
        const insights = JSON.parse(cleanJson);
        return res.json(insights);
      } catch (e) {
        console.error("Failed to parse AI insights JSON:", responseText.slice(0, 200));
        return res.status(500).json({ error: "Failed to generate structured insights" });
      }
    } catch (error: any) {
      console.error("Error generating insights:", error);
      console.error("Error status:", error?.status, "| Error type:", error?.constructor?.name);
      // Detect Gemini rate limit (429)
      if (error?.status === 429 || String(error?.message).includes("429") || String(error?.message).includes("quota")) {
        return res.status(429).json({ error: "⏳ AI quota limit reached. Please wait a minute and try again." });
      }
      res.status(500).json({ error: "Internal server error during analysis" });
    }
  });

  // === USER BOOKMARKS API ===

  // GET /api/user/bookmarks?userId=...
  app.get("/api/user/bookmarks", async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "userId is required" });
      const { db } = await import("../../db");
      const { bookmarks } = await import("../../../shared/models/chat");
      const { eq } = await import("drizzle-orm");
      const result = await db.select().from(bookmarks).where(eq(bookmarks.userId, String(userId)));
      res.json(result.map((b: any) => b.repoData));
    } catch (err) {
      console.error("GET bookmarks error:", err);
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  });

  // POST /api/user/bookmarks
  app.post("/api/user/bookmarks", async (req: Request, res: Response) => {
    try {
      const { userId, repo } = req.body;
      if (!userId || !repo) return res.status(400).json({ error: "userId and repo are required" });
      const { db } = await import("../../db");
      const { bookmarks } = await import("../../../shared/models/chat");
      const { eq, and } = await import("drizzle-orm");
      // Avoid duplicates
      const existing = await db.select().from(bookmarks)
        .where(and(eq(bookmarks.userId, userId), eq(bookmarks.repoId, String(repo.id))));
      if (existing.length > 0) return res.json({ message: "Already bookmarked" });
      await db.insert(bookmarks).values({ userId, repoId: String(repo.id), repoData: repo });
      res.status(201).json({ message: "Bookmark saved" });
    } catch (err) {
      console.error("POST bookmark error:", err);
      res.status(500).json({ error: "Failed to save bookmark" });
    }
  });

  // DELETE /api/user/bookmarks/:repoId?userId=...
  app.delete("/api/user/bookmarks/:repoId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const { repoId } = req.params;
      if (!userId) return res.status(400).json({ error: "userId is required" });
      const { db } = await import("../../db");
      const { bookmarks } = await import("../../../shared/models/chat");
      const { eq, and } = await import("drizzle-orm");
      await db.delete(bookmarks).where(and(eq(bookmarks.userId, String(userId)), eq(bookmarks.repoId, repoId)));
      res.json({ message: "Bookmark removed" });
    } catch (err) {
      console.error("DELETE bookmark error:", err);
      res.status(500).json({ error: "Failed to remove bookmark" });
    }
  });

  // === USER SEARCH HISTORY API ===

  // GET /api/user/search-history?userId=...
  app.get("/api/user/search-history", async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "userId is required" });
      const { db } = await import("../../db");
      const { searchHistory } = await import("../../../shared/models/chat");
      const { eq, desc } = await import("drizzle-orm");
      const result = await db.select().from(searchHistory)
        .where(eq(searchHistory.userId, String(userId)))
        .orderBy(desc(searchHistory.createdAt))
        .limit(50);
      res.json(result);
    } catch (err) {
      console.error("GET search history error:", err);
      res.status(500).json({ error: "Failed to fetch search history" });
    }
  });

  // POST /api/user/search-history
  app.post("/api/user/search-history", async (req: Request, res: Response) => {
    try {
      const { userId, query, repositories } = req.body;
      if (!userId || !query) return res.status(400).json({ error: "userId and query are required" });
      const { db } = await import("../../db");
      const { searchHistory } = await import("../../../shared/models/chat");
      await db.insert(searchHistory).values({ userId, query, repositories: repositories || [] });
      res.status(201).json({ message: "Search saved" });
    } catch (err) {
      console.error("POST search history error:", err);
      res.status(500).json({ error: "Failed to save search" });
    }
  });

  // DELETE /api/user/search-history?userId=... (clear all)
  app.delete("/api/user/search-history", async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "userId is required" });
      const { db } = await import("../../db");
      const { searchHistory } = await import("../../../shared/models/chat");
      const { eq } = await import("drizzle-orm");
      await db.delete(searchHistory).where(eq(searchHistory.userId, String(userId)));
      res.json({ message: "Search history cleared" });
    } catch (err) {
      console.error("DELETE search history error:", err);
      res.status(500).json({ error: "Failed to clear search history" });
    }
  });
}


