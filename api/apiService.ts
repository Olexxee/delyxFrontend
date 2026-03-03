import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";
import api from "./api";

/* ================= AUTH ================= */
export const loginUser = (payload: LoginPayload) =>
  api.post<AuthResponse>("/auth/signin", payload).then((res) => res.data);
export const registerUser = (payload: RegisterPayload) =>
  api.post<AuthResponse>("/auth/signup", payload).then((res) => res.data);

/* ================= FEED ================= */
export const getFeed = () => api.get("/feed").then((res) => res.data);

/* ================= GROUPS ================= */
export const getMyGroups = () =>
  api.get("/groups/my-groups").then((res) =>
    res.data.data.map((raw: any) => ({
      ...raw,
      id: raw.id ?? raw._id,
    })),
  );
export const createGroup = (
  payload: FormData | { name: string; privacy: string; avatar: string | null },
) => {
  const isFormData = payload instanceof FormData;
  return api
    .post("/groups/create", payload, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    })
    .then((res) => res.data);
};

/* ================= CHAT ================= */
export const getChatMessages = (chatRoomId: string) =>
  api.get(`/chats/room/${chatRoomId}/messages`).then((res) => res.data);

export const sendChatMessage = (chatRoomId: string, content: string) =>
  api
    .post(`/chats/room/${chatRoomId}/messages`, { content })
    .then((res) => res.data);

/* ================= TOURNAMENTS ================= */

export const getGroupTournaments = (groupId: string) =>
  api.get(`/tournaments/group/${groupId}`).then((res) => res.data);

export const getTournamentById = (tournamentId: string) =>
  api.get(`/tournaments/${tournamentId}`).then((res) => res.data);

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
}) =>
  api
    .post(`/tournaments/group/${payload.groupId}`, payload)
    .then((res) => res.data);

export const joinTournament = (tournamentId: string) =>
  api.post(`/tournaments/${tournamentId}/join`).then((res) => res.data);

export const leaveTournament = (tournamentId: string) =>
  api.post(`/tournaments/${tournamentId}/leave`).then((res) => res.data);
