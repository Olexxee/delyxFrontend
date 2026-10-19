export const authFeature = {
  id: "auth",
  basePath: "/api/auth",
  endpoints: {
    currentUser: { method: "GET", path: "/me", auth: true },
    register: { method: "POST", path: "/register", auth: false },
    login: { method: "POST", path: "/login", auth: false },
  },
} as const;
