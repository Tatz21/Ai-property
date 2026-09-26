import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { usersDb } from "@/lib/db/users";
import { UserRole } from "@/lib/auth/types";
import { z } from "zod";

const AdminUserUpdateSchema = z.object({
  userId: z.string(),
  role: z.enum(["customer", "agent", "owner", "developer", "admin"]).optional(),
  status: z.enum(["active", "suspended", "pending_verification"]).optional(),
});

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Admin privileges required" } },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") as UserRole | undefined;

  const users = await usersDb.findMany(role || undefined);

  return NextResponse.json({
    users: users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    })),
  }, { status: 200 });
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Admin privileges required" } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = AdminUserUpdateSchema.parse(body);

    const updated = await usersDb.update(validated.userId, {
      ...(validated.role ? { role: validated.role } : {}),
      ...(validated.status ? { status: validated.status } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "User not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        status: updated.status,
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
