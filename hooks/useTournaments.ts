import {
  createTournament,
  fetchAllTournaments,
  getGroupTournaments,
  getTournamentById,
  joinTournament,
  leaveTournament,
} from "@/api/tournamentApi";
import type {
  TournamentDetail,
  TournamentSummary,
  TournamentType,
  TournamentRoundMode,
} from "@/types/tournament";
import type {
  ApiTournamentDetailResponse,
  ApiTournamentListResponse,
} from "@/types/tournamentApi";
import {
  toTournamentDetail,
  toTournamentSummary,
} from "@/utils/tournamentMappers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const tournamentKeys = {
  all: ["tournaments", "all"] as const,
  byGroup: (groupId: string) => ["tournaments", "group", groupId] as const,
  groupRoot: ["tournaments", "group"] as const,
  detail: (tournamentId: string) =>
    ["tournaments", "detail", tournamentId] as const,
};

export type CreateTournamentPayload = {
  name: string;
  description?: string;
  groupId: string;
  type: Extract<TournamentType, "league" | "knockout">;
  maxParticipants: number;
  settings: {
    pointsForWin: number;
    pointsForDraw: number;
    pointsForLoss: number;
    rounds: TournamentRoundMode;
  };
  startDate: string;
  endDate: string;
  registrationDeadline: string;
};

export function useAllTournaments() {
  return useQuery<TournamentSummary[]>({
    queryKey: tournamentKeys.all,
    queryFn: async (): Promise<TournamentSummary[]> => {
      const data: ApiTournamentListResponse = await fetchAllTournaments();
      return data.tournaments.map(toTournamentSummary);
    },
  });
}

export function useGroupTournaments(groupId: string) {
  return useQuery<TournamentSummary[]>({
    queryKey: tournamentKeys.byGroup(groupId),
    queryFn: async (): Promise<TournamentSummary[]> => {
      const data: ApiTournamentListResponse = await getGroupTournaments(groupId);
      return data.tournaments.map(toTournamentSummary);
    },
    enabled: Boolean(groupId && groupId !== "undefined"),
  });
}

export function useTournamentDetail(tournamentId: string) {
  return useQuery<TournamentDetail>({
    queryKey: tournamentKeys.detail(tournamentId),
    queryFn: async (): Promise<TournamentDetail> => {
      const data: ApiTournamentDetailResponse =
        await getTournamentById(tournamentId);
      return toTournamentDetail(data.tournament);
    },
    enabled: Boolean(tournamentId && tournamentId !== "undefined"),
  });
}

export function useCreateTournament(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTournamentPayload) => createTournament(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.byGroup(groupId),
      });
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.all,
      });
    },
  });
}

export function useJoinTournament(tournamentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!tournamentId || tournamentId === "undefined") {
        throw new Error("Invalid tournamentId");
      }

      return joinTournament(tournamentId);
    },
    onSuccess: (data) => {
      if (data?.tournament) {
        queryClient.setQueryData(
          tournamentKeys.detail(tournamentId),
          data.tournament,
        );
      }

      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.groupRoot,
      });
    },
  });
}

export function useLeaveTournament(tournamentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!tournamentId || tournamentId === "undefined") {
        throw new Error("Invalid tournamentId");
      }

      return leaveTournament(tournamentId);
    },
    onSuccess: (data) => {
      if (data?.tournament) {
        queryClient.setQueryData(
          tournamentKeys.detail(tournamentId),
          data.tournament,
        );
      }

      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.groupRoot,
      });
    },
  });
}