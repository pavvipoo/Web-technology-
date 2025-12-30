import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// NOTE: This application is Frontend-Only. 
// These schemas are primarily used for type generation and consistency,
// even though we are not using a real database for the main features.

// === GITHUB API TYPES (Mapped for frontend use) ===

export const githubUserSchema = z.object({
  login: z.string(),
  avatar_url: z.string(),
  html_url: z.string(),
});

export const githubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.string(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  language: z.string().nullable(),
  updated_at: z.string(),
  owner: githubUserSchema,
});

export type GithubUser = z.infer<typeof githubUserSchema>;
export type GithubRepo = z.infer<typeof githubRepoSchema>;

// === SIMULATED TYPES (For LocalStorage/Mocking) ===

// For the simulated Profile page
export const userProfileSchema = z.object({
  username: z.string(),
  totalSearches: z.number(),
  totalBookmarks: z.number(),
  avatar: z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Export chat schema from models
export * from "./models/chat";

// For Repo Chat messages
export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "ai"]),
  content: z.string(),
  timestamp: z.number(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
