export type GroupPrivacy = "public" | "private";

export interface Group {
  id: string;
  name: string;
  avatar?: string | null;
  privacy: GroupPrivacy;
  memberCount?: number;
}

export interface DiscoverGroupsResponse {
  page: number;
  totalPages: number;
  groups: Group[];
}
