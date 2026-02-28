import { useEffect } from "react";
import api from "./api";
import { getDevicePushToken } from "./NotificationToken";

export function useRegisterPushToken(userId: string | null | undefined) {
  useEffect(() => {
    if (!userId) return;

    const register = async () => {
      try {
        const token = await getDevicePushToken();
        if (!token) return;

        await api.post("/auth/save-device-token", { token });
        console.log("[Push] Device token registered:", token);
      } catch (err) {
        console.error("[Push] Failed to register device token:", err);
      }
    };

    register();
  }, [userId]);
}
