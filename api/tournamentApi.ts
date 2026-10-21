import api from "@/api/api";
import type {
  ApiTournament,
  ApiTournamentDetailResponse,
  ApiTournamentListResponse,
  TournamentMutationResponse,
} from "@/types/tournamentApi";

type ApiEnvelope<T> = { success: boolean; data: T; message?: string };

const statusMap: Record<string, string> = {
  DRAFT: "draft",
  REGISTRATION_OPEN: "registration",
  REGISTRATION_CLOSED: "registration",
  READY: "upcoming",
  IN_PROGRESS: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  ARCHIVED: "completed",
};

const toApiTournament = (item: any): ApiTournament => ({
  id: item.id,
  name: item.name,
  groupId: item.communityId,
  createdBy: item.createdBy,
  type: String(item.type ?? "LEAGUE").toLowerCase(),
  description: item.description ?? undefined,
  status: statusMap[item.status] ?? String(item.status ?? "upcoming").toLowerCase(),
  isRegistrationOpen: Boolean(item.registrationOpen),
  maxParticipants: item.maxParticipants ?? 0,
  participantCount: item._count?.participants ?? item.participants?.length ?? 0,
  registrationDeadline: item.registrationClosesAt ?? undefined,
  startDate: item.startsAt ?? item.registrationOpensAt ?? item.createdAt,
  endDate: item.endsAt ?? item.registrationClosesAt ?? item.updatedAt,
  settings: {
    pointsForWin: item.pointsForWin ?? 3,
    pointsForDraw: item.pointsForDraw ?? 1,
    pointsForLoss: item.pointsForLoss ?? 0,
  },
  progress: {
    currentMatchday: item.runtimeCurrentRound ?? 0,
    totalMatches: item.matches?.length ?? item._count?.matches ?? 0,
    completedMatches: item.matches?.filter((match: any) => match.status === "VERIFIED" || match.status === "COMPLETED").length ?? 0,
  },
  participants: item.participants?.map((participant: any) => ({
    id: participant.id,
    userId: participant.userId,
    username: participant.user?.username ?? "Player",
    profilePicture: participant.user?.avatar ?? null,
    status: "registered",
  })),
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const listResponse = (items: any[]): ApiTournamentListResponse => ({
  success: true,
  tournaments: items.map(toApiTournament),
});

export const getGroupTournaments = async (
  groupId: string,
): Promise<ApiTournamentListResponse> => {
  const response = await api.get<ApiEnvelope<any[]>>(
    `/api/community/${encodeURIComponent(groupId)}/competitions`,
  );
  return listResponse(response.data.data);
};

export const getTournamentById = async (
  tournamentId: string,
): Promise<ApiTournamentDetailResponse> => {
  const response = await api.get<ApiEnvelope<any>>(
    `/api/competitions/${encodeURIComponent(tournamentId)}`,
  );
  return { success: true, tournament: toApiTournament(response.data.data) };
};

export const fetchAllTournaments = async (): Promise<ApiTournamentListResponse> => {
  const response = await api.get<ApiEnvelope<any[]>>("/api/competitions");
  return listResponse(response.data.data);
};

export const createTournament = async (payload: {
  name: string;
  description?: string;
  groupId: string;
  type: "league" | "knockout";
  maxParticipants: number;
  settings: {
    pointsForWin: number;
    pointsForDraw: number;
    pointsForLoss: number;
    rounds: "single" | "double";
  };
  startDate: string;
  endDate: string;
  registrationDeadline: string;
}) => {
  const response = await api.post<ApiEnvelope<any>>(
    `/api/community/${encodeURIComponent(payload.groupId)}/competitions`,
    {
      name: payload.name,
      description: payload.description,
      type: payload.type.toUpperCase(),
      maxParticipants: payload.maxParticipants,
      pointsForWin: payload.settings.pointsForWin,
      pointsForDraw: payload.settings.pointsForDraw,
      pointsForLoss: payload.settings.pointsForLoss,
      rules: { doubleRoundRobin: payload.settings.rounds === "double" },
      visibility: "PUBLIC",
      registrationMode: "OPEN",
      startsAt: payload.startDate,
      endsAt: payload.endDate,
      registrationOpensAt: new Date().toISOString(),
      registrationClosesAt: payload.registrationDeadline,
    },
  );
  return response.data;
};

export const joinTournament = async (
  tournamentId: string,
): Promise<TournamentMutationResponse> => {
  const response = await api.post<ApiEnvelope<any>>(
    `/api/competitions/${encodeURIComponent(tournamentId)}/join`,
  );
  return { success: true, message: response.data.message ?? "Joined competition", tournament: toApiTournament(response.data.data) as any };
};

export const leaveTournament = async (
  tournamentId: string,
): Promise<TournamentMutationResponse> => {
  const response = await api.post<ApiEnvelope<any>>(
    `/api/competitions/${encodeURIComponent(tournamentId)}/leave`,
  );
  return { success: true, message: response.data.message ?? "Left competition", tournament: toApiTournament(response.data.data) as any };
};
