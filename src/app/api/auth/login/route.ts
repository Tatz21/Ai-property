import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/auth/types";
import { usersDb } from "@/lib/db/users";
import { setServerSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = LoginSchema.parse(body);

    const user = await usersDb.findByEmail(validated.email);
    if (!user || user.passwordHash !== validated.password) {
      return NextResponse.json(
        { error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { error: { code: "ACCOUNT_SUSPENDED", message: "Account is inactive or suspended" } },
        { status: 403 }
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
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
