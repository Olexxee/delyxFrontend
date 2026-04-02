import type { AvatarUrl, ID } from "./common";

export type GroupPrivacy = "public" | "private" | "restricted";
export type Role = "owner" | "admin" | "member";

export type GroupOverview = {
  id: string;
  name: string;
  avatar: string | null;
  privacy: GroupPrivacy;
  totalMembers: number;
  chatRoomId?: string | null;
  description: string;
  myRole: Role | null;
  tournamentsPreview: any[]; 
  membersPreview: any[]; 
};

export type MyGroupItem = {
  id: ID;
  name: string;
  description: string | null;
  avatar: string | null;
  privacy: GroupPrivacy;
  totalMembers: number;
  myRole: Role;
  chatRoomId: string | null;
  lastMessagePreview: string | null;
  lastActivityAt: string | null;
  activeTournament: {
    id: string;
    name: string;
    status: import("./tournament").TournamentStatus;
  } | null;
};

export type MyGroupsResponse = {
  success: boolean;
  data: MyGroupItem[];
  page?: number;
  count?: number;
};