import type { TournamentStatus } from "./tournament";
import type { Role } from "./group";

export type ConversationType = "group" | "direct";

export type ConversationItem = {
  chatRoomId: string;
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
    chatRoomId: string;
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

export type ChatMessageKind = "user" | "system";
export type ChatMessageContentType = "text" | "media" | "mixed";

export type ChatMessage = {
  id: string;
  chatRoomId?: string;

  kind: ChatMessageKind;
  contentType?: ChatMessageContentType;

  content?: string | null;
  createdAt: string;
  isMine?: boolean;

  media: string[];

  sender?: {
    id?: string;
    username?: string;
    profilePicture?: string | null;
  } | null;

  meta?: {
    tournamentId?: string;
  } | null;
};

export type ConversationMessagesResponse = {
  messages: ChatMessage[];
  count: number;
  hasMore: boolean;
};