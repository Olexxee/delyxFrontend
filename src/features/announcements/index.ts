export const announcementsFeature = {
  id: "announcements",
  backendSupport: "model-only",
  backendModel: "Announcement",
  note: "Community announcements and pinned state are represented in Prisma, but backend master has no announcement routes. UI/API wiring must wait for a confirmed contract.",
} as const;
