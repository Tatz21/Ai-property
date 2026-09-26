import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().optional().default("postgresql://postgres:postgres@localhost:5432/ai_property_db"),
  AUTH_SECRET: z.string().default("development-auth-secret-minimum-32-chars-length"),
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().default("gemini-2.0-flash"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AI_API_KEY: process.env.AI_API_KEY,
  AI_MODEL: process.env.AI_MODEL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
