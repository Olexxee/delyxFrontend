import type { TournamentDetail, TournamentTabKey } from "@/types/tournament";
import React from "react";
import TournamentFixturesTab from "./TournamentFixturesTab";
import TournamentOverviewTab from "./TournamentOverviewTab";
import TournamentParticipantsTab from "./TournamentParticipantsTab";
import TournamentResultsTab from "./TournamentResultsTab";
import TournamentStandingsTab from "./TournamentStandingsTab";

interface Props {
  activeTab: TournamentTabKey;
  tournament: TournamentDetail;
}

export default function TournamentTabContent({ activeTab, tournament }: Props) {
  switch (activeTab) {
    case "overview":
      return <TournamentOverviewTab tournament={tournament} />;

    case "participants":
      return (
        <TournamentParticipantsTab
          participants={tournament.participants}
          viewerParticipantId={tournament.viewerContext.participantId}
          maxParticipants={tournament.maxParticipants}
          participantCount={tournament.participantCount}
          status={tournament.status}
        />
      );

    case "fixtures":
      return (
        <TournamentFixturesTab
          fixtures={tournament.fixtures ?? []}
          viewerParticipantId={tournament.viewerContext.participantId}
        />
      );

    case "standings":
      return (
        <TournamentStandingsTab
          standings={tournament.standings ?? []}
          viewerParticipantId={tournament.viewerContext.participantId}
        />
      );

    case "results":
      return <TournamentResultsTab tournament={tournament} />;

    default:
      return null;
  }
}
