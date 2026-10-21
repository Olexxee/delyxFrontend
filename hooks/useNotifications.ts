import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/api/api";

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type?: string;
}

type BackendNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  readAt?: string | null;
  type?: string;
};

type NotificationsResponse = {
  notifications?: BackendNotification[];
  unreadCount?: number;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const normalizeNotification = (item: BackendNotification): AppNotification => ({
  _id: item.id,
  title: item.title,
  message: item.body,
  createdAt: item.createdAt,
  read: Boolean(item.readAt),
  type: item.type,
});

export function useNotifications(enabled: boolean) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; data: NotificationsResponse }>("/api/notifications");
      const payload = res.data.data;
      const items = (payload.notifications ?? []).map(normalizeNotification);
      setNotifications(items);
      setUnreadCount(payload.unreadCount ?? items.filter((item) => !item.read).length);
    } catch (err) {
      console.error("[Notifications] Fetch failed:", err);
    }
  }, []);

  useEffect(() => {
    if (enabled) void fetchNotifications();
  }, [enabled, fetchNotifications]);

  // The current backend WebSocket protocol only emits chat events; push notifications
  // are delivered through Expo, while the in-app list is fetched from the REST API.
  useEffect(() => {
    if (!enabled) return;
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      const incoming: AppNotification = {
        _id: notification.request.identifier,
        title: title ?? "New Notification",
        message: body ?? "",
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [incoming, ...prev.filter((item) => item._id !== incoming._id)]);
      setUnreadCount((count) => count + 1);
    });
    return () => notificationListener.current?.remove();
  }, [enabled]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.post(`/api/notifications/${encodeURIComponent(id)}/read`);
      setNotifications((prev) => prev.map((item) => item._id === id ? { ...item, read: true } : item));
      setUnreadCount((count) => Math.max(count - 1, 0));
    } catch (err) {
      console.error("[Notifications] Mark as read failed:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.post("/api/notifications/read-all");
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("[Notifications] Mark all as read failed:", err);
    }
  }, []);

  const refresh = useCallback(() => {
    if (enabled) void fetchNotifications();
  }, [enabled, fetchNotifications]);

  return { notifications, unreadCount, markAsRead, markAllAsRead, refresh };
}
