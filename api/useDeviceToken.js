import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import api from "./api";

const useDeviceToken = () => {
  useEffect(() => {
    const registerToken = async () => {
      try {
        // Request notification permission (iOS)
        const authStatus = await messaging().requestPermission();
        if (
          authStatus !== messaging.AuthorizationStatus.AUTHORIZED &&
          authStatus !== messaging.AuthorizationStatus.PROVISIONAL
        ) return;

        // Get FCM token
        const fcmToken = await messaging().getToken();
        if (!fcmToken) return;

        // Save token to backend
        await api.post("/auth/save-device-token", { deviceToken: fcmToken });
      } catch (err) {
        console.error("Failed to register device token:", err);
      }
    };

    registerToken();

    // Listen for token refresh and save the new token
    const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
      try {
        await api.post("/auth/save-device-token", { deviceToken: newToken });
      } catch (err) {
        console.error("Failed to save refreshed device token:", err);
      }
    });

    return unsubscribe;
  }, []);
};

export const listenToTokenRefresh = () => {
  return messaging().onTokenRefresh(async (newToken) => {
    try {
      await api.post("/auth/save-device-token", { deviceToken: newToken });
      console.log("Device token refreshed:", newToken);
    } catch (err) {
      console.error("Failed to refresh device token:", err);
    }
  });
};

export default useDeviceToken;
