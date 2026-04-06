import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "USER";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").$type<UserRole>().default("USER").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiUsageLogs = pgTable("ai_usage_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  tokensUsed: integer("tokens_used").notNull(),
  cost: integer("cost").notNull(), // Represented in milli-cents (e.g., 1000 = 1 cent)
  promptType: text("prompt_type").notNull(), // e.g., 'repo_chat', 'insight'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => users.id),
  action: text("action").notNull(),
  targetId: text("target_id"),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const systemNotifications = pgTable("system_notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'info', 'warning', 'error', 'alert'
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// === ZOD SCHEMAS (For Type Safety & Validation) ===

export const insertUserSchema = createInsertSchema(users, {
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MODERATOR", "USER"]),
}).extend({
  email: z.string().email(),
  password: z.string().min(6),
}).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;


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

// === SIMULATED TYPES (Backward Compatibility) ===

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

