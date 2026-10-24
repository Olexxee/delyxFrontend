import {
  getTournamentMedia,
  removeTournamentMedia,
  uploadTournamentMedia,
  type TournamentMediaRole,
} from "@/api/tournamentMediaApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const tournamentMediaKey = (communityId: string, tournamentId: string) =>
  ["tournaments", "media", communityId, tournamentId] as const;

export function useTournamentMedia(communityId: string, tournamentId: string) {
  const queryClient = useQueryClient();
  const queryKey = tournamentMediaKey(communityId, tournamentId);
  const mediaQuery = useQuery({
    queryKey,
    queryFn: () => getTournamentMedia(communityId, tournamentId),
    enabled: Boolean(communityId && tournamentId),
  });

  const uploadMutation = useMutation({
    mutationFn: (input: {
      role: TournamentMediaRole;
      asset: { uri: string; fileName?: string | null; mimeType?: string | null };
    }) => uploadTournamentMedia(communityId, tournamentId, input.role, input.asset),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (mediaId: string) => removeTournamentMedia(communityId, tournamentId, mediaId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  return { ...mediaQuery, uploadMutation, removeMutation };
}
