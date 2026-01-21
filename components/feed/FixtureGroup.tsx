import React from "react";
import { StyleSheet, View } from "react-native";
import { FeedItem } from "@/constants/mockFeed";
import { useTheme } from "@/theme/ThemeProvider";
import { FeedCard } from "./FeedCard";
import { FeedCardHeader } from "./FeedCardHeader";
import { FixtureRow } from "./FixtureRow";
import { ResultRow } from "./ResultRow";

type FixturesGroupProps = {
  groupName: string;
  tournamentName?: string;
  items?: FeedItem[];
};

export function FixturesGroup({
  groupName,
  tournamentName,
  items = [],
}: FixturesGroupProps) {
  const { colors } = useTheme();

  return (
    <FeedCard>
      <FeedCardHeader
        groupName={String(groupName)}
        tournamentName={tournamentName ?? "Tournament"}
      />

      <View style={styles.list}>
        {items.map((item, index) => {
          if (!item) return null;

          const isLastItem = index === items.length - 1;

          let row: React.ReactNode = null;

          if (item.type === "RESULT") {
            row = <ResultRow item={item} />;
          }

          if (item.type === "FIXTURE") {
            row = <FixtureRow item={item} />;
          }

          // Unknown or unsupported feed item type
          if (!row) return null;

          return (
            <React.Fragment key={item.id ?? `item-${index}`}>
              {row}

              {!isLastItem && (
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: `${colors.primary}20` },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </FeedCard>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 4,
  },
  separator: {
    height: 1,
    marginVertical: 12,
    marginHorizontal: 8,
  },
});
