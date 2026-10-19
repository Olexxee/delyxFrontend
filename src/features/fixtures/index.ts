export const fixturesFeature = {
  id: "fixtures",
  basePath: "/api/community/:communityId/competitions/:competitionId",
  endpoints: {
    generate: { method: "POST", path: "/generate-fixtures", adminOnly: true },
    list: { method: "GET", path: "/:competitionId/fixtures", memberOnly: true },
    matches: { method: "GET", path: "/:competitionId/matches", memberOnly: true },
  },
} as const;
