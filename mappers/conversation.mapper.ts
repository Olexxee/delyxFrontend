import type {
    ConversationDetail,
    ConversationItem,
} from "@/types/conversation";
import type { ChatHeaderVM, GroupContextStripVM } from "@/view-models/chat.vm";
import type { ConversationListItemVM } from "@/view-models/conversation.vm";
import {
    getFallbackLabel,
    normalizeNullableString,
    toSafeBoolean,
    toSafeNumber,
} from "./mapper.utils";

export function mapConversationItemToConversationListItemVM(
  item: ConversationItem,
): ConversationListItemVM {
  return {
    id: item.chatRoomId,
    chatRoomId: item.chatRoomId,
    contextType: item.type,
    title: item.title,
    subtitle: normalizeNullableString(item.lastMessage?.text),
    avatarUrl: normalizeNullableString(item.avatarUrl),
    fallbackLabel: getFallbackLabel(item.title),
    timestamp: normalizeNullableString(item.lastMessage?.createdAt),
    unreadCount: toSafeNumber(item.unreadCount),
    isMuted: toSafeBoolean(item.isMuted),
    isPinned: toSafeBoolean(item.isPinned),
    meta:
      item.type === "direct"
        ? {
            isOnline: item.directMeta?.isOnline,
          }
        : {
            groupId: item.groupMeta?.groupId,
            memberCount: item.groupMeta?.totalMembers,
            myRole: item.groupMeta?.myRole,
            activeTournamentStatus:
              item.groupMeta?.activeTournament?.status ?? null,
          },
  };
}

export function mapConversationDetailToChatHeaderVM(
  detail: ConversationDetail,
): ChatHeaderVM {
  const isGroup = detail.conversation.type === "group";

  const subtitle = isGroup
    ? `${toSafeNumber(detail.groupMeta?.totalMembers)} members`
    : detail.directMeta?.isOnline
      ? "Online"
      : "Offline";

  return {
    title: detail.conversation.title,
    subtitle,
    avatarUrl: normalizeNullableString(detail.conversation.avatarUrl),
    fallbackLabel: getFallbackLabel(detail.conversation.title),
    contextType: detail.conversation.type,
    actions: {
      canOpenInfo: true,
      canOpenMembers: isGroup,
      canOpenTournaments: isGroup,
    },
  };
}

export function mapConversationDetailToGroupContextStripVM(
  detail: ConversationDetail,
): GroupContextStripVM {
  const tournament = detail.groupMeta?.activeTournament;

  return {
    visible: Boolean(tournament?.id && tournament?.name),
    tournamentId: tournament?.id ?? null,
    tournamentName: tournament?.name ?? null,
    tournamentStatus: tournament?.status ?? null,
    ctaLabel: tournament?.id ? "Open" : null,
  };
}
