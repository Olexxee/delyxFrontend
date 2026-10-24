import api from "@/api/api";
import type {
  ApiTournament,
  ApiTournamentDetailResponse,
  ApiTournamentListResponse,
  ApiPlayerTournamentStatistics,
  TournamentMutationResponse,
} from "@/types/tournamentApi";

type ApiEnvelope<T> = { success: boolean; data: T; message?: string };

const statusMap: Record<string, string> = {
  DRAFT: "upcoming",
  REGISTRATION_OPEN: "registration",
  REGISTRATION_CLOSED: "upcoming",
  READY: "upcoming",
  IN_PROGRESS: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "completed",
  ARCHIVED: "completed",
};

const toApiTournament = (item: any): ApiTournament => {
  // The competition service returns an aggregate persistence record, while
  // community list endpoints return flat Prisma rows. Normalize both shapes.
  const competition = item.competition ?? item;
  const participants = item.participants ?? competition.participants ?? [];
  const fixtures = item.fixtures ?? competition.fixtures ?? [];
  const matches = item.matches ?? competition.matches ?? [];
  const rules = competition.rules ?? {};
  const status = competition.status;

  return {
    id: competition.id,
    name: competition.name,
    groupId: competition.communityId ?? competition.groupId,
    createdBy: competition.createdBy,
    type: String(competition.type ?? "LEAGUE").toLowerCase(),
    description: competition.description ?? undefined,
    status: statusMap[status] ?? String(status ?? "upcoming").toLowerCase(),
    lifecycleStatus: status,
    isRegistrationOpen: status === "REGISTRATION_OPEN" && (competition.registration?.isOpen ?? competition.registrationOpen ?? true),
    maxParticipants: competition.maxParticipants ?? 0,
    participantCount: item._count?.participants ?? participants.length,
    registrationMode: competition.registration?.mode ?? competition.registrationMode ?? "OPEN",
    registrationOpensAt: competition.registration?.opensAt ?? competition.registrationOpensAt ?? undefined,
    registrationDeadline: competition.registration?.closesAt ?? competition.registrationClosesAt ?? undefined,
    startDate: competition.startsAt ?? competition.createdAt,
    endDate: competition.endsAt ?? competition.updatedAt,
    settings: {
      pointsForWin: rules.pointsForWin ?? competition.pointsForWin ?? 3,
      pointsForDraw: rules.pointsForDraw ?? competition.pointsForDraw ?? 1,
      pointsForLoss: rules.pointsForLoss ?? competition.pointsForLoss ?? 0,
      rounds: rules.doubleRoundRobin ? "double" : "single",
    },
    progress: {
      currentMatchday: competition.runtime?.currentRound ?? competition.runtimeCurrentRound ?? 0,
      totalMatchdays: fixtures.reduce((maximum: number, fixture: any) => Math.max(maximum, fixture.round ?? fixture.matchday ?? 0), 0),
      totalMatches: fixtures.length || matches.length || item._count?.matches || 0,
      completedMatches: matches.filter((match: any) => match.verified || match.status === "VERIFIED" || match.status === "COMPLETED").length,
    },
    viewerContext: item.viewerContext ?? item.userContext,
    participants: participants.map((participant: any) => ({
      id: participant.id,
      userId: participant.playerId ?? participant.userId,
      username: participant.user?.username ?? participant.username ?? "Player",
      profilePicture: participant.user?.avatar ?? participant.profilePicture ?? null,
      status: "active",
    })),
    fixtures: fixtures.map((fixture: any) => {
      const match = matches.find((candidate: any) => candidate.fixtureId === fixture.id);
      const home = participants.find((participant: any) => participant.id === fixture.homeParticipantId);
      const away = participants.find((participant: any) => participant.id === fixture.awayParticipantId);
      return {
        id: fixture.id,
        matchday: fixture.round ?? fixture.matchday ?? 1,
        status: match?.status ?? fixture.status ?? (match?.verified ? "VERIFIED" : "SCHEDULED"),
        scheduledDate: fixture.scheduledAt ?? fixture.scheduledDate,
        homeParticipant: {
          id: home?.id ?? fixture.homeParticipant?.id ?? fixture.homeParticipantId,
          userId: home?.userId ?? home?.playerId ?? fixture.homeParticipant?.playerId ?? fixture.homeParticipant?.userId,
          username: home?.user?.username ?? fixture.homeParticipant?.user?.username ?? fixture.homeParticipant?.username ?? "Home player",
          profilePicture: home?.user?.avatar ?? fixture.homeParticipant?.user?.avatar ?? null,
        },
        awayParticipant: {
          id: away?.id ?? fixture.awayParticipant?.id ?? fixture.awayParticipantId,
          userId: away?.userId ?? away?.playerId ?? fixture.awayParticipant?.playerId ?? fixture.awayParticipant?.userId,
          username: away?.user?.username ?? fixture.awayParticipant?.user?.username ?? fixture.awayParticipant?.username ?? "Away player",
          profilePicture: away?.user?.avatar ?? fixture.awayParticipant?.user?.avatar ?? null,
        },
        homeScore: match?.homeScore ?? fixture.homeScore ?? null,
        awayScore: match?.awayScore ?? fixture.awayScore ?? null,
      };
    }),
    createdAt: competition.createdAt,
    updatedAt: competition.updatedAt,
  };
};

const listResponse = (items: any[]): ApiTournamentListResponse => ({
  success: true,
  tournaments: items.map(toApiTournament),
});

