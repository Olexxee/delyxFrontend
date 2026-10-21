import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";
import type { TournamentListResponse } from "@/types/tournament";
import api from "./api";

type BackendEnvelope<T> = {
  success: boolean;
  data: T;
  tokens?: { accessToken: string; refreshToken: string };
};

function normalizeAuthResponse(
  envelope: BackendEnvelope<AuthResponse["user"]>,
): AuthResponse {
  const token = envelope.tokens?.accessToken;
  if (!envelope.success || !envelope.data || !token) {
    throw new Error("The server returned an incomplete authentication response.");
  }
  return { user: envelope.data, token };
}

/* ================= AUTH ================= */
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<BackendEnvelope<AuthResponse["user"]>>(
    "/api/auth/login",
    payload,
  );
  return normalizeAuthResponse(data);
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  // The backend creates the account but does not issue tokens from /register.
  await api.post("/api/auth/register", payload);
  // Sign in immediately after successful registration to establish the native session.
  return loginUser({
    identifier: payload.email,
    password: payload.password,
  });
};

/* ================= FEED ================= */
export const getFeed = () => api.get("/feed").then((res) => res.data);

/* ================= GROUPS ================= */
export const getMyGroups = () =>
  api.get("/groups/my-groups").then((res) =>
    res.data.data.map((raw: any) => ({ ...raw, id: raw.id ?? raw._id })),
  );
export const createGroup = (
  payload: FormData | { name: string; privacy: string; avatar: string | null },
) => {
  const isFormData = payload instanceof FormData;
  return api.post("/groups/create", payload, {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  }).then((res) => res.data);
};

/* ================= CHAT ================= */
export const getChatMessages = (chatRoomId: string) =>
  api.get(`/chats/room/${chatRoomId}/messages`).then((res) => res.data);
export const sendChatMessage = (chatRoomId: string, content: string) =>
  api.post(`/chats/room/${chatRoomId}/messages`, { content }).then((res) => res.data);

/* ================= LEGACY TOURNAMENT CONTRACTS =================
 * These routes belong to the previous API shape. Competition screens must migrate
 * to src/features/competitions before being considered connected to newDelyx.
 */
export const getGroupTournaments = (groupId: string) =>
  api.get(`/tournaments/group/${groupId}`).then((res) => res.data);
export const getTournamentById = (tournamentId: string) =>
  api.get(`/tournaments/${tournamentId}`).then((res) => res.data);
export const fetchAllTournaments = (): Promise<TournamentListResponse> =>
  api.get("/tournaments/").then((res) => res.data);
export const createTournament = (payload: {
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
}) => api.post(`/tournaments/group/${payload.groupId}`, payload).then((res) => res.data);
export const joinTournament = (tournamentId: string) =>
  api.post(`/tournaments/${tournamentId}/join`).then((res) => res.data);
export const leaveTournament = (tournamentId: string) =>
  api.post(`/tournaments/${tournamentId}/leave`).then((res) => res.data);
