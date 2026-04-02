import type { AvatarUrl, ID } from "./common";
import type { GroupPrivacy, Role } from "./group";
import type { MemberSummary } from "./member";
import type { GroupActiveTournament, GroupTournamentStats } from "./groupTournament";

export type GroupHub = {
  group: {
    id: ID;
    chatRoomId: ID;
    name: string;
    description?: string;
    avatarUrl?: AvatarUrl;
    privacy: GroupPrivacy;
    totalMembers: number;
    myRole: Role;
    isMuted?: boolean;
  };
  activeTournament?: GroupActiveTournament | null;
  stats: GroupTournamentStats & {
    totalMessages?: number;
    activeMembers7d?: number;
  };
  membersPreview: MemberSummary[];
  quickActions: {
    canCreateTournament: boolean;
    canManageGroup: boolean;
    canInviteMembers: boolean;
    canViewRequests: boolean;
  };
};