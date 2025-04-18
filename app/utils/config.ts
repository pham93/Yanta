// src/utils/env.ts
import dotenvFlow from "dotenv-flow";

// Load environment variables from all .env files
dotenvFlow.config();

// Access environment variables
export const config = Object.freeze({
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
});

export const OPEN_ROUTER_CONFIG = {};
