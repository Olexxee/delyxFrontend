export type TournamentStatus =
  | "registration"
  | "upcoming"
  | "ongoing"
  | "completed";

export type TournamentType =
  | "league"
  | "knockout"
  | "group_stage"
  | "hybrid";

export type TournamentTabKey =
  | "overview"
  | "participants"
  | "fixtures"
  | "standings"
  | "results";

export type TournamentRoundMode = "single" | "double";

export type FixtureStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "postponed";

export type TournamentParticipantStatus =
  | "active"
  | "pending"
  | "eliminated"
  | "withdrawn";

export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
}

export interface TournamentParticipant {
  id: string;
  username: string;
  profilePicture: string | null;
  status: TournamentParticipantStatus;
  isAdmin?: boolean;
}

export interface TournamentSettings {
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
  rounds: TournamentRoundMode;
}

export interface TournamentViewerContext {
  isRegistered: boolean;
  role: string | null;
  participantId: string | null;
  canJoin: boolean;
  canLeave: boolean;
}

export interface TournamentProgress {
  totalMatches: number;
  completedMatches: number;
  currentMatchday: number;
  totalMatchdays: number;
}

export interface TournamentFixture {
  id: string;
  matchday: number;
  status: FixtureStatus;
  scheduledDate?: string;
  homeParticipant: TournamentParticipant;
  awayParticipant: TournamentParticipant;
  homeScore?: number | null;
  awayScore?: number | null;
}

export interface TournamentStandingRow {
  participantId: string;
  participantName: string;
  profilePicture?: string | null;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
}

export interface TournamentOutcome {
  winner: {
    participantId: string;
    username: string;
    profilePicture?: string | null;
  } | null;
}

export interface TournamentSummary {
  id: string;
  name: string;
  type: TournamentType;
  status: TournamentStatus;
  maxParticipants: number;
  participantCount: number;
  startDate: string;
  currentMatchday?: number;
  totalMatchdays?: number;
  viewerIsRegistered?: boolean;
}

export interface TournamentDetail {
  id: string;
  name: string;
  groupId: string;
  createdBy: string;
  type: TournamentType;
  description?: string;

  status: TournamentStatus;
  isRegistrationOpen: boolean;

  maxParticipants: number;
  participantCount: number;
  participants: TournamentParticipant[];

  registrationDeadline: string;
  startDate: string;
  endDate: string;

  tournamentCode: string;

  settings: TournamentSettings;
  progress: TournamentProgress;
  viewerContext: TournamentViewerContext;

  fixtures?: TournamentFixture[];
  standings?: TournamentStandingRow[];
  outcome?: TournamentOutcome;

  createdAt: string;
  updatedAt: string;
}

export interface TournamentListResponse {
  success: boolean;
  tournaments: TournamentSummary[];
  pagination: PaginationMeta;
}

export interface TournamentDetailResponse {
  success: boolean;
  tournament: TournamentDetail;
}

export interface ApiTournamentParticipant {
  id?: string;
  _id?: string;
  userId?: string;
  username: string;
  profilePicture?: string | null;
  status?: string;
  isAdmin?: boolean;
}

export interface ApiTournamentFixture {
  id?: string;
  _id?: string;
  matchday: number;
  status: string;
  scheduledDate?: string;
  homeParticipant: ApiTournamentParticipant;
  awayParticipant: ApiTournamentParticipant;
  homeScore?: number | null;
  awayScore?: number | null;
}

export interface ApiTournamentStandingRow {
  participantId: string;
  participantName: string;
  profilePicture?: string | null;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
}

export interface ApiTournamentOutcome {
  winner?: {
    participantId: string;
    username: string;
    profilePicture?: string | null;
  } | null;
}

export interface ApiTournament {
  id?: string;
  _id?: string;
  name: string;
  groupId: string;
  createdBy: string;
  type: string;
  description?: string;

  status: string;
  isRegistrationOpen?: boolean;

  maxParticipants: number;
  participantCount?: number;
  totalParticipantsCount?: number;
  participants?: ApiTournamentParticipant[];

  registrationDeadline?: string;
  startDate: string;
  endDate: string;

  tournamentCode?: string;

  settings?: {
    pointsForWin?: number;
    pointsForDraw?: number;
    pointsForLoss?: number;
    rounds?: "single" | "double";
  };

  progress?: {
    totalMatches?: number;
    completedMatches?: number;
    currentMatchday?: number;
    totalMatchdays?: number;
  };

  totalMatches?: number;
  completedMatches?: number;
  currentMatchday?: number;
  totalMatchdays?: number;

  viewerContext?: {
    isRegistered?: boolean;
    role?: string | null;
    participantId?: string | null;
    canJoin?: boolean;
    canLeave?: boolean;
  };

  userContext?: {
    isRegistered?: boolean;
    role?: string | null;
    participantId?: string | null;
    canJoin?: boolean;
    canLeave?: boolean;
  };

  fixtures?: ApiTournamentFixture[];
  standings?: ApiTournamentStandingRow[];
  outcome?: ApiTournamentOutcome;

  createdAt?: string;
  updatedAt?: string;
}

export interface ApiTournamentListResponse {
  success: boolean;
  tournaments: ApiTournament[];
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
  };
}

export interface ApiTournamentDetailResponse {
  success: boolean;
  tournament: ApiTournament;
}

export const STATUS_META: Record<
  TournamentStatus,
  { label: string; tone: "primary" | "warning" | "accent" | "status" }
> = {
  registration: { label: "Registration Open", tone: "primary" },
  upcoming: { label: "Upcoming", tone: "warning" },
  ongoing: { label: "Ongoing", tone: "accent" },
  completed: { label: "Completed", tone: "status" },
};