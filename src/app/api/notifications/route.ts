import { NextResponse } from "next/server";
import { notificationService } from "@/lib/notifications/service";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  const userId = session?.userId || "usr-cust-01";

  const notifications = await notificationService.listByUser(userId);

  return NextResponse.json({
    notifications,
    count: notifications.length,
  }, { status: 200 });
}
