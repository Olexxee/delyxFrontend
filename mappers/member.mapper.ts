import type { MemberInsight } from "@/types/MemberInsight";
import type { MemberListItemVM } from "@/view-models/member.vm";
import {
  getFallbackLabel,
  normalizeNullableString,
  toSafeBoolean,
} from "./mapper.utils";

export function mapMemberInsightToVM(
  item: MemberInsight,
): MemberListItemVM {
  return {
    memberId: item.member.id,
    displayName: item.member.displayName,
    username: normalizeNullableString(item.member.username),
    avatarUrl: normalizeNullableString(item.member.avatarUrl),
    fallbackLabel: getFallbackLabel(item.member.displayName),
    role: item.member.role,
    isOnline: toSafeBoolean(item.member.isOnline),
    badges: (item.badges || []).map((badge) => ({
      id: badge.id,
      label: badge.label,
      type: badge.type,
    })),
    lastActiveAt: normalizeNullableString(item.groupStats.lastActiveAt),
    actions: {
      canMessage: item.actions.canMessage,
      canViewProfile: item.actions.canViewProfile,
      canPromote: item.actions.canPromote,
      canDemote: item.actions.canDemote,
      canRemove: item.actions.canRemove,
    },
  };
}