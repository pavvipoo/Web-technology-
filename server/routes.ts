import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // FRONTEND ONLY APP
  // No backend routes are required for the core functionality as per instructions.
  // The server exists solely to serve the static frontend assets.
  
  return httpServer;
}
