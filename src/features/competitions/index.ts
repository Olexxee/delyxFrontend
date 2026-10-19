export const competitionsFeature = {
  id: "competitions",
  basePath: "/api/community/:communityId/competitions",
  types: ["LEAGUE", "KNOCKOUT"],
  backendSchemaTypes: ["LEAGUE", "KNOCKOUT", "SWISS"],
  launchScopeNote: "SWISS exists in the backend schema but is excluded from the first frontend release.",
  statuses: ["DRAFT", "REGISTRATION_OPEN", "REGISTRATION_CLOSED", "READY", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ARCHIVED"],
  lifecycle: ["create", "open-registration", "close-registration", "generate-fixtures", "start", "complete", "cancel", "archive"],
  endpoints: {
    create: { method: "POST", path: "/" },
    detail: { method: "GET", path: "/:competitionId" },
    update: { method: "PATCH", path: "/:competitionId" },
    delete: { method: "DELETE", path: "/:competitionId" },
  },
} as const;
