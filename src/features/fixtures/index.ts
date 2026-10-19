export const fixturesFeature = {
  id: "fixtures",
  basePath: "/api/community/:communityId/competitions/:competitionId",
  endpoints: {
    generate: { method: "POST", path: "/generate-fixtures", adminOnly: true },
    list: { method: "GET", path: "/fixtures", memberOnly: true },
    matches: { method: "GET", path: "/matches", memberOnly: true },
  },
} as const;
