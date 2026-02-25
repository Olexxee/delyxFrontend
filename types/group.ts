export type GroupPrivacy = "public" | "private" | "restricted";

export type Role = "owner" | "admin" | "member";

export type TournamentStatus =
  | "upcoming"
  | "active"
  | "completed"
  | "cancelled"
  | "open"
  | "draft";

export type GroupOverview = {
  id: string;
  name: string;
  description: string;
  avatar?: string | null;
  privacy: GroupPrivacy;
  memberCount: number;
  chatRoomId?: string;
  myRole: Role;

  // Admin-only (backend decides visibility)
  pendingJoinRequestCount?: number;

  // Lightweight previews
  activeTournament?: TournamentSummary;
  tournamentsPreview: TournamentSummary[];
  membersPreview: MemberSummary[];
};

export type MemberSummary = {
  id: string;
  displayName: string;
  avatarUri?: string;
  role: Role;
  isOnline?: boolean;
};

export interface PaginatedMembersResponse {
  page: number;
  totalPages: number;
  total: number;
  members: MemberSummary[];
}

export type TournamentSummary = {
  id: string;
  name: string;
  status: TournamentStatus;
  participantCount: number;
  maxParticipants: number;
  startDate: string;
};

export type TournamentDetails = TournamentSummary & {
  description?: string;
  endDate?: string;

  winner?: ParticipantSummary;
  topParticipants?: ParticipantSummary[];
};

export type ParticipantSummary = {
  userId: string;
  displayName: string;
  avatarUri?: string;
  rank: number;
  score: number;
};

export interface PaginatedTournamentsResponse {
  page: number;
  totalPages: number;
  total: number;
  tournaments: TournamentSummary[];
}

export interface DiscoverGroupsResponse {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  groups: GroupOverview[];
}

export type GroupInfo = GroupOverview & {
  membersPreview: MemberSummary[];
  tournamentsPreview: TournamentSummary[];
};

export const STATUS_META: Record<
  TournamentStatus,
  { label: string; color: string; bg: string }
> = {
  upcoming: {
    label: "UPCOMING",
    color: "#40c4ff",
    bg: "rgba(64,196,255,0.12)",
  },
  active: { label: "LIVE", color: "#00e676", bg: "rgba(0,230,118,0.12)" },
  open: { label: "OPEN", color: "#40c4ff", bg: "rgba(64,196,255,0.12)" },
  draft: { label: "DRAFT", color: "#ffd740", bg: "rgba(255,215,64,0.12)" },
  completed: { label: "ENDED", color: "#78909c", bg: "rgba(120,144,156,0.1)" },
  cancelled: {
    label: "CANCELLED",
    color: "#ef5350",
    bg: "rgba(239,83,80,0.12)",
  },
};
