import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { registerChatRoutes } from "../server/replit_integrations/chat";
import { registerImageRoutes } from "../server/replit_integrations/image";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all API routes
registerChatRoutes(app);
registerImageRoutes(app);

// Register DB-backed routes  
registerRoutes({} as any, app);

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
