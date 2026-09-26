import { NotificationRecord, NotificationChannel } from "@/lib/visits/types";

let notificationsStore: NotificationRecord[] = [
  {
    id: "notif-01",
    userId: "usr-cust-01",
    channel: "whatsapp",
    type: "visit_confirmation",
    title: "Site Visit Confirmed - Eco Park Sky Villa",
    body: "Hi Dr. Sengupta, your inspection for 3 BHK Lake-Facing Sky Villa is confirmed for 2nd Oct at 11:00 AM. Specialist Sanjay Bhattacharya (+91 98301 22334) will meet you at the site.",
    status: "delivered",
    metadata: { propertyId: "prop-kol-001", slotTime: "11:00 AM" },
    sentAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: "notif-02",
    userId: "usr-agent-01",
    channel: "sms",
    type: "lead_assigned",
    title: "New High-Intent Visit Scheduled",
    body: "New visit booking assigned for Eco Park Villa on 2nd Oct 11:00 AM with Dr. Anirban Sengupta (+91 98300 12345).",
    status: "delivered",
    metadata: { leadId: "lead-kol-101" },
    sentAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

export const notificationService = {
  dispatch: async (params: {
    userId: string;
    channel: NotificationChannel;
    type: NotificationRecord["type"];
    title: string;
    body: string;
    metadata?: Record<string, any>;
  }): Promise<NotificationRecord> => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const now = new Date().toISOString();

    const record: NotificationRecord = {
      id,
      userId: params.userId,
      channel: params.channel,
      type: params.type,
      title: params.title,
      body: params.body,
      status: "delivered", // Simulated successful provider delivery (Twilio / WhatsApp API / SES)
      metadata: params.metadata,
      sentAt: now,
      createdAt: now
    };

    notificationsStore.unshift(record);
    return record;
  },

  listByUser: async (userId: string) => {
    return notificationsStore.filter(n => n.userId === userId);
  },

  listAll: async () => {
    return notificationsStore;
  }
};
