import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentTabKey } from "@/types/tournament";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

interface Props {
  activeTab: TournamentTabKey;
  visibleTabs: TournamentTabKey[];
  onChange: (tab: TournamentTabKey) => void;
}

const TAB_LABELS: Record<TournamentTabKey, string> = {
  overview: "Overview",
  participants: "Participants",
  fixtures: "Fixtures",
  standings: "Standings",
  results: "Results",
};

export default function TournamentDetailTabs({
  activeTab,
  visibleTabs,
  onChange,
}: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {visibleTabs.map((tab) => {
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
                styles.label,
                { color: isActive ? "#fff" : colors.textPrimary },
              ]}
            >
              {TAB_LABELS[tab]}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: 4,
  },
  tab: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
});
