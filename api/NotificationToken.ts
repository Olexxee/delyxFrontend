import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export const getDevicePushToken = async (): Promise<string | null> => {
  if (!Constants.isDevice) {
    console.warn("[Push] Must use a physical device for push notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("[Push] Push notification permission not granted");
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.error("[Push] Missing EAS projectId in app config");
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenData.data;
};