import type { ID, ISODateString } from "./common";
import type { TournamentStatus, TournamentSummary, TournamentType } from "./tournament";

export type GroupActiveTournament = {
  id: ID;
  name: string;
  type?: TournamentType;
  status: TournamentStatus;
  currentParticipants?: number;
  maxParticipants?: number;
  currentMatchday?: number;
  totalMatchdays?: number;
  completedMatches?: number;
  totalMatches?: number;
  registrationDeadline?: ISODateString;
  startDate?: ISODateString;
};

export type GroupTournamentStats = {
  activeTournaments: number;
  totalTournaments: number;
};

export type GroupTournamentPreview = TournamentSummary;