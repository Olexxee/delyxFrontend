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

const toApiTournament = (item: any): ApiTournament => ({
  id: item.id,
  name: item.name,
  groupId: item.communityId ?? item.groupId,
  createdBy: item.createdBy,
  type: String(item.type ?? "LEAGUE").toLowerCase(),
  description: item.description ?? undefined,
  status: statusMap[item.status] ?? String(item.status ?? "upcoming").toLowerCase(),
  lifecycleStatus: item.status,
  isRegistrationOpen: item.status === "REGISTRATION_OPEN" && (item.registration?.isOpen ?? item.registrationOpen ?? true),
  maxParticipants: item.maxParticipants ?? 0,
  participantCount: item._count?.participants ?? item.participants?.length ?? 0,
  registrationDeadline: item.registration?.closesAt ?? item.registrationClosesAt ?? undefined,
  startDate: item.startsAt ?? item.registrationOpensAt ?? item.createdAt,
  endDate: item.endsAt ?? item.registrationClosesAt ?? item.updatedAt,
  settings: {
    pointsForWin: item.rules?.pointsForWin ?? item.pointsForWin ?? 3,
    pointsForDraw: item.rules?.pointsForDraw ?? item.pointsForDraw ?? 1,
    pointsForLoss: item.rules?.pointsForLoss ?? item.pointsForLoss ?? 0,
    rounds: item.rules?.doubleRoundRobin ? "double" : "single",
  },
  progress: {
    currentMatchday: item.runtime?.currentRound ?? item.runtimeCurrentRound ?? 0,
    totalMatches: item.matches?.length ?? item._count?.matches ?? 0,
    completedMatches: item.matches?.filter((match: any) => match.verified || match.status === "VERIFIED" || match.status === "COMPLETED").length ?? 0,
  },
  viewerContext: item.viewerContext ?? item.userContext,
  participants: item.participants?.map((participant: any) => ({
    id: participant.id,
    userId: participant.playerId ?? participant.userId,
    username: participant.user?.username ?? participant.username ?? "Player",
    profilePicture: participant.user?.avatar ?? participant.profilePicture ?? null,
    status: "active",
  })),
  fixtures: item.fixtures?.map((fixture: any) => {
    const match = item.matches?.find((candidate: any) => candidate.fixtureId === fixture.id);
    const home = item.participants?.find((participant: any) => participant.id === fixture.homeParticipantId);
    const away = item.participants?.find((participant: any) => participant.id === fixture.awayParticipantId);
    return {
      id: fixture.id,
      matchday: fixture.round ?? fixture.matchday ?? 1,
      status: match?.status ?? fixture.status ?? (match?.verified ? "VERIFIED" : "SCHEDULED"),
      scheduledDate: fixture.scheduledAt ?? fixture.scheduledDate,
      homeParticipant: {
        id: home?.id ?? fixture.homeParticipant?.id ?? fixture.homeParticipantId,
        userId: home?.userId ?? fixture.homeParticipant?.playerId ?? fixture.homeParticipant?.userId,
        username: home?.user?.username ?? fixture.homeParticipant?.user?.username ?? fixture.homeParticipant?.username ?? "Home player",
        profilePicture: home?.user?.avatar ?? fixture.homeParticipant?.user?.avatar ?? null,
      },
      awayParticipant: {
        id: away?.id ?? fixture.awayParticipant?.id ?? fixture.awayParticipantId,
        userId: away?.userId ?? fixture.awayParticipant?.playerId ?? fixture.awayParticipant?.userId,
        username: away?.user?.username ?? fixture.awayParticipant?.user?.username ?? fixture.awayParticipant?.username ?? "Away player",
        profilePicture: away?.user?.avatar ?? fixture.awayParticipant?.user?.avatar ?? null,
      },
      homeScore: match?.homeScore ?? fixture.homeScore ?? null,
      awayScore: match?.awayScore ?? fixture.awayScore ?? null,
    };
  }),
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

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
