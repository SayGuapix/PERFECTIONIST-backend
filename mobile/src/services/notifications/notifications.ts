import Constants from "expo-constants";
import * as Device from "expo-device";

function isExpoGo() {
  // Comentario: En Expo Go no soportamos push remoto de expo-notifications.
  return Constants.appOwnership === "expo";
}

export async function registerForPushNotificationsAsync() {
  if (isExpoGo()) return;
  if (!Device.isDevice) return;

  const Notifications = await import("expo-notifications");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const settings = await Notifications.getPermissionsAsync();
  let status = settings.status;

  if (status !== "granted") {
    const request = await Notifications.requestPermissionsAsync();
    status = request.status;
  }
}

export async function scheduleLocalReminder() {
  if (isExpoGo()) return;

  const Notifications = await import("expo-notifications");

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Perfectionist",
      body: "Revisa tus metas y movimientos de hoy.",
    },
    trigger: null,
  });
}
