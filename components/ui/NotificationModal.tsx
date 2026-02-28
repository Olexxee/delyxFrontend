import type { AppNotification } from "@/hooks/Usenotifications";
import { useTheme } from "@/theme/ThemeProvider";
import { convertToHumanReadableTime } from "@/utils/convertToHumanReadableTime";
import { X } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  onClose: () => void;
}

export function NotificationsModal({
  notifications,
  markAsRead,
  markAllAsRead,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>
          Notifications
        </Text>
        <View style={styles.headerActions}>
          {hasUnread && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
              <Text style={[styles.markAllText, { color: colors.accent }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              You're all caught up!
            </Text>
          </View>
        ) : (
          notifications.map((n) => (
            <TouchableOpacity
              key={n._id}
              style={[
                styles.item,
                {
                  backgroundColor: n.read ? colors.surface : colors.surfaceLight,
                  borderColor: n.read ? colors.border : colors.accent,
                },
              ]}
              onPress={() => !n.read && markAsRead(n._id)}
              activeOpacity={n.read ? 1 : 0.7}
            >
              {!n.read && (
                <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
              )}
              <View style={styles.itemContent}>
                <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                  {n.title}
                </Text>
                <Text style={[styles.itemMessage, { color: colors.textSecondary }]}>
                  {n.message}
                </Text>
                <Text style={[styles.itemDate, { color: colors.textSecondary }]}>
                  {convertToHumanReadableTime(n.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  heading: { fontSize: 18, fontWeight: "700" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  markAllBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  markAllText: { fontSize: 13, fontWeight: "600" },
  closeBtn: { padding: 4 },
  list: { flex: 1 },
  listContent: { padding: 16, gap: 10 },
  emptyState: { flex: 1, alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: 15, fontStyle: "italic" },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    marginRight: 10,
  },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: "700" },
  itemMessage: { fontSize: 13, marginTop: 3 },
  itemDate: { fontSize: 11, marginTop: 6 },
});