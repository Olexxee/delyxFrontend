export const standingsFeature = {
  id: "standings",
  endpoint: { method: "GET", path: "/api/community/:communityId/competitions/:competitionId/standings", memberOnly: true },
  note: "Read server-calculated standings; do not calculate or optimistically alter official points in the client.",
} as const;
