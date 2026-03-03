import type { TournamentStatus, TournamentSummary } from "./tournament";

// Re-export so anything that imported TournamentStatus from group.ts still works
export type { TournamentStatus, TournamentSummary };

// ─── Group types ───────────────────────────────────────────────────────────

export type GroupPrivacy = "public" | "private" | "restricted";
export type Role = "owner" | "admin" | "member";

export type GroupOverview = {
  id: string;
  _id?: string;
  name: string;
  description: string;
  avatar?: string | null;
  privacy: GroupPrivacy;
  totalMembers: number;
  chatRoomId?: string;
  myRole: Role;
  activeTournaments: number;
  avgPoints?: number;
  topGamers?: {
    username: string;
    points: number;
    rank?: "bronze" | "silver" | "gold" | "elite";
  }[];
  pendingJoinRequestCount?: number;
  activeTournament?: TournamentSummary;
  tournamentsPreview: TournamentSummary[];
  membersPreview: MemberSummary[];
};

export type MemberSummary = {
  id: string;
  _id?: string;
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

// ─── ThemeColors (used by tournament/group UI components) ─────────────────

export interface ThemeColors {
  primary: string;
  accent?: string;
  background?: string;
  surface: string;
  surfaceLight?: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
}
