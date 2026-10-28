import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentSummary } from "@/types/tournament";
import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import TournamentRow from "./Tournamentrow";
import { StatePanel } from "@/components/ui/StatePanel";

interface TournamentListProps {
  tournaments: TournamentSummary[];
  loading: boolean;
  error: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onSelect: (tournament: TournamentSummary) => void;
}

;