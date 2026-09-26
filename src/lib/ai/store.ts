import { AIConversation, AIMessage, AIRunRecord, ExtractedRequirement } from "./types";

let conversationsStore: Record<string, AIConversation> = {
  "conv-demo-01": {
    id: "conv-demo-01",
    customerId: "usr-cust-01",
    customerName: "Dr. Anirban Sengupta",
    status: "active",
    requirements: {
      locality: "New Town Action Area II",
      bhk: 3,
      maxPrice: 10000000,
      propertyType: "apartment",
      amenities: ["Swimming Pool", "Clubhouse"],
      confidenceScore: 0.95
    },
    messages: [
      {
        id: "msg-01",
        conversationId: "conv-demo-01",
        senderType: "user",
        content: "Hi, I am looking for a lake facing 3 BHK in New Town under 1 Crore.",
        createdAt: "2026-01-10T10:00:00.000Z"
      },
      {
        id: "msg-02",
        conversationId: "conv-demo-01",
        senderType: "assistant",
        content: "I found a verified 3 BHK Lake-Facing Sky Villa in New Town Action Area II right opposite Eco Park Lake listed at ₹95.00 L. Would you like me to schedule a visit?",
        matchedPropertyIds: ["prop-kol-001"],
        createdAt: "2026-01-10T10:00:05.000Z"
      }
    ],
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:05.000Z"
  }
};

let aiRunsStore: AIRunRecord[] = [
  {
    id: "run-001",
    conversationId: "conv-demo-01",
    model: "gemini-2.0-flash",
    promptVersion: "v1.2-kolkata-agent",
    latencyMs: 340,
    tokensUsed: 420,
    status: "success",
    toolsInvoked: ["searchPropertiesTool", "extractRequirementsTool"],
    createdAt: "2026-01-10T10:00:05.000Z"
  }
];

export const aiStore = {
  getConversation: async (id: string) => {
    return conversationsStore[id] || null;
  },

  listConversations: async (customerId?: string) => {
    const list = Object.values(conversationsStore);
    if (customerId) {
      return list.filter(c => c.customerId === customerId);
    }
    return list;
  },

  createConversation: async (customerId: string, customerName?: string) => {
    const id = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const now = new Date().toISOString();
    const newConv: AIConversation = {
      id,
      customerId,
      customerName: customerName || "Prospective Buyer",
      status: "active",
      messages: [],
      createdAt: now,
      updatedAt: now
    };
    conversationsStore[id] = newConv;
    return newConv;
  },

  addMessage: async (conversationId: string, message: Omit<AIMessage, "id" | "conversationId" | "createdAt">) => {
    let conv = conversationsStore[conversationId];
    if (!conv) {
      conv = await aiStore.createConversation("usr-cust-01");
      conversationId = conv.id;
    }

    const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const now = new Date().toISOString();
    const newMsg: AIMessage = {
      ...message,
      id: msgId,
      conversationId,
      createdAt: now
    };

    conv.messages.push(newMsg);
    conv.updatedAt = now;

    if (message.extractedRequirement) {
      conv.requirements = {
        ...(conv.requirements || { confidenceScore: 0.9 }),
        ...message.extractedRequirement,
      } as ExtractedRequirement;
    }

    return newMsg;
  },

  recordAIRun: async (run: Omit<AIRunRecord, "id" | "createdAt">) => {
    const record: AIRunRecord = {
      ...run,
      id: `run-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    aiRunsStore.unshift(record);
    return record;
  },

  listAIRuns: async (limit: number = 20) => {
    return aiRunsStore.slice(0, limit);
  }
};