const competitionPath = (groupId: string, tournamentId: string) =>
  `/api/community/${encodeURIComponent(groupId)}/competitions/${encodeURIComponent(tournamentId)}`;

export const getGroupTournaments = async (groupId: string): Promise<ApiTournamentListResponse> => {
  const response = await api.get<ApiEnvelope<any[]>>(`/api/community/${encodeURIComponent(groupId)}/competitions`);
  return listResponse(response.data.data);
};

export const getTournamentById = async (tournamentId: string): Promise<ApiTournamentDetailResponse> => {
  const response = await api.get<ApiEnvelope<any>>(`/api/competitions/${encodeURIComponent(tournamentId)}`);
  return { success: true, tournament: toApiTournament(response.data.data) };
};

export const fetchAllTournaments = async (): Promise<ApiTournamentListResponse> => {
  const response = await api.get<ApiEnvelope<any[]>>("/api/competitions");
  return listResponse(response.data.data);
};

export const getTournamentStatistics = async (groupId: string, tournamentId: string): Promise<ApiPlayerTournamentStatistics[]> => {
  const response = await api.get<ApiEnvelope<ApiPlayerTournamentStatistics[]>>(`${competitionPath(groupId, tournamentId)}/statistics`);
  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const createTournament = async (payload: {
  name: string; description?: string; groupId: string; type: "league" | "knockout";
  maxParticipants: number;
  settings: { pointsForWin: number; pointsForDraw: number; pointsForLoss: number; rounds: "single" | "double" };
  startDate: string; endDate: string; registrationDeadline: string;
}) => {
  const response = await api.post<ApiEnvelope<any>>(
    `/api/community/${encodeURIComponent(payload.groupId)}/competitions`,
    {
      name: payload.name, description: payload.description, type: payload.type.toUpperCase(),
      maxParticipants: payload.maxParticipants,
      pointsForWin: payload.settings.pointsForWin, pointsForDraw: payload.settings.pointsForDraw,
      pointsForLoss: payload.settings.pointsForLoss,
      rules: { doubleRoundRobin: payload.settings.rounds === "double" },
      visibility: "PUBLIC", registrationMode: "OPEN",
      startsAt: payload.startDate, endsAt: payload.endDate,
      registrationOpensAt: new Date().toISOString(), registrationClosesAt: payload.registrationDeadline,
    },
  );
  return { success: response.data.success, message: response.data.message ?? "Tournament created successfully.", tournament: toApiTournament(response.data.data) };
};

export type TournamentRegistrationMode = "OPEN" | "APPROVAL" | "INVITE_ONLY";

export const updateTournamentSettings = async (
  groupId: string,
  tournamentId: string,
  settings: {
    name: string;
    description?: string;
    maxParticipants: number;
    pointsForWin: number;
    pointsForDraw: number;
    pointsForLoss: number;
    rounds: "single" | "double";
    registrationMode: TournamentRegistrationMode;
    registrationOpensAt: string;
    registrationClosesAt: string;
    startsAt: string;
    endsAt: string;
  },
) => {
  const response = await api.patch<ApiEnvelope<any>>(competitionPath(groupId, tournamentId), {
    name: settings.name,
    description: settings.description ?? null,
    maxParticipants: settings.maxParticipants,
    pointsForWin: settings.pointsForWin,
    pointsForDraw: settings.pointsForDraw,
    pointsForLoss: settings.pointsForLoss,
    rules: { doubleRoundRobin: settings.rounds === "double" },
    registrationMode: settings.registrationMode,
    registrationOpensAt: settings.registrationOpensAt,
    registrationClosesAt: settings.registrationClosesAt,
    startsAt: settings.startsAt,
    endsAt: settings.endsAt,
  });
  return {
    success: response.data.success,
    message: response.data.message ?? "Tournament settings saved.",
    tournament: toApiTournament(response.data.data),
  };
};

export type TournamentLifecycleAction = "open-registration" | "close-registration" | "generate-fixtures" | "start" | "advance-round" | "complete";

export const runTournamentLifecycleAction = async (groupId: string, tournamentId: string, action: TournamentLifecycleAction) => {
  const response = await api.post<ApiEnvelope<any>>(`${competitionPath(groupId, tournamentId)}/${action}`);
  return { success: response.data.success, message: response.data.message ?? "Tournament updated successfully.", tournament: toApiTournament(response.data.data) };
};

export const submitTournamentResult = async (groupId: string, tournamentId: string, fixtureId: string, homeScore: number, awayScore: number) => {
  const response = await api.post<ApiEnvelope<any>>(`${competitionPath(groupId, tournamentId)}/results`, { fixtureId, homeScore, awayScore });
  return { success: response.data.success, message: response.data.message ?? "Result submitted for administrator review." };
};

export const joinTournament = async (tournamentId: string): Promise<TournamentMutationResponse> => {
  const response = await api.post<ApiEnvelope<any>>(`/api/competitions/${encodeURIComponent(tournamentId)}/join`);
  const detail = await getTournamentById(tournamentId);
  return { success: true, message: response.data.message ?? "Competition registration submitted", tournament: detail.tournament as any };
};

export const leaveTournament = async (tournamentId: string): Promise<TournamentMutationResponse> => {
  const response = await api.post<ApiEnvelope<any>>(`/api/competitions/${encodeURIComponent(tournamentId)}/leave`);
  return { success: true, message: response.data.message ?? "Left competition", tournament: toApiTournament(response.data.data) as any };
};
