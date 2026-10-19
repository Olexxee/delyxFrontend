export const messagingFeature = {
  id: "messaging",
  backendSupport: "unverified",
  backendModel: "Message",
  existingClientIntegrations: ["api/conversationService.ts", "api/socketRegistry.tsx", "hooks/useConversations.ts", "hooks/useRealtimeConversation.ts"],
  note: "Backend master app.ts does not mount a chat router. Preserve current client integrations while validating the backend branch/deployment and API contract; do not introduce guessed endpoints.",
} as const;
