import { useRegisterPushToken } from "@/api/Useregisterpushtoken";
import { UserContext } from "@/authContext/UserContext";
import { Avatar } from "@/components/ui/Avatar";
import { NotificationsModal } from "@/components/ui/NotificationModal";
import { useNotifications } from "@/hooks/useNotifications";
import { useTheme } from "@/theme/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Bell } from "lucide-react-native";
import { useContext, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function AppScreenHeader({ title, subtitle, onBack }: ScreenHeaderProps) {
  const { colors } = useTheme();
  const { user, setUser } = useContext(UserContext);

  const userId = (user as any)?._id ?? (user as any)?.id ?? null;

  // ─── Register device token when user is available ─────────────────────────
  useRegisterPushToken(userId);

  // ─── Notifications ────────────────────────────────────────────────────────
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications(!!user);

  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleLogout = () => {
    AsyncStorage.multiRemove(["token", "user"]).then(() => {
      setUser(null);
      router.replace("/(auth)/authContainer");
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.row}>
        <Avatar uri={(user as any)?.avatar} size={44} />

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.iconsRow}>
          {/* Bell icon */}
          <TouchableOpacity style={styles.bellContainer} onPress={handleOpenModal}>
            <Bell size={24} color={colors.textPrimary} />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? "99+" : String(unreadCount)}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={[styles.menuText, { color: colors.accent }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <NotificationsModal
          notifications={notifications}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
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
  menuText: { fontSize: 14, fontWeight: "600" },
});