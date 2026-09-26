import { NextResponse } from "next/server";
import { SignupSchema } from "@/lib/auth/types";
import { usersDb } from "@/lib/db/users";
import { setServerSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = SignupSchema.parse(body);

    const existingUser = await usersDb.findByEmail(validated.email);
    if (existingUser) {
      return NextResponse.json(
        { error: { code: "USER_EXISTS", message: "An account with this email already exists" } },
        { status: 400 }
      );
    }

    const newUser = await usersDb.create({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      passwordHash: validated.password, // hashed in production
      role: validated.role,
      status: "active",
    });

    if (validated.role === "agent" && validated.serviceAreas?.length) {
      await usersDb.updateAgentProfile(newUser.id, {
        serviceAreas: validated.serviceAreas,
      });
    }

    await setServerSession(newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
