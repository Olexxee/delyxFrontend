import type {
  TournamentDetail,
  TournamentFixture,
  TournamentOutcome,
  TournamentParticipant,
  TournamentParticipantStatus,
  TournamentStandingRow,
  TournamentStatus,
  TournamentSummary,
  TournamentType,
} from "@/types/tournament";
import type {
  ApiTournament,
  ApiTournamentFixture,
  ApiTournamentOutcome,
  ApiTournamentParticipant,
  ApiTournamentStandingRow,
} from "@/types/tournamentApi";

const normalizeId = (value?: string) => value ?? "";

const normalizeStatus = (status: string): TournamentStatus => {
  if (
    status === "registration" ||
    status === "upcoming" ||
    status === "ongoing" ||
    status === "completed"
  ) {
    return status;
  }

  return "registration";
};

const normalizeType = (type: string): TournamentType => {
  if (
    type === "league" ||
    type === "knockout" ||
    type === "group_stage" ||
    type === "hybrid"
  ) {
    return type;
  }

  return "league";
};

const normalizeParticipantStatus = (
  status?: string,
): TournamentParticipantStatus => {
  if (
    status === "active" ||
    status === "pending" ||
    status === "eliminated" ||
    status === "withdrawn"
  ) {
    return status;
  }

  return "active";
};

const toParticipant = (
  participant: ApiTournamentParticipant,
): TournamentParticipant => ({
  id: normalizeId(participant.id ?? participant._id ?? participant.userId),
  username: participant.username,
  profilePicture: participant.profilePicture ?? null,
  status: normalizeParticipantStatus(participant.status),
  isAdmin: participant.isAdmin,
});

const toFixture = (fixture: ApiTournamentFixture): TournamentFixture => ({
  id: normalizeId(fixture.id ?? fixture._id),
  matchday: fixture.matchday,
  status:
    fixture.status === "scheduled" ||
    fixture.status === "in_progress" ||
    fixture.status === "completed" ||
    fixture.status === "postponed"
      ? fixture.status
      : "scheduled",
  scheduledDate: fixture.scheduledDate,
  homeParticipant: toParticipant(fixture.homeParticipant),
  awayParticipant: toParticipant(fixture.awayParticipant),
  homeScore: fixture.homeScore ?? null,
  awayScore: fixture.awayScore ?? null,
});

const toStandingRow = (
  row: ApiTournamentStandingRow,
): TournamentStandingRow => ({
  participantId: row.participantId,
  participantName: row.participantName,
  profilePicture: row.profilePicture ?? null,
  position: row.position,
  played: row.played,
  wins: row.wins,
  draws: row.draws,
  losses: row.losses,
  points: row.points,
});

const toOutcome = (
  outcome?: ApiTournamentOutcome,
): TournamentOutcome | undefined =>
  outcome
    ? {
        winner: outcome.winner
          ? {
              participantId: outcome.winner.participantId,
              username: outcome.winner.username,
              profilePicture: outcome.winner.profilePicture ?? null,
            }
          : null,
      }
    : undefined;

export const toTournamentSummary = (
  tournament: ApiTournament,
): TournamentSummary => ({
  id: normalizeId(tournament.id ?? tournament._id),
  name: tournament.name,
  type: normalizeType(tournament.type),
  status: normalizeStatus(tournament.status),
  maxParticipants: tournament.maxParticipants,
  participantCount:
    tournament.participantCount ?? tournament.totalParticipantsCount ?? 0,
  startDate: tournament.startDate,
  currentMatchday:
    tournament.progress?.currentMatchday ?? tournament.currentMatchday,
  totalMatchdays:
    tournament.progress?.totalMatchdays ?? tournament.totalMatchdays,
  viewerIsRegistered:
    tournament.viewerContext?.isRegistered ??
    tournament.userContext?.isRegistered ??
    false,
});

export const toTournamentDetail = (
  tournament: ApiTournament,
): TournamentDetail => ({
  id: normalizeId(tournament.id ?? tournament._id),
  name: tournament.name,
  groupId: tournament.groupId,
  createdBy: tournament.createdBy,
  type: normalizeType(tournament.type),
  description: tournament.description,

  status: normalizeStatus(tournament.status),
  isRegistrationOpen: tournament.isRegistrationOpen ?? false,

  maxParticipants: tournament.maxParticipants,
  participantCount:
    tournament.participantCount ?? tournament.totalParticipantsCount ?? 0,
  participants: (tournament.participants ?? []).map(toParticipant),

  registrationDeadline: tournament.registrationDeadline ?? "",
  startDate: tournament.startDate,
  endDate: tournament.endDate,

  tournamentCode: tournament.tournamentCode ?? "",

  settings: {
    pointsForWin: tournament.settings?.pointsForWin ?? 3,
    pointsForDraw: tournament.settings?.pointsForDraw ?? 1,
    pointsForLoss: tournament.settings?.pointsForLoss ?? 0,
    rounds: tournament.settings?.rounds ?? "single",
  },

  progress: {
    totalMatches: tournament.progress?.totalMatches ?? tournament.totalMatches ?? 0,
    completedMatches:
      tournament.progress?.completedMatches ?? tournament.completedMatches ?? 0,
    currentMatchday:
      tournament.progress?.currentMatchday ?? tournament.currentMatchday ?? 0,
    totalMatchdays:
      tournament.progress?.totalMatchdays ?? tournament.totalMatchdays ?? 0,
  },

  viewerContext: {
    isRegistered:
      tournament.viewerContext?.isRegistered ??
      tournament.userContext?.isRegistered ??
      false,
    role:
      tournament.viewerContext?.role ??
      tournament.userContext?.role ??
      null,
    participantId:
      tournament.viewerContext?.participantId ??
      tournament.userContext?.participantId ??
      null,
    canJoin:
      tournament.viewerContext?.canJoin ??
      !(
        tournament.viewerContext?.isRegistered ??
        tournament.userContext?.isRegistered ??
        false
      ),
    canLeave:
      tournament.viewerContext?.canLeave ??
      (tournament.viewerContext?.isRegistered ??
        tournament.userContext?.isRegistered ??
        false),
  },

  fixtures: tournament.fixtures?.map(toFixture),
  standings: tournament.standings?.map(toStandingRow),
  outcome: toOutcome(tournament.outcome),

  createdAt: tournament.createdAt ?? "",
  updatedAt: tournament.updatedAt ?? "",
});