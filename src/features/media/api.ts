import api from "@/api/api";
import { Platform } from "react-native";
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

  const fileName =
    asset.fileName || asset.uri.split("/").pop()?.split("?")[0] || "upload.jpg";
  const mimeType = asset.mimeType || "image/jpeg";
  const formData = new FormData();

  formData.append("purpose", purpose);

  if (Platform.OS === "web") {
    // On web, Multer needs a real File/Blob in FormData, not the React Native
    // { uri, name, type } descriptor used by native fetch/XHR implementations.
    let file = asset.file;

    if (!file) {
      const response = await fetch(asset.uri);
      if (!response.ok) {
        throw new Error("Could not read the selected image. Please choose it again.");
      }
      const blob = await response.blob();
      file = new File([blob], fileName, {
        type: mimeType || blob.type || "application/octet-stream",
      });
    }

    formData.append("media", file, file.name || fileName);
  } else {
    // Expo native uploads use the React Native URI descriptor.
    formData.append(
      "media",
      {
        uri: asset.uri,
        name: fileName,
        type: mimeType,
      } as any,
    );
  }

  const { data } = await api.post<ApiEnvelope<MediaAsset>>("/api/media", formData, {
    // Do not set Content-Type manually. Axios/the platform must add the
    // multipart boundary so Multer can parse the incoming file correctly.
    timeout: 60000,
  });

  if (!data.success || !data.data?.secureUrl || !data.data?.id) {
    throw new Error(data.message || "The server did not return the uploaded media.");
  }

  return data.data;
}
