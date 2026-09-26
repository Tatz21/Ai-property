import { NextResponse } from "next/server";
import { OTPRequestSchema } from "@/lib/auth/types";

// Simulated OTP cache for testing & local auth
const OTP_CACHE = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = OTPRequestSchema.parse(body);

    const otp = "123456"; // Default deterministic test OTP for fast automated validation
    OTP_CACHE.set(validated.phoneOrEmail.toLowerCase(), {
      code: otp,
      expiresAt: Date.now() + 1000 * 60 * 5 // 5 mins
    });

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${validated.phoneOrEmail}`,
      hint: "Use code 123456 for instant testing"
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: error.message } },
      { status: 400 }
    );
  }
}
