export type BackendSupport = "exposed" | "partial" | "model-only" | "unverified";

export type FeatureDefinition = {
  id: string;
  label: string;
  backendModule: string;
  support: BackendSupport;
  dependencies: readonly string[];
  summary: string;
};

export const featureRegistry = [
  { id: "auth", label: "Authentication", backendModule: "modules/auth", support: "exposed", dependencies: [], summary: "Registration, login, and current-session identity." },
  { id: "profiles", label: "Player profiles", backendModule: "modules/users + User model", support: "partial", dependencies: ["auth"], summary: "Player identity, avatar, bio, and career summary; profile HTTP routes are not mounted on backend master." },
  { id: "communities", label: "Communities", backendModule: "modules/communities", support: "exposed", dependencies: ["auth", "profiles"], summary: "Discovery, detail, create, join/leave, members, membership, roles, and deletion." },
  { id: "announcements", label: "Announcements", backendModule: "Announcement model", support: "model-only", dependencies: ["communities", "profiles"], summary: "Community announcements and pinned posts; no mounted HTTP routes yet." },
  { id: "competitions", label: "Competitions", backendModule: "modules/competition", support: "exposed", dependencies: ["communities", "profiles"], summary: "Competition CRUD, type/rules, visibility, status, and lifecycle." },
  { id: "registrations", label: "Registrations", backendModule: "CompetitionParticipant + registration lifecycle", support: "partial", dependencies: ["competitions", "communities"], summary: "Participant enrollment and organizer controls; confirm approval/invite workflows against backend behavior." },
  { id: "fixtures", label: "Fixtures", backendModule: "CompetitionFixture + fixture endpoints", support: "exposed", dependencies: ["competitions", "registrations"], summary: "Schedule generation and fixture browsing." },
  { id: "matches", label: "Match reporting", backendModule: "CompetitionMatch + result endpoints", support: "exposed", dependencies: ["fixtures", "profiles"], summary: "Score submission and administrator verification; unverified results never update derived competition data." },
  { id: "match-evidence", label: "Match evidence", backendModule: "MatchEvidence model", support: "model-only", dependencies: ["matches"], summary: "Evidence records exist, but upload/read endpoints are not mounted on backend master." },
  { id: "standings", label: "Standings", backendModule: "CompetitionStanding + standings calculator", support: "exposed", dependencies: ["matches"], summary: "Server-calculated league table." },
  { id: "ratings", label: "Player ratings", backendModule: "CompetitionRating + rating calculator", support: "exposed", dependencies: ["matches"], summary: "Competition-scoped player ratings." },
  { id: "statistics", label: "Statistics", backendModule: "CompetitionStatistic + statistics calculator", support: "exposed", dependencies: ["matches"], summary: "Competition-scoped performance statistics." },
  { id: "admin-review", label: "Administrator review", backendModule: "community role middleware + verifyResult", support: "partial", dependencies: ["matches", "communities"], summary: "Authorized verification exists; explicit rejection/dispute adjudication routes need contract confirmation." },
  { id: "messaging", label: "Messaging", backendModule: "Message model; frontend conversation/socket modules", support: "unverified", dependencies: ["auth", "profiles", "communities"], summary: "Preserve existing client integrations but do not assume backend chat routes exist on master." },
  { id: "notifications", label: "Notifications", backendModule: "Frontend push-token integration", support: "unverified", dependencies: ["auth"], summary: "Map push-token and event contracts before page wiring." },
] as const satisfies readonly FeatureDefinition[];

export type FeatureId = (typeof featureRegistry)[number]["id"];

export const getFeatureDefinition = (id: FeatureId) =>
  featureRegistry.find((feature) => feature.id === id)!;
