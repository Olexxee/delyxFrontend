// ─── Status ────────────────────────────────────────────────────────────────
export type TournamentStatus = "registration" | "ongoing" | "completed";

// ─── Pagination ────────────────────────────────────────────────────────────
export interface PaginationMeta {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
}

// ─── API response wrappers ─────────────────────────────────────────────────
export interface TournamentListResponse {
    success: boolean;
    tournaments: ApiTournament[];
    pagination: PaginationMeta;
}

export interface TournamentResponse {
    success: boolean;
    tournament: ApiTournament;
}

// ─── Raw API shape ─────────────────────────────────────────────────────────
export interface ApiParticipant {
    userId: string;
    username: string;
    profilePicture: string | null;
    status: string;
}

export interface ApiTournament {
    _id: string;
    name: string;
    groupId: string;
    createdBy: string;
    type: "league" | "knockout" | "group_stage";
    description?: string;
    maxParticipants: number;
    settings: {
        pointsForWin: number;
        pointsForDraw: number;
        pointsForLoss: number;
        rounds: "single" | "double";
    };
    registrationDeadline: string;
    isRegistrationOpen: boolean;
    startDate: string;
    endDate: string;
    totalMatches: number;
    completedMatches: number;
    currentMatchday: number;
    totalMatchdays: number;
    status: TournamentStatus;
    tournamentCode: string;
    participants: ApiParticipant[];
    userContext: {
        isRegistered: boolean;
        role: string | null;
    };
    createdAt: string;
    updatedAt: string;
}

// ─── Lightweight summary — embedded in GroupOverview.tournamentsPreview ────
export interface TournamentSummary {
    id: string;
    name: string;
    status: TournamentStatus;
    maxParticipants: number;
    participantCount: number;
    startDate: string;
}

// ─── Full UI-normalised shape ──────────────────────────────────────────────
export interface Tournament {
    id: string;
    name: string;
    groupId: string;
    type: string;
    description?: string;
    status: TournamentStatus;
    maxParticipants: number;
    participantCount: number;
    participants: ApiParticipant[];
    isRegistrationOpen: boolean;
    // ISO strings — format at render time
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    totalMatches: number;
    completedMatches: number;
    currentMatchday: number;
    totalMatchdays: number;
    tournamentCode: string;
    settings: ApiTournament["settings"];
    userContext: {
        isRegistered: boolean;
        role: string | null;
    };
    heatScore?: number;
    prizePool?: string;
}

// ─── Adapters ──────────────────────────────────────────────────────────────

export function toTournament(a: ApiTournament): Tournament {
    return {
        id: a._id,
        name: a.name,
        groupId: a.groupId,
        type: a.type,
        description: a.description,
        status: a.status,
        maxParticipants: a.maxParticipants,
        participantCount: a.participants?.length ?? 0,
        participants: a.participants ?? [],
        isRegistrationOpen: a.isRegistrationOpen,
        startDate: a.startDate,
        endDate: a.endDate,
        registrationDeadline: a.registrationDeadline,
        totalMatches: a.totalMatches,
        completedMatches: a.completedMatches,
        currentMatchday: a.currentMatchday,
        totalMatchdays: a.totalMatchdays,
        tournamentCode: a.tournamentCode,
        settings: a.settings,
        userContext: a.userContext ?? { isRegistered: false, role: null },
    };
}

export function summaryToTournament(s: TournamentSummary, groupId: string): Tournament {
    return {
        id: s.id,
        name: s.name,
        groupId,
        type: "league",
        status: s.status,
        maxParticipants: s.maxParticipants,
        participantCount: s.participantCount,
        participants: [],
        isRegistrationOpen: s.status === "registration",
        startDate: s.startDate,
        endDate: "",
        registrationDeadline: "",
        totalMatches: 0,
        completedMatches: 0,
        currentMatchday: 0,
        totalMatchdays: 0,
        tournamentCode: "",
        settings: {
            pointsForWin: 3,
            pointsForDraw: 1,
            pointsForLoss: 0,
            rounds: "double",
        },
        userContext: { isRegistered: false, role: null },
    };
}

// ─── Status meta ───────────────────────────────────────────────────────────
export const STATUS_META: Record<
    TournamentStatus,
    { label: string; color: string; bg: string }
> = {
    registration: { label: "OPEN", color: "#2563EB", bg: "#2563EB18" },
    ongoing: { label: "LIVE", color: "#16a34a", bg: "#16a34a18" },
    completed: { label: "ENDED", color: "#6b7280", bg: "#6b728018" },
};