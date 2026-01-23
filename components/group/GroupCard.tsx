import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import { convertToHumanReadableTime } from "@/utils/convertToHumanReadableTime";

export interface GroupType {
  id: string;
  name: string;
  avatar?: string;
  chatRoomId?: string | null;
  lastMessage?: { encryptedContent: string; sender: string; createdAt: string } | null;
  lastMessageAt?: string | null;
  unreadCount?: number;
}

interface GroupCardProps {
  group: GroupType;
  onPress: (chatRoomId: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onPress }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); // Get device safe area insets

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceLight,
          marginLeft: 16 + insets.left, // respect left safe area
          marginRight: 16 + insets.right, // respect right safe area
        },
      ]}
      onPress={() => group.chatRoomId && onPress(group.chatRoomId)}
      activeOpacity={0.7}
    >
      <Avatar uri={group.avatar} size={50} />

      <View style={styles.textContainer}>
        <Text style={[styles.groupName, { color: colors.textPrimary }]}>
          {group.name}
        </Text>
        <Text style={[styles.lastMessage, { color: colors.textSecondary }]} numberOfLines={1}>
          {group.lastMessage?.encryptedContent || "No messages yet."}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        {group.lastMessageAt && (
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {convertToHumanReadableTime(group.lastMessageAt)}
          </Text>
        )}
        {group.unreadCount && group.unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.unreadText}>{group.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  textContainer: { flex: 1, marginHorizontal: 12 },
  groupName: { fontSize: 16, fontWeight: "700" },
  lastMessage: { fontSize: 14, marginTop: 2 },
  rightContainer: { alignItems: "flex-end", justifyContent: "center" },
  timestamp: { fontSize: 12, marginBottom: 4 },
  unreadBadge: {
    borderRadius: 8,
    minWidth: 16,
    paddingHorizontal: 4,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: { color: "#fff", fontSize: 10, fontWeight: "700", textAlign: "center" },
});
