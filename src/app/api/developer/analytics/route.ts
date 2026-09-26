import { NextResponse } from "next/server";
import { projectsDb } from "@/lib/db/projects";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  const developerId = session?.userId || "usr-dev-01";

  const analytics = await projectsDb.getAnalytics(developerId);

  return NextResponse.json({
    analytics,
  }, { status: 200 });
}
