export type ConversationListItemVM = {
  id: string;
  chatRoomId: string;
  contextType: "direct" | "group";

  title: string;
  subtitle: string | null;

  avatarUrl: string | null;
  fallbackLabel: string;

  timestamp: string | null;
  unreadCount: number;

  isMuted: boolean;
  isPinned: boolean;

  meta?: {
    isOnline?: boolean;
    groupId?: string;
    memberCount?: number;
    myRole?: string;
    activeTournamentStatus?: string | null;
  };
};