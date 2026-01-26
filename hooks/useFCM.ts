import messaging from "@react-native-firebase/messaging";
import api from "@/api/api";

export function useFCM() {
  const registerDevice = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      if (
        authStatus !== messaging.AuthorizationStatus.AUTHORIZED &&
        authStatus !== messaging.AuthorizationStatus.PROVISIONAL
      ) return;

      const token = await messaging().getToken();
      if (token) {
        await api.post("/auth/save-device-token", { deviceToken: token });
      }

      messaging().onTokenRefresh(async (newToken) => {
        await api.post("/auth/save-device-token", {
          deviceToken: newToken,
        });
      });
    } catch (err) {
      console.warn("FCM disabled:", err);
    }
  };

  return { registerDevice };
}
