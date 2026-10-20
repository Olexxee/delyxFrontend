export const ratingsFeature = {
  id: "ratings",
  endpoint: { method: "GET", path: "/api/community/:communityId/competitions/:competitionId/ratings", memberOnly: true },
  note: "Read server-calculated ratings. Refresh only after backend-confirmed result verification.",
} as const;
