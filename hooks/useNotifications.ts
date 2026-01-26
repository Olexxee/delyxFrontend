// hooks/useNotifications.ts
import { useEffect, useState } from "react";
import messaging from "@react-native-firebase/messaging";
import api from "@/api/api";

export function useNotifications(enabled: boolean) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    api.get("/notifications").then((res) => {
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: any) => !n.read).length);
    });

    const unsubscribe = messaging().onMessage((msg) => {
      if (!msg.notification) return;

      const incoming = {
        _id: msg.messageId,
        title: msg.notification.title,
        message: msg.notification.body,
        createdAt: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [incoming, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    return unsubscribe;
  }, [enabled]);

  const markAsRead = async (id: string) => {
    await api.post(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(c - 1, 0));
  };

  return { notifications, unreadCount, markAsRead };
}
