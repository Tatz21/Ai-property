import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().optional().default("memory://estateai_kolkata"),
  SESSION_SECRET: z.string().default("dev_secret_key_change_in_production_32_chars_min"),
  AI_PROVIDER: z.enum(["gemini", "openai", "mock"]).default("mock"),
  GEMINI_API_KEY: z.string().optional(),
  STORAGE_PROVIDER: z.enum(["local", "s3", "gcs"]).default("local"),
  NOTIFICATION_PROVIDER: z.enum(["mock", "twilio", "resend"]).default("mock"),
});

export function getValidatedEnv() {
  const parsed = EnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    AI_PROVIDER: process.env.AI_PROVIDER || "mock",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || "local",
    NOTIFICATION_PROVIDER: process.env.NOTIFICATION_PROVIDER || "mock",
  });

  if (!parsed.success) {
    console.warn("⚠️ Environment validation warning, falling back to safe defaults:", parsed.error.format());
    return EnvSchema.parse({});
  }

  return parsed.data;
}

export const ENV = getValidatedEnv();
