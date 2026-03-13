import {
  createTournament,
  fetchAllTournaments,
  getGroupTournaments,
  getTournamentById,
  joinTournament,
  leaveTournament,
} from "@/api/apiService";
import type { ApiTournament } from "@/types/tournament";
import { toTournament } from "@/types/tournament";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const tournamentKeys = {
  all: ["tournaments", "all"] as const,
  byGroup: (groupId: string) => ["tournaments", "group", groupId] as const,
  detail: (tournamentId: string) => ["tournaments", "detail", tournamentId] as const,
};

export function useAllTournaments() {
  return useQuery({
    queryKey: tournamentKeys.all,
    queryFn: async () => {
      const data = await fetchAllTournaments();
      return data.tournaments.map(toTournament);
    },
  });
}

export function useGroupTournaments(groupId: string) {
  return useQuery({
    queryKey: tournamentKeys.byGroup(groupId),
    queryFn: async () => {
      const data = await getGroupTournaments(groupId);
      return (data.tournaments as ApiTournament[]).map(toTournament);
    },
    enabled: !!groupId && groupId !== "undefined",
  });
}

export function useTournamentDetail(tournamentId: string) {
  return useQuery({
    queryKey: tournamentKeys.detail(tournamentId),
    queryFn: async () => {
      const data = await getTournamentById(tournamentId);
      return toTournament(data.tournament as ApiTournament);
    },
    enabled: !!tournamentId && tournamentId !== "undefined",
  });
}

export function useCreateTournament(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tournamentKeys.byGroup(groupId) });
      queryClient.invalidateQueries({ queryKey: tournamentKeys.all });
    },
  });
}

// Combined join — joins the group AND the tournament in one request
export function useJoinTournament(tournamentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => joinTournament(tournamentId),  // POST /:tournamentId/join
    onSuccess: (data) => {
      // Invalidate tournament detail so userContext.isRegistered updates
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(tournamentId),
      });
      // Invalidate all tournaments list so participant count updates
      queryClient.invalidateQueries({ queryKey: tournamentKeys.all });
    },
  });
}

export function useLeaveTournament(tournamentId: string, groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => leaveTournament(tournamentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tournamentKeys.detail(tournamentId),
      });
      queryClient.invalidateQueries({ queryKey: tournamentKeys.byGroup(groupId) });
      queryClient.invalidateQueries({ queryKey: tournamentKeys.all });
    },
  });
}