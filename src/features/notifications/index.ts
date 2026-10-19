export const notificationsFeature = {
  id: "notifications",
  backendSupport: "unverified",
  existingClientIntegrations: ["api/NotificationToken.ts", "api/Useregisterpushtoken.ts", "hooks/useNotifications.ts", "hooks/useFCM.ts"],
  note: "Keep the current push-token and notification code intact; confirm backend registration and delivery contracts before changing it.",
} as const;
