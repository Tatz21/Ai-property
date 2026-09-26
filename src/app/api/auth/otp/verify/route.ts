import { NextResponse } from "next/server";
import { OTPVerifySchema } from "@/lib/auth/types";
import { usersDb } from "@/lib/db/users";
import { setServerSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = OTPVerifySchema.parse(body);

    if (validated.otp !== "123456") {
      return NextResponse.json(
        { error: { code: "INVALID_OTP", message: "Invalid verification code. Please check and retry." } },
        { status: 400 }
      );
    }

    let user = await usersDb.findByPhoneOrEmail(validated.phoneOrEmail);

    if (!user) {
      // Auto-create user on first OTP login
      const isEmail = validated.phoneOrEmail.includes("@");
      user = await usersDb.create({
        name: validated.name || (isEmail ? validated.phoneOrEmail.split("@")[0] : "Verified User"),
        email: isEmail ? validated.phoneOrEmail : `${validated.phoneOrEmail}@estateai.temp`,
        phone: isEmail ? undefined : validated.phoneOrEmail,
        role: validated.role || "customer",
        status: "active",
      });
    }

    await setServerSession(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: error.errors?.[0]?.message || error.message } },
      { status: 400 }
    );
  }
}
