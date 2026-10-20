export const communitiesFeature = {
  id: "communities",
  basePath: "/api/community",
  endpoints: {
    list: { method: "GET", path: "/" },
    detail: { method: "GET", path: "/:id" },
    create: { method: "POST", path: "/", auth: true },
    join: { method: "POST", path: "/:id/join", auth: true },
    leave: { method: "POST", path: "/:id/leave", auth: true },
    members: { method: "GET", path: "/:id/members" },
    updateMemberRole: { method: "PUT", path: "/:id/members/role", auth: true },
    delete: { method: "DELETE", path: "/:id", auth: true },
    membership: { method: "GET", path: "/:id/membership", auth: true },
  },
} as const;
