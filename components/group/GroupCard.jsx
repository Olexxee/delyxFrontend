import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import { convertToHumanReadableTime } from "@/utils/convertToHumanReadableTime";

export const GroupCard = ({ group, onPress }) => {
  const { colors } = useTheme();

  const hasChat = !!group.chatRoomId;
  const unreadCount = Number(group.unreadCount) || 0;

  return (
    <TouchableOpacity
      activeOpacity={hasChat ? 0.6 : 1}
      onPress={() => (hasChat ? onPress(group.chatRoomId) : null)}
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.surfaceLight,
          borderColor: colors.border, // Ensure you have a border color in your theme
          opacity: hasChat ? 1 : 0.85,
        },
      ]}
    >
      {/* Left: Avatar with Status Indicator if needed */}
      <View style={styles.avatarWrapper}>
        <Avatar uri={group.avatar} size={56} />
        {!hasChat && <View style={[styles.disabledDot, { backgroundColor: colors.textSecondary }]} />}
      </View>

      {/* Middle: Name and Last Message */}
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text 
            style={[styles.groupName, { color: colors.textPrimary }]} 
            numberOfLines={1}
          >
            {group.name}
          </Text>
          {group.lastMessageAt && (
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {convertToHumanReadableTime(group.lastMessageAt)}
            </Text>
          )}
        </View>

        <View style={styles.footerRow}>
          <Text 
            style={[
              styles.messagePreview, 
              { color: hasChat ? colors.textSecondary : colors.error }
            ]} 
            numberOfLines={1}
          >
            {hasChat 
              ? (group.lastMessage?.encryptedContent || "No messages yet") 
              : "Room not initialized"}
          </Text>

          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatarWrapper: {
    position: 'relative',
  },
  disabledDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: "400",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messagePreview: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});