import express, { type Request, Response, NextFunction } from "express";
import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { sql, eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI, Modality } from "@google/genai";

// === SCHEMA DEFINITIONS ===

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  repoId: text("repo_id").notNull(),
  repoData: jsonb("repo_data").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  query: text("query").notNull(),
  repositories: jsonb("repositories").notNull().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// === DATABASE (EXPLICIT CONFIG) ===

let _db: any = null;
function db() {
  if (!_db) {
    // We use the provided credentials directly for maximum reliability
    const pool = new Pool({
      user: "postgres",
      host: "db.dbanyyxnheukwnmtyura.supabase.co",
      database: "postgres",
      password: "Yash12211@1",
      port: 6543, // Pooling port
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      max: 1
    });
    _db = drizzle(pool, { schema: { conversations, messages, bookmarks, searchHistory } });
  }
  return _db;
}

const chatStorage = {
  async getConversation(id: number) {
    const [conversation] = await db().select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  },
  async getAllConversations() {
    return db().select().from(conversations).orderBy(desc(conversations.createdAt));
  },
  async createConversation(title: string) {
    const [conversation] = await db().insert(conversations).values({ title }).returning();
    return conversation;
  },
  async deleteConversation(id: number) {
    await db().delete(messages).where(eq(messages.conversationId, id));
    await db().delete(conversations).where(eq(conversations.id, id));
  },
  async getMessagesByConversation(conversationId: number) {
    return db().select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  },
  async createMessage(conversationId: number, role: string, content: string) {
    const [message] = await db().insert(messages).values({ conversationId, role, content }).returning();
    return message;
  },
};

// === AI CLIENTS ===

const genAI = new GoogleGenerativeAI(process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "");
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const imageAI = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

// === EXPRESS APP ===

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Chat Routes ---

app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    res.setHeader("Content-Type", "text/event-stream");
    const result = await chatModel.generateContentStream(message);
    for await (const chunk of result.stream) {
      const content = chunk.text() || "";
      if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Chat error:", error);
    res.end();
  }
});

app.get("/api/conversations", async (_req, res) => {
  try {
    const list = await chatStorage.getAllConversations();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: "Storage Error: " + err.message });
  }
});

app.post("/api/conversations", async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = await chatStorage.createConversation(title || "New Chat");
    res.status(201).json(conversation);
  } catch (err: any) {
    res.status(500).json({ error: "Storage Error: " + err.message });
  }
});

app.get("/api/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const conversation = await chatStorage.getConversation(id);
    if (!conversation) return res.status(404).json({ error: "Not found" });
    const msgs = await chatStorage.getMessagesByConversation(id);
    res.json({ ...conversation, messages: msgs });
  } catch (err: any) {
    res.status(500).json({ error: "Storage Error: " + err.message });
  }
});

app.post("/api/conversations/:id/messages", async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const { content } = req.body;
    await chatStorage.createMessage(conversationId, "user", content);
    const history = await chatStorage.getMessagesByConversation(conversationId);
    const contents = history.map((m: any) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] }));
    
    res.setHeader("Content-Type", "text/event-stream");
    const result = await chatModel.generateContentStream({ contents });
    let full = "";
    for await (const chunk of result.stream) {
      const text = chunk.text() || "";
      if (text) {
        full += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }
    await chatStorage.createMessage(conversationId, "assistant", full);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    res.status(500).json({ error: "Chat Msg Error: " + err.message });
  }
});

// --- Repository Insights ---

app.post("/api/repo-insights", async (req, res) => {
  try {
    const { repoName, description, language } = req.body;
    const prompt = `Analyze repo: ${repoName}. Return JSON with health_score (total, quality, security, maintenance), architecture_mermaid (flowchart TD), top_tips, and summary.`;
    const result = await chatModel.generateContent(prompt);
    const respText = result.response.text();
    const start = respText.indexOf("{");
    const end = respText.lastIndexOf("}");
    res.json(JSON.parse(respText.slice(start, end + 1)));
  } catch (err) {
    res.status(500).json({ error: "Insight failed" });
  }
});

// --- User Bookmarks ---

app.get("/api/user/bookmarks", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });
    const result = await db().select().from(bookmarks).where(eq(bookmarks.userId, String(userId)));
    res.json(result.map((b: any) => b.repoData));
  } catch (err: any) {
    res.status(500).json({ error: "DB Error: " + err.message });
  }
});

app.post("/api/user/bookmarks", async (req: Request, res: Response) => {
  try {
    const { userId, repo } = req.body;
    const existing = await db().select().from(bookmarks).where(and(eq(bookmarks.userId, userId), eq(bookmarks.repoId, String(repo.id))));
    if (existing.length > 0) return res.json({ message: "Exists" });
    await db().insert(bookmarks).values({ userId, repoId: String(repo.id), repoData: repo });
    res.status(201).json({ message: "Saved" });
  } catch (err: any) {
    res.status(500).json({ error: "DB Error: " + err.message });
  }
});

app.delete("/api/user/bookmarks/:repoId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    await db().delete(bookmarks).where(and(eq(bookmarks.userId, String(userId)), eq(bookmarks.repoId, req.params.repoId)));
    res.json({ message: "Removed" });
  } catch (err: any) {
    res.status(500).json({ error: "DB Error: " + err.message });
  }
});

// --- Search History ---

app.get("/api/user/search-history", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const result = await db().select().from(searchHistory).where(eq(searchHistory.userId, String(userId))).orderBy(desc(searchHistory.createdAt)).limit(50);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: "DB Error: " + err.message });
  }
});

app.post("/api/user/search-history", async (req: Request, res: Response) => {
  try {
    const { userId, query, repositories } = req.body;
    await db().insert(searchHistory).values({ userId, query, repositories: repositories || [] });
    res.status(201).json({ message: "Saved" });
  } catch (err: any) {
    res.status(500).json({ error: "DB Error: " + err.message });
  }
});

// --- Image Generation ---

app.post("/api/generate-image", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const response = await imageAI.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
    });
    const candidate = response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find((p: any) => p.inlineData);
    res.json({ b64_json: imagePart?.inlineData?.data, mimeType: imagePart?.inlineData?.mimeType || "image/png" });
  } catch (err: any) {
    res.status(500).json({ error: "Image failed: " + err.message });
  }
});

// --- Global ---

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", v: "explicit-db-1" });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error", error: String(err) });
});

export default app;
