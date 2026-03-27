import type { TournamentDetail } from "@/types/tournament";

export interface ApiTournamentParticipant {
  id?: string;
  _id?: string;
  userId?: string;
  username: string;
  profilePicture?: string | null;
  status?: string;
  isAdmin?: boolean;
}

export interface TournamentMutationResponse {
  success: boolean;
  message: string;
  tournament: TournamentDetail;
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