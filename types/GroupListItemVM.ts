export type GroupListItemVM = {
  groupId: string;
  chatRoomId: string | null;

  name: string;
  description: string | null;

  avatarUrl: string | null;
  fallbackLabel: string;

  privacy: "public" | "private" | "protected";
  memberCount: number;
  myRole: "owner" | "admin" | "member" | null;

  lastActivityText: string | null;
  lastActivityAt: string | null;
  unreadCount: number;

  activeTournament: {
    id: string;
    name: string;
    status: string;
  } | null;
};