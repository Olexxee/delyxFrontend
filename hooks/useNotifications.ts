import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/api";
import { useSocket } from "../api/socketRegistry";

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type?: string;
}

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications(enabled: boolean) {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );

  // ─── Fetch from backend ───────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      const data: AppNotification[] = res.data;
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("[Notifications] Fetch failed:", err);
    }
  }, []);

  // ─── Initial fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    fetchNotifications();
  }, [enabled, fetchNotifications]);

  // ─── Socket: in-app real-time ─────────────────────────────────────────────
  useEffect(() => {
    if (!enabled || !socket) return;

    const handleIncoming = (
      data: Omit<AppNotification, "_id"> & { _id?: string },
    ) => {
      const incoming: AppNotification = {
        _id: data._id ?? Date.now().toString(),
        title: data.title,
        message: data.message,
        createdAt: data.createdAt ?? new Date().toISOString(),
        read: false,
        type: data.type,
      };

      setNotifications((prev) => [incoming, ...prev]);
      setUnreadCount((c) => c + 1);
    };

    socket.on("notification:new", handleIncoming);
    return () => {
      socket.off("notification:new", handleIncoming);
    };
  }, [enabled, socket]);

  // ─── Expo: foreground push listener ──────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const { title, body } = notification.request.content;
        const incoming: AppNotification = {
          _id: notification.request.identifier,
          title: title ?? "New Notification",
          message: body ?? "",
          createdAt: new Date().toISOString(),
          read: false,
        };

        setNotifications((prev) => [incoming, ...prev]);
        setUnreadCount((c) => c + 1);
      });

    return () => {
      notificationListener.current?.remove();
    };
  }, [enabled]);

  // ─── Actions ──────────────────────────────────────────────────────────────
  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((c) => Math.max(c - 1, 0)); // ✅ never goes negative
    } catch (err) {
      console.error("[Notifications] Mark as read failed:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("[Notifications] Mark all as read failed:", err);
    }
  }, []);

  const refresh = useCallback(() => {
    if (enabled) fetchNotifications();
  }, [enabled, fetchNotifications]);

  return { notifications, unreadCount, markAsRead, markAllAsRead, refresh };
}
