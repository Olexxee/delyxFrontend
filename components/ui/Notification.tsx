import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";

import { UserContext } from "@/authContext/UserContext";
import api from "@/api/api";
import { NotificationsModal } from "@/components/ui/NotificationModal";
import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export function AppScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  const { colors } = useTheme();
  const { user, setUser } = useContext(UserContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: Notification) => !n.read).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Listen to FCM messages in real-time
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage?.notification) {
        const newNotification: Notification = {
          _id: remoteMessage.messageId || Date.now().toString(),
          title: remoteMessage.notification.title || "New Notification",
          message: remoteMessage.notification.body || "",
          createdAt: new Date().toISOString(),
          read: false,
        };
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    });

    return unsubscribe;
  }, [user]);

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleLogout = () => {
    AsyncStorage.multiRemove(["token", "user"]).then(() => {
      setUser(null);
      router.replace("/(auth)/authContainer");
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.row}>
        <Avatar uri={user?.avatar} size={44} />

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>

        <View style={styles.iconsRow}>
          {/* Notifications Icon */}
          <TouchableOpacity style={styles.bellContainer} onPress={() => setModalVisible(true)}>
            <Text style={styles.bellIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={[styles.menuText, { color: colors.accent }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <NotificationsModal
          notifications={notifications}
          markAsRead={markAsRead}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#333" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
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
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700", textAlign: "center" },
  logoutButton: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  menuText: { fontSize: 14, fontWeight: "600" },
});
