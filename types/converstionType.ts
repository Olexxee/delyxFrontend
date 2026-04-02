import type { TournamentStatus } from "./tournament";
import type { Role } from "./group";

export type ConversationType = "group" | "direct";

export type ConversationItem = {
  id: string;
  type: ConversationType;
  title: string;
  avatarUrl?: string | null;
  lastMessage?: {
    text: string;
    createdAt: string;
    senderName?: string;
    isSystem?: boolean;
  } | null;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  directMeta?: {
    userId: string;
    username?: string;
    isOnline?: boolean;
  };
  groupMeta?: {
    groupId: string;
    totalMembers: number;
    myRole: Role;
    activeTournament?: {
      id: string;
      name: string;
      status: TournamentStatus;
    } | null;
  };
};

export type InboxResponse = {
  items: ConversationItem[];
};

export type ConversationDetail = {
  conversation: {
    id: string;
    type: ConversationType;
    title: string;
    avatarUrl?: string | null;
    isMuted?: boolean;
  };
  directMeta?: {
    userId: string;
    username?: string;
    isOnline?: boolean;
  };
  groupMeta?: {
    groupId: string;
    totalMembers: number;
    myRole: Role;
    activeTournament?: {
      id: string;
      name: string;
      status: TournamentStatus;
    } | null;
  };
};

export type ChatMessageType = "text" | "media" | "mixed" | "system";

export type ChatMessage = {
  id: string;
  chatRoomId: string;
  sender: {
    id: string;
    username: string;
    profilePicture?: string | null;
  } | null;
  content: string;
  media: string[];
  messageType: ChatMessageType;
  meta?: Record<string, unknown> | null;
  createdAt: string;
  isMine: boolean;
};

export type ConversationMessagesResponse = {
  messages: ChatMessage[];
  count: number;
  hasMore: boolean;
};