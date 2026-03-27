import api from "@/api/api";
import type {
  ApiTournamentDetailResponse,
  ApiTournamentListResponse,
  TournamentMutationResponse,
} from "@/types/tournamentApi";

export const getGroupTournaments: (
  groupId: string
) => Promise<ApiTournamentListResponse> = async (groupId) => {
  const res = await api.get<ApiTournamentListResponse>(`/tournaments/group/${groupId}`);
  return res.data;
};

export const getTournamentById: (
  tournamentId: string
) => Promise<ApiTournamentDetailResponse> = async (tournamentId) => {
  const res = await api.get<ApiTournamentDetailResponse>(`/tournaments/${tournamentId}`);
  return res.data;
};

export const fetchAllTournaments: () => Promise<ApiTournamentListResponse> =
  async () => {
    const res = await api.get<ApiTournamentListResponse>("/tournaments/");
    return res.data;
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
  const res = await api.post(`/tournaments/group/${payload.groupId}`, payload);
  return res.data;
};

export const joinTournament = async (
  tournamentId: string,
): Promise<TournamentMutationResponse> => {
  const res = await api.post(`/tournaments/${tournamentId}/join`);
  return res.data;
};

export const leaveTournament = async (
  tournamentId: string,
): Promise<TournamentMutationResponse> => {
  const res = await api.post(`/tournaments/${tournamentId}/leave`);
  return res.data;
};