export const profilesFeature = {
  id: "profiles",
  backendSupport: "partial",
  backendModule: "src/modules/users",
  note: "Repository/serializer and User model exist, but backend master does not mount a profile/user router. Do not issue assumed profile requests.",
  userFieldsInSchema: ["id", "username", "email", "avatar", "bio", "verified", "wins", "losses", "draws", "gamesPlayed"],
} as const;
