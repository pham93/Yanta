import { defineConfig } from "drizzle-kit";
import { config } from "~/utils/config";

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});
