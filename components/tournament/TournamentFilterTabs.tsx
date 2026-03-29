import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentStatus, TournamentSummary } from "@/types/tournament";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type ListTab = TournamentStatus | "all";

type Props = {
  activeTab: ListTab;
  tournaments: TournamentSummary[];
  onChange: (tab: ListTab) => void;
};

const TABS: ListTab[] = [
  "all",
  "registration",
  "upcoming",
  "ongoing",
  "completed",
];

function getTabLabel(tab: ListTab) {
  switch (tab) {
    case "all":
      return "All";
    case "registration":
      return "Registration";
    case "upcoming":
      return "Upcoming";
    case "ongoing":
      return "Ongoing";
    case "completed":
      return "Completed";
    default:
      return tab;
  }
}

export default function TournamentFilterTabs({
  activeTab,
  tournaments,
  onChange,
}: Props) {
  const { colors } = useTheme();

  const counts: Record<ListTab, number> = {
    all: tournaments.length,
    registration: tournaments.filter((t) => t.status === "registration").length,
    upcoming: tournaments.filter((t) => t.status === "upcoming").length,
    ongoing: tournaments.filter((t) => t.status === "ongoing").length,
    completed: tournaments.filter((t) => t.status === "completed").length,
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {TABS.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <Pressable
              key={tab}
              onPress={() => onChange(tab)}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? colors.background : colors.textPrimary },
                ]}
              >
                {getTabLabel(tab)}
              </Text>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isActive
                      ? colors.background
                      : colors.surfaceLight,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: isActive ? colors.primary : colors.textSecondary,
                    },
                  ]}
                >
                  {counts[tab]}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 12,
  },
  content: {
    paddingHorizontal: 16,
    gap: 10,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
