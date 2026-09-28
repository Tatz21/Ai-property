import { describe, it, expect } from "vitest";
import { hasPermission, ROLE_PERMISSIONS, UserSession } from "./index";

describe("RBAC Authorization & Session Permissions Unit Tests", () => {
  it("should grant full root access (*) to admin users for any permission", () => {
    const adminSession: UserSession = {
      userId: "usr-admin-01",
      name: "Super Admin",
      email: "admin@estateai-kolkata.in",
      role: "admin",
      permissions: ["*"],
    };

    expect(hasPermission(adminSession, "property:read")).toBe(true);
    expect(hasPermission(adminSession, "property:write")).toBe(true);
    expect(hasPermission(adminSession, "lead:write")).toBe(true);
    expect(hasPermission(adminSession, "commission:admin_payout")).toBe(true);
    expect(hasPermission(adminSession, "system:settings")).toBe(true);
  });

  it("should restrict customer role to authorized customer capabilities only", () => {
    const customerSession: UserSession = {
      userId: "usr-cust-01",
      name: "Home Buyer",
      email: "buyer@example.com",
      role: "customer",
      permissions: ROLE_PERMISSIONS.customer,
    };

    expect(hasPermission(customerSession, "property:read")).toBe(true);
    expect(hasPermission(customerSession, "ai:chat")).toBe(true);
    expect(hasPermission(customerSession, "visit:request")).toBe(true);

    // Should strictly deny agent and admin actions
    expect(hasPermission(customerSession, "lead:read")).toBe(false);
    expect(hasPermission(customerSession, "property:write")).toBe(false);
    expect(hasPermission(customerSession, "commission:read")).toBe(false);
  });

  it("should enforce agent role boundaries for leads and commission visibility", () => {
    const agentSession: UserSession = {
      userId: "usr-agent-01",
      name: "Sanjay Bhattacharya",
      email: "sanjay.b@estateai-kolkata.in",
      role: "agent",
      permissions: ROLE_PERMISSIONS.agent,
    };

    expect(hasPermission(agentSession, "lead:read")).toBe(true);
    expect(hasPermission(agentSession, "lead:write")).toBe(true);
    expect(hasPermission(agentSession, "commission:read")).toBe(true);
    expect(hasPermission(agentSession, "visit:manage")).toBe(true);

    // Should not allow root admin changes
    expect(hasPermission(agentSession, "system:manage")).toBe(false);
  });

  it("should deny any permissions when session is null/unauthenticated", () => {
    expect(hasPermission(null, "property:read")).toBe(false);
    expect(hasPermission(null, "ai:chat")).toBe(false);
  });
});
