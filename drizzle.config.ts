import { defineConfig } from "drizzle-kit";

// The project is client-only (Supabase). Make DATABASE_URL optional so
// local dev without a Postgres DB won't throw. If you need drizzle migrations,
// set `DATABASE_URL` in your environment.
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
