// ─── Status ────────────────────────────────────────────────────────────────
export type TournamentStatus = "registration" | "ongoing" | "completed";

// ─── Raw API shape (full tournament response) ─────────────────────────────
export interface ApiTournament {
  _id: string;
  name: string;
  groupId: string;
  createdBy: string;
  type: "league" | "knockout" | "group_stage";
  description?: string;
  maxParticipants: number;
  settings: {
    pointsForWin: number;
    pointsForDraw: number;
    pointsForLoss: number;
    rounds: "single" | "double";
  };
  registrationDeadline: string;
  isRegistrationOpen: boolean;
  startDate: string;
  endDate: string;
  totalMatches: number;
  completedMatches: number;
  currentMatchday: number;
  totalMatchdays: number;
  status: TournamentStatus;
  totalParticipantsCount: number;
  tournamentCode: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Lightweight summary — embedded in GroupOverview.tournamentsPreview ────
// This is the lean shape that comes back with the group fetch,
// NOT the full tournament object.
export interface TournamentSummary {
  id: string;
  name: string;
  status: TournamentStatus;
  maxParticipants: number;
  participantCount: number;
  startDate: string;
}

// ─── Full UI-normalised shape — used on the tournament screen ──────────────
export interface Tournament {
  id: string;
  name: string;
  groupId: string;
  type: string;
  description?: string;
  status: TournamentStatus;
  maxParticipants: number;
  participantCount: number;
  isRegistrationOpen: boolean;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  totalMatches: number;
  completedMatches: number;
  currentMatchday: number;
  totalMatchdays: number;
  tournamentCode: string;
  settings: ApiTournament["settings"];
}

// ─── Adapters ──────────────────────────────────────────────────────────────

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

/** Full API response → Tournament */
export function toTournament(a: ApiTournament): Tournament {
  return {
    id: a._id,
    name: a.name,
    groupId: a.groupId,
    type: a.type,
    description: a.description,
    status: a.status,
    maxParticipants: a.maxParticipants,
    participantCount: a.totalParticipantsCount,
    isRegistrationOpen: a.isRegistrationOpen,
    startDate: fmt(a.startDate),
    endDate: fmt(a.endDate),
    registrationDeadline: fmt(a.registrationDeadline),
    totalMatches: a.totalMatches,
    completedMatches: a.completedMatches,
    currentMatchday: a.currentMatchday,
    totalMatchdays: a.totalMatchdays,
    tournamentCode: a.tournamentCode,
    settings: a.settings,
  };
}

/**
 * TournamentSummary (from group preview) → Tournament
 * Missing fields are filled with safe defaults — good enough for
 * the banner and preview rows. Full data loads on the detail screen.
 */
export function summaryToTournament(s: TournamentSummary, groupId: string): Tournament {
  return {
    id: s.id,
    name: s.name,
    groupId,
    type: "league",
    status: s.status,
    maxParticipants: s.maxParticipants,
    participantCount: s.participantCount,
    isRegistrationOpen: s.status === "registration",
    startDate: s.startDate,
    endDate: "",
    registrationDeadline: "",
    totalMatches: 0,
    completedMatches: 0,
    currentMatchday: 0,
    totalMatchdays: 0,
    tournamentCode: "",
    settings: { pointsForWin: 3, pointsForDraw: 1, pointsForLoss: 0, rounds: "double" },
  };
}

// ─── Status meta ───────────────────────────────────────────────────────────
export const STATUS_META: Record<TournamentStatus, { label: string; color: string; bg: string }> = {
  registration: { label: "OPEN",  color: "#2563EB", bg: "#2563EB18" },
  ongoing:      { label: "LIVE",  color: "#16a34a", bg: "#16a34a18" },
  completed:    { label: "ENDED", color: "#6b7280", bg: "#6b728018" },
};