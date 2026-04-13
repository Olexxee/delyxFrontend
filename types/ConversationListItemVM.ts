export type ConversationListItemVM = {
  id: string; // stable UI id
  chatRoomId: string;
  contextType: "direct" | "group";

  title: string;
  subtitle: string | null;

  avatarUrl: string | null;
  fallbackLabel: string;

  timestamp: string | null;
  unreadCount: number;

  badges: Array<{
    kind: "role" | "status" | "info";
    label: string;
  }>;

  meta?: {
    groupId?: string;
    isOnline?: boolean;
    memberCount?: number;
    activeTournamentStatus?: string | null;
  };
};