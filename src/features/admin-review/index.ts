export const adminReviewFeature = {
  id: "admin-review",
  endpoint: { method: "POST", path: "/api/community/:communityId/competitions/:competitionId/results/verify", adminOnly: true },
  supportedActions: ["verify"],
  missingContract: ["reject with reviewer reason", "explicit dispute adjudication", "evidence retrieval"],
  note: "Role-aware review screens must not offer backend actions that do not exist.",
} as const;
