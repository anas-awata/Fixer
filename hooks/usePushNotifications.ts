import { useState, useEffect, useRef } from "react";
import {
  setNotificationHandler,
  addNotificationReceivedListener,
  ExpoPushToken,
  setNotificationChannelAsync,
  Notification,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  AndroidImportance,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  Subscription,
} from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
  expoPushToken?: ExpoPushToken;
  notification?: Notification;
}

export const usePushNotifications = (): PushNotificationState => {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<Notification | undefined>();

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;

    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification");
      return;
    }

    console.log("constants", Constants.easConfig?.projectId);
    token = await getExpoPushTokenAsync({
      projectId: Constants.easConfig?.projectId,
    });

    if (Platform.OS === "android") {
      setNotificationChannelAsync("default", {
        name: "default",
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          console.log("Token received:", token);
          setExpoPushToken(token);
          console.log("mytoken", token);
        } else {
          console.log("Failed to get token");
        }
      })
      .catch((error) => {
        console.error("Error getting token:", error);
      });

    notificationListener.current = addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    responseListener.current = addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      removeNotificationSubscription(notificationListener.current!);
      removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
