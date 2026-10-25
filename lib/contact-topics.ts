/** Contact form topics. A dropdown steers visitors away from describing symptoms. Shared with worker/contact.ts. */
export const CONTACT_TOPICS = ["New patient question", "Appointment request", "Insurance or billing", "Other"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];
