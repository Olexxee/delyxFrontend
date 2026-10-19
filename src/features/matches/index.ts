export const matchesFeature = {
  id: "matches",
  basePath: "/api/community/:communityId/competitions/:competitionId",
  statuses: ["SCHEDULED", "SUBMITTED", "DISPUTED", "VERIFIED", "COMPLETED"],
  endpoints: {
    submitResult: { method: "POST", path: "/:competitionId/results", memberOnly: true },
    verifyResult: { method: "POST", path: "/:competitionId/results/verify", adminOnly: true },
  },
  invariants: [
    "A submitted score is pending until an authorized community administrator explicitly verifies it.",
    "Only verified results may affect standings, ratings, statistics, or tournament progression.",
    "Never show a pending score as an official result.",
  ],
} as const;
