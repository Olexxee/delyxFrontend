export const statisticsFeature = {
  id: "statistics",
  endpoint: { method: "GET", path: "/api/community/:communityId/competitions/:competitionId/statistics", memberOnly: true },
  note: "Read server-calculated competition statistics. Pending submissions must not be counted as official statistics.",
} as const;
