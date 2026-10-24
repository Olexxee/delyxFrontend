import api from "@/api/api";

export type TournamentMediaRole = "COVER" | "PROMO" | "GALLERY_1" | "GALLERY_2";

export interface TournamentMediaAsset {
  id: string;
  role: TournamentMediaRole;
  url: string;
  originalName: string;
  mimeType: string;
  format: string | null;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  createdAt: string;
  attachedAt: string;
}

type ApiEnvelope<T> = { success: boolean; data: T; message?: string };

const mediaPath = (communityId: string, tournamentId: string) =>
  `/api/community/${encodeURIComponent(communityId)}/competitions/${encodeURIComponent(tournamentId)}/media`;

export async function getTournamentMedia(communityId: string, tournamentId: string) {
  const response = await api.get<ApiEnvelope<TournamentMediaAsset[]>>(mediaPath(communityId, tournamentId));
  return Array.isArray(response.data.data) ? response.data.data : [];
}

export async function uploadTournamentMedia(
  communityId: string,
  tournamentId: string,
  role: TournamentMediaRole,
  asset: { uri: string; fileName?: string | null; mimeType?: string | null },
) {
  const body = new FormData();
  body.append("role", role);
  body.append("media", {
    uri: asset.uri,
    name: asset.fileName || `tournament-${role.toLowerCase()}-${Date.now()}.jpg`,
    type: asset.mimeType || "image/jpeg",
  } as unknown as Blob);
  const response = await api.post<ApiEnvelope<TournamentMediaAsset>>(
    mediaPath(communityId, tournamentId),
    body,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
}

export async function removeTournamentMedia(
  communityId: string,
  tournamentId: string,
  mediaId: string,
) {
  const response = await api.delete<ApiEnvelope<{ mediaId: string; role: string; detached: boolean }>>(
    `${mediaPath(communityId, tournamentId)}/${encodeURIComponent(mediaId)}`,
  );
  return response.data.data;
}
