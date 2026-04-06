import { db } from "./db";
import {
  type User,
  type InsertUser,
  users,
  aiUsageLogs,
  adminActivityLogs,
  systemNotifications,
  type UserRole,
} from "../shared/schema";
import { eq, sql, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User Management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;

  // AI Usage & Monitoring
  logAIUsage(userId: number | null, tokens: number, cost: number, type: string): Promise<void>;
  getAIStats(): Promise<any>;
  getAIUsageLogs(limit: number): Promise<any[]>;

  // Admin Activity & Logs
  logAdminActivity(adminId: number, action: string, details: any): Promise<void>;
  getAdminActivity(limit: number): Promise<any[]>;
  
  // Dashboard Analytics
  getSystemStats(): Promise<any>;
  
  // Session Store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser as any).returning();
    return user;
  }

  async listUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    if (!user) throw new Error("User not found");
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async logAIUsage(userId: number | null, tokens: number, cost: number, type: string): Promise<void> {
    await db.insert(aiUsageLogs).values({
      userId,
      tokensUsed: tokens,
      cost,
      promptType: type,
    });
  }

  async getAIStats(): Promise<any> {
    const totalTokens = await db.select({ value: sql`sum(${aiUsageLogs.tokensUsed})` }).from(aiUsageLogs);
    const totalCost = await db.select({ value: sql`sum(${aiUsageLogs.cost})` }).from(aiUsageLogs);
    return {
      totalTokens: Number(totalTokens[0]?.value || 0),
      totalCost: Number(totalCost[0]?.value || 0),
    };
  }

  async getAIUsageLogs(limit: number = 100): Promise<any[]> {
    return await db
      .select({
        id: aiUsageLogs.id,
        user: users.username,
        tokens: aiUsageLogs.tokensUsed,
        cost: aiUsageLogs.cost,
        type: aiUsageLogs.promptType,
        timestamp: aiUsageLogs.timestamp,
      })
      .from(aiUsageLogs)
      .leftJoin(users, eq(aiUsageLogs.userId, users.id))
      .orderBy(desc(aiUsageLogs.timestamp))
      .limit(limit);
  }

  async logAdminActivity(adminId: number, action: string, details: any): Promise<void> {
    await db.insert(adminActivityLogs).values({
      adminId,
      action,
      details,
    });
  }

  async getAdminActivity(limit: number = 50): Promise<any[]> {
    return await db
      .select({
        id: adminActivityLogs.id,
        admin: users.username,
        action: adminActivityLogs.action,
        details: adminActivityLogs.details,
        timestamp: adminActivityLogs.timestamp,
      })
      .from(adminActivityLogs)
      .leftJoin(users, eq(adminActivityLogs.adminId, users.id))
      .orderBy(desc(adminActivityLogs.timestamp))
      .limit(limit);
  }

  async getSystemStats(): Promise<any> {
    const userCount = await db.select({ value: sql`count(*)` }).from(users);
    const aiLogCount = await db.select({ value: sql`count(*)` }).from(aiUsageLogs);
    const recentActivity = await this.getAdminActivity(5);
    
    return {
      totalUsers: Number(userCount[0]?.value || 0),
      totalAIRequests: Number(aiLogCount[0]?.value || 0),
      recentActivity,
    };
  }
}

export const storage = new DatabaseStorage();

