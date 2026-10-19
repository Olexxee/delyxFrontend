export const registrationsFeature = {
  id: "registrations",
  basePath: "/api/community/:communityId/competitions/:competitionId/participants",
  endpoints: {
    register: { method: "POST", path: "/" },
    remove: { method: "DELETE", path: "/:playerId" },
  },
  note: "The backend models OPEN, APPROVAL, and INVITE_ONLY modes. Confirm participant approval/invite semantics before exposing controls that imply those flows are implemented.",
} as const;
