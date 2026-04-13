import type { GroupHub } from "@/types/groupHub";
import type { GroupListItemVM, GroupShellVM } from "@/view-models/group.vm";
import {
  getFallbackLabel,
  normalizeNullableString,
  toSafeBoolean,
  toSafeNumber,
} from "./mapper.utils";

type GroupListSource = {
  id: string;
  chatRoomId?: string | null;
  name: string;
  description?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  privacy: string;
  totalMembers: number;
  myRole?: string | null;
  lastMessagePreview?: string | null;
  lastActivityAt?: string | null;
  unreadCount?: number;
  activeTournament?: {
    id: string;
    name: string;
    status: string;
  } | null;
};

export function mapGroupListItemToVM(item: GroupListSource): GroupListItemVM {
  return {
    groupId: item.id,
    chatRoomId: item.chatRoomId ?? null,
    name: item.name,
    description: normalizeNullableString(item.description),
    avatarUrl: normalizeNullableString(item.avatarUrl ?? item.avatar),
    fallbackLabel: getFallbackLabel(item.name),
    privacy: item.privacy,
    memberCount: toSafeNumber(item.totalMembers),
    myRole: item.myRole ?? null,
    lastActivityText: normalizeNullableString(item.lastMessagePreview),
    lastActivityAt: normalizeNullableString(item.lastActivityAt),
    unreadCount: toSafeNumber(item.unreadCount),
    activeTournament: item.activeTournament
      ? {
          id: item.activeTournament.id,
          name: item.activeTournament.name,
          status: item.activeTournament.status,
        }
      : null,
  };
}

export function mapGroupHubToGroupShellVM(data: GroupHub): GroupShellVM {
  return {
    groupId: String(data.group.id),
    chatRoomId: String(data.group.chatRoomId),
    name: data.group.name,
    description: normalizeNullableString(data.group.description),
    avatarUrl: normalizeNullableString(data.group.avatarUrl),
    fallbackLabel: getFallbackLabel(data.group.name),
    privacy: data.group.privacy,
    memberCount: toSafeNumber(data.group.totalMembers),
    myRole: data.group.myRole,
    isMuted: toSafeBoolean(data.group.isMuted),
    activeTournament: data.activeTournament
      ? {
          id: String(data.activeTournament.id),
          name: data.activeTournament.name,
          status: data.activeTournament.status,
        }
      : null,
    stats: {
      activeTournaments: toSafeNumber(data.stats.activeTournaments),
      totalTournaments: toSafeNumber(data.stats.totalTournaments),
      totalMessages: data.stats.totalMessages,
      activeMembers7d: data.stats.activeMembers7d,
    },
    permissions: {
      canCreateTournament: data.quickActions.canCreateTournament,
      canManageGroup: data.quickActions.canManageGroup,
      canInviteMembers: data.quickActions.canInviteMembers,
      canViewRequests: data.quickActions.canViewRequests,
    },
  };
}