import type { AvatarUrl, ID, ISODateString } from "./common";
import type { GroupPrivacy, Role } from "./group";
import type { MemberSummary } from "./member";
import type { TournamentSummary } from "./tournament";
import type { GroupTournamentStats } from "./groupTournament";

export type GroupInfo = {
  group: {
    id: ID;
    name: string;
    description: string;
    avatarUrl?: AvatarUrl;
    privacy: GroupPrivacy;
    totalMembers: number;
    createdBy?: {
      id: ID;
      displayName: string;
    };
    createdAt?: ISODateString;
    myRole: Role;
    joinCodeEnabled?: boolean;
  };
  stats: GroupTournamentStats & {
    totalMessages?: number;
    activeMembers7d?: number;
    avgPoints?: number;
  };
  previews: {
    members: MemberSummary[];
    tournaments: TournamentSummary[];
  };
  adminSignals?: {
    pendingJoinRequestCount: number;
  };
  permissions: {
    canEditGroup: boolean;
    canManageMembers: boolean;
    canCreateTournament: boolean;
    canManageRequests: boolean;
    canLeaveGroup: boolean;
    canDeleteGroup: boolean;
  };
};