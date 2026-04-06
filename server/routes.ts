import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAdmin, requireSuperAdmin, hashPassword } from "./auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize Auth
  setupAuth(app);

  // Admin AI Assistant endpoint
  app.post("/api/admin/chat", requireAdmin, async (req, res) => {
    try {
      const { message, history } = req.body;
      const stats = await storage.getSystemStats();
      const aiStats = await storage.getAIStats();
      const logs = await storage.getAdminActivity(5);

      const systemContext = `
        You are the GitHub Explorer Pro Admin Assistant. 
        Current System Stats:
        - Total Users: ${stats.totalUsers}
        - Total AI Requests: ${aiStats.totalAIRequests}
        - Total Tokens: ${aiStats.totalTokens}
        - Total Cost: $${(aiStats.totalCost / 100000).toFixed(2)}
        
        Recent Activity:
        ${logs.map(l => `- ${l.admin} performed ${l.action}`).join('\n')}

        Answer the admin's question based on this data. Be professional, concise, and helpful.
      `;

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: systemContext }] },
          { role: "model", parts: [{ text: "Understood. I am ready to assist with system analysis." }] },
          ...(history || [])
        ],
      });

      const result = await chat.sendMessageStream(message);

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      for await (const chunk of result.stream) {
        const content = chunk.text();
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      console.error("Admin Chat Error:", err);
      res.status(500).json({ message: "AI Assistant failed to respond" });
    }
  });


  // Seed default admin if none exists
  storage.listUsers().then(async (users) => {
    if (users.length === 0) {
      const hashedPassword = await hashPassword("admin123");
      await storage.createUser({
        username: "admin",
        password: hashedPassword,
        email: "yashwanthrao498@gmail.com",
        role: "SUPER_ADMIN",
      });
      console.log("Default SUPER_ADMIN created: yashwanthrao498@gmail.com / admin123");
    }
  });


  // === ADMIN API ROUTES ===

  // Dashboard Overview
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      const aiStats = await storage.getAIStats();
      res.json({ ...stats, ...aiStats });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // User Management
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.listUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id", requireSuperAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", requireSuperAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUser(id);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // AI Usage & Control
  app.get("/api/admin/ai/logs", requireAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getAIUsageLogs(limit);
      res.json(logs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch AI logs" });
    }
  });

  // Admin Activity Logs
  app.get("/api/admin/activity", requireAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activity = await storage.getAdminActivity(limit);
      res.json(activity);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  return httpServer;
}

