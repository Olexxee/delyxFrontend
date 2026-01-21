import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationsModalProps {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  onClose: () => void;
}

export function NotificationsModal({ notifications, markAsRead, onClose }: NotificationsModalProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>

      <ScrollView style={styles.list}>
        {notifications.length === 0 && <Text style={styles.empty}>No notifications</Text>}
        {notifications.map((n) => (
          <TouchableOpacity
            key={n._id}
            style={[styles.notification, n.read ? styles.read : styles.unread]}
            onPress={() => markAsRead(n._id)}
          >
            <Text style={styles.title}>{n.title}</Text>
            <Text style={styles.message}>{n.message}</Text>
            <Text style={styles.date}>{new Date(n.createdAt).toLocaleString()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#fff" },
  closeButton: { padding: 12, alignItems: "flex-end" },
  closeText: { fontSize: 16, color: "#007AFF", fontWeight: "600" },
  list: { paddingHorizontal: 16 },
  notification: { padding: 12, marginVertical: 4, borderRadius: 10, borderWidth: 1 },
  unread: { backgroundColor: "#e6f7ff", borderColor: "#4da6ff" },
  read: { backgroundColor: "#f0f0f0", borderColor: "#ccc" },
  title: { fontWeight: "700", fontSize: 16 },
  message: { fontSize: 14, marginTop: 2 },
  date: { fontSize: 12, color: "#888", marginTop: 4 },
  empty: { textAlign: "center", marginTop: 20, fontStyle: "italic" },
});
