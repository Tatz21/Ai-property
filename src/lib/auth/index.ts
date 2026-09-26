export type UserRole = "customer" | "agent" | "owner" | "developer" | "admin";

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  serviceAreas?: string[];
  permissions: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  customer: ["property:read", "ai:chat", "shortlist:write", "visit:request"],
  agent: ["property:read", "lead:read", "lead:write", "visit:manage", "commission:read"],
  owner: ["property:read", "property:write", "inquiry:read"],
  developer: ["property:read", "project:write", "analytics:read"],
  admin: ["*"]
};

export function hasPermission(session: UserSession | null, requiredPermission: string): boolean {
  if (!session) return false;
  if (session.role === "admin" || session.permissions.includes("*")) return true;
  return session.permissions.includes(requiredPermission);
}

// Development default session
export const DEV_ADMIN_SESSION: UserSession = {
  userId: "admin-master-01",
  name: "System Administrator",
  email: "admin@estateai.kolkata.in",
  role: "admin",
  permissions: ["*"]
};

export const DEV_CUSTOMER_SESSION: UserSession = {
  userId: "usr-01",
  name: "Dr. Anirban Sengupta",
  email: "anirban.s@example.com",
  role: "customer",
  permissions: ROLE_PERMISSIONS.customer
};
