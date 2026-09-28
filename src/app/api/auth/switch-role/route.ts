import { NextResponse } from "next/server";
import { usersDb } from "@/lib/db/users";
import { setServerSession } from "@/lib/auth/session";
import { UserRole } from "@/lib/auth/types";

export async function POST(req: Request) {
  try {
    const { role } = await req.json();

    const roleToEmail: Record<string, string> = {
      admin: "admin@estateai.kolkata.in",
      customer: "anirban.s@example.com",
      owner: "debasish.roy@example.com",
      agent: "sanjay.b@estateai.kolkata.in",
      developer: "contact@shapoorji-bengal.com",
    };

    const targetEmail = roleToEmail[role] || "admin@estateai.kolkata.in";
    const user = await usersDb.findByEmail(targetEmail);

    if (!user) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "User persona not found" } },
        { status: 404 }
      );
    }

    await setServerSession(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: `Switched session to ${user.name} (${user.role.toUpperCase()})`,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "SWITCH_ERROR", message: error.message } },
      { status: 400 }
    );
  }
}
