import api from "@/api/api";
import type { ImagePickerAsset } from "expo-image-picker";

export type MediaUploadPurpose =
  | "AVATAR"
  | "COMMUNITY_IMAGE"
  | "COMPETITION_IMAGE"
  | "FEED_MEDIA"
  | "CHAT_ATTACHMENT"
  | "MATCH_EVIDENCE"
  | "OTHER";

export type MediaAsset = {
  id: string;
  secureUrl: string;
  purpose: MediaUploadPurpose;
  resourceType: "IMAGE" | "VIDEO" | "RAW";
  originalName: string;
  mimeType: string;
  format?: string | null;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  createdAt: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function uploadMedia(
  asset: ImagePickerAsset,
  purpose: MediaUploadPurpose,
): Promise<MediaAsset> {
  if (!asset.uri) throw new Error("Choose a file before uploading.");

  const formData = new FormData();
  formData.append("purpose", purpose);
  formData.append(
    "media",
    {
      uri: asset.uri,
      name: asset.fileName || asset.uri.split("/").pop() || "upload.jpg",
      type: asset.mimeType || "image/jpeg",
    } as any,
  );

  const { data } = await api.post<ApiEnvelope<MediaAsset>>("/api/media", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });

  if (!data.success || !data.data?.secureUrl || !data.data?.id) {
    throw new Error(data.message || "The server did not return the uploaded media.");
  }

  return data.data;
}
