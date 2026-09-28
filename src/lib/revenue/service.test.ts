import { describe, it, expect } from "vitest";
import { revenueService } from "./service";

describe("Revenue & Commission Service Unit Tests", () => {
  it("should calculate exact 2% brokerage and 60/40 agent/platform splits correctly", async () => {
    const txn = await revenueService.createTransaction({
      leadId: "lead-kol-101",
      propertyId: "prop-kol-001",
      dealValue: 10000000, // 1 Crore Deal
      brokerageRatePercent: 2.0,
      agentSharePercent: 60.0,
    });

    expect(txn.dealValue).toBe(10000000);
    expect(txn.totalBrokerage).toBe(200000); // 2% of 1 Crore = 2 Lakh
    expect(txn.agentPayout).toBe(120000); // 60% of 2 Lakh = 1.2 Lakh
    expect(txn.platformShare).toBe(80000); // 40% of 2 Lakh = 80,000
    expect(txn.status).toBe("agreement_signed");
    expect(txn.commissionStatus).toBe("pending_invoice");
  });

  it("should calculate custom commission rate and split when provided", async () => {
    const txn = await revenueService.createTransaction({
      leadId: "lead-kol-101",
      propertyId: "prop-kol-001",
      dealValue: 5000000, // 50 Lakh Deal
      brokerageRatePercent: 1.5,
      agentSharePercent: 70.0,
    });

    expect(txn.totalBrokerage).toBe(75000); // 1.5% of 50 Lakh = 75,000
    expect(txn.agentPayout).toBe(52500); // 70% of 75,000
    expect(txn.platformShare).toBe(22500); // 30% of 75,000
  });

  it("should allow status transition and update commission status upon registry completion", async () => {
    const txn = await revenueService.createTransaction({
      leadId: "lead-kol-101",
      propertyId: "prop-kol-001",
      dealValue: 8000000,
    });

    const updated = await revenueService.updateTransactionStatus(
      txn.id,
      { status: "registration_completed", commissionStatus: "approved" },
      "usr-admin-01"
    );
    expect(updated?.status).toBe("registration_completed");
    expect(updated?.commissionStatus).toBe("approved");
  });

  it("should compute platform revenue summary with total volume and gross commissions", async () => {
    const summary = await revenueService.getRevenueSummary();

    expect(summary.closedDealsCount).toBeGreaterThan(0);
    expect(summary.totalPlatformGMV).toBeGreaterThan(0);
    expect(summary.totalBrokerageRevenue).toBeGreaterThan(0);
  });
});
