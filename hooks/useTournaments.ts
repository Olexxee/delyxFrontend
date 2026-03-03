import {
  getGroupTournaments, getTournamentById,
  createTournament, joinTournament, leaveTournament,
} from "@/api/apiService";
import type { ApiTournament } from "@/types/tournament";
import { toTournament } from "@/types/tournament";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const tournamentKeys = {
  all:    (groupId: string)      => ["tournaments", groupId]     as const,
  detail: (tournamentId: string) => ["tournament", tournamentId] as const,
};

export function useGroupTournaments(groupId: string) {
  return useQuery({
    queryKey: tournamentKeys.all(groupId),
    queryFn: async () => {
      const data = await getGroupTournaments(groupId);
      return (data.tournaments as ApiTournament[]).map(toTournament);
    },
    enabled: !!groupId,
  });
}

export function useTournamentDetail(tournamentId: string) {
  return useQuery({
    queryKey: tournamentKeys.detail(tournamentId),
    queryFn: async () => {
      const data = await getTournamentById(tournamentId);
      return toTournament(data.tournament as ApiTournament);
    },
    enabled: !!tournamentId,
  });
}

export function useCreateTournament(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tournamentKeys.all(groupId) });
    },
  });
}

export function useJoinTournament(tournamentId: string, groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => joinTournament(tournamentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tournamentKeys.detail(tournamentId) });
      queryClient.invalidateQueries({ queryKey: tournamentKeys.all(groupId) });
    },
  });
}

export function useLeaveTournament(tournamentId: string, groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => leaveTournament(tournamentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tournamentKeys.detail(tournamentId) });
      queryClient.invalidateQueries({ queryKey: tournamentKeys.all(groupId) });
    },
  });
}