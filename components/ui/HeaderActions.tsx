import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Avatar } from "@/components/ui/Avatar";
import { NotificationsModal } from "@/components/ui/NotificationModal";
import api from "@/api/api";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  userId: string;
  avatar?: string;
  onLogout: () => void;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

/** HeaderActions component: notifications + logout */
export function HeaderActions({ userId, onLogout }: { userId: string; onLogout: () => void }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // only fetch notifications if userId exists
  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await api.get<{ success: boolean; data: Notification[] }>(
          "/notifications"
        );
        if (res.data.success && mounted) {
          const notifs = res.data.data;
          setNotifications(notifs);
          setUnreadCount(notifs.filter((n) => !n.read).length);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <View style={styles.iconsRow}>
      {/* Notifications */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.bellContainer}>
        <Text style={styles.bellIcon}>🔔</Text>
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.accent }]}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <Text style={[styles.logoutText, { color: colors.accent }]}>Logout</Text>
      </TouchableOpacity>

      {/* Notifications Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <NotificationsModal
          notifications={notifications}
          markAsRead={handleMarkAsRead}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
}

/** HeaderTitle component: title + optional subtitle */
function HeaderTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.textContainer}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
}

/** Avatar wrapper */
function HeaderAvatar({ avatarUri }: { avatarUri?: string }) {
  return <Avatar uri={avatarUri || ""} size={44} />;
}

/** AppScreenHeader main component */
export function AppScreenHeader({ title, subtitle, userId, avatar, onLogout }: ScreenHeaderProps) {
  if (!userId) return <View style={{ height: 80 }} />; // placeholder while loading

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <HeaderAvatar avatarUri={avatar} />
        <HeaderTitle title={title} subtitle={subtitle} />
        <HeaderActions userId={userId} onLogout={onLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: { flex: 1, marginHorizontal: 12 },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { fontSize: 14, marginTop: 2 },
  iconsRow: { flexDirection: "row", alignItems: "center" },
  bellContainer: { marginRight: 16, position: "relative" },
  bellIcon: { fontSize: 24 },
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700", textAlign: "center" },
  logoutButton: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  logoutText: { fontSize: 14, fontWeight: "600" },
});
