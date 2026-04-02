import type { AvatarUrl, ID } from "./common";
import type { Role } from "./group";

export type MemberSummary = {
  id: ID;
  displayName: string;
  avatarUrl?: AvatarUrl;
  role: Role;
  isOnline?: boolean;
};

export interface PaginatedMembersResponse {
  page: number;
  totalPages: number;
  total: number;
  members: MemberSummary[];
}