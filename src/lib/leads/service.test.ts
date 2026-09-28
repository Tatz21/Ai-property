import { describe, it, expect } from "vitest";
import { leadService } from "./service";

describe("Lead Lifecycle & Routing Service Unit Tests", () => {
  it("should create a qualified lead from an AI conversation with intelligent intent scoring and auto-assignment", async () => {
    const lead = await leadService.create({
      customerId: "usr-cust-test-01",
      customerName: "Siddharth Roy",
      customerEmail: "siddharth.roy@test.com",
      customerPhone: "+91 98301 55443",
      requirementsSummary: "Looking for a 3 BHK in Salt Lake Sector V with immediate possession and budget up to 1.2 Cr.",
      preferredLocality: "Salt Lake Sector V",
      budgetCap: 12000000,
      bhkPreference: 3,
      shortlistedPropertyIds: ["prop-kol-003"],
      conversationId: "conv-test-99",
    });

    expect(lead.id).toBeDefined();
    expect(lead.intent).toBe("high"); // High budget + specific locality + phone -> High intent
    expect(lead.score).toBeGreaterThanOrEqual(75);
    expect(lead.status).toBe("new");
    expect(lead.assignedAgentId).toBeDefined();
  });

  it("should transition lead status through the CRM pipeline", async () => {
    const lead = await leadService.create({
      customerId: "usr-cust-test-02",
      customerName: "Debashis Guha",
      customerEmail: "d.guha@test.com",
      requirementsSummary: "2 BHK in Rajarhat under 50 Lakh",
      preferredLocality: "Rajarhat",
      budgetCap: 5000000,
      bhkPreference: 2,
    });

    const contacted = await leadService.update(lead.id, { status: "contacted" }, "usr-agent-01");
    expect(contacted?.status).toBe("contacted");

    const negotiation = await leadService.update(lead.id, { status: "negotiation" }, "usr-agent-01");
    expect(negotiation?.status).toBe("negotiation");
  });

  it("should support adding structured CRM notes and scheduling follow-up tasks", async () => {
    const lead = await leadService.create({
      customerId: "usr-cust-test-03",
      customerName: "Rituparna Sen",
      customerEmail: "rituparna@test.com",
      requirementsSummary: "4 BHK Penthouse in Ballygunge",
      preferredLocality: "Ballygunge",
      budgetCap: 25000000,
      bhkPreference: 4,
    });

    const note = await leadService.addNote(
      lead.id,
      {
        content: "Pre-approved loan with SBI for 1.8 Cr. Requesting site visit this Saturday.",
        authorId: "usr-agent-01",
        authorName: "Sanjay Bhattacharya",
      }
    );
    expect(note).toBeDefined();
    expect(note?.content).toContain("Pre-approved loan");

    const task = await leadService.addTask(
      lead.id,
      {
        title: "Conduct VIP tour of Ballygunge Penthouse",
        dueDate: "2026-10-05T15:00:00.000Z",
        type: "visit",
      }
    );
    expect(task).toBeDefined();
    expect(task?.completed).toBe(false);

    if (task) {
      const toggled = await leadService.toggleTask(lead.id, task.id);
      expect(toggled?.completed).toBe(true);
    }
  });
});
