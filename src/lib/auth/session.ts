import { cookies } from "next/headers";
import { UserSession, ROLE_PERMISSIONS, UserRole } from "./index";
import { usersDb } from "@/lib/db/users";

const SESSION_COOKIE_NAME = "estateai_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export async function setServerSession(user: { id: string; email: string; role: UserRole; name: string }) {
  const cookieStore = await cookies();
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  // Set HTTP-only secure cookie
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearServerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getServerSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const parsed: SessionPayload = JSON.parse(sessionCookie.value);
    const user = await usersDb.findById(parsed.userId);

    if (!user || user.status !== "active") {
      return null;
    }

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: ROLE_PERMISSIONS[user.role] || [],
    };
  } catch (error) {
    return null;
  }
}
