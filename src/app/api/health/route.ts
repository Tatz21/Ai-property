import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

export async function GET() {
  try {
    const dbHealth = await db.healthCheck();

    return NextResponse.json({
      status: "operational",
      version: "1.0.0",
      environment: env.NODE_ENV,
      services: {
        database: dbHealth.database,
        propertiesCount: dbHealth.propertiesCount,
        leadsCount: dbHealth.leadsCount,
        aiEngine: env.AI_API_KEY ? "configured" : "ready (fallback active)"
      },
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      status: "degraded",
      error: error?.message || "Internal server check failed",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
