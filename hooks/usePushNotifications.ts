import { useState, useEffect, useRef } from "react";
import {
  setNotificationHandler,
  addNotificationReceivedListener,
  setNotificationChannelAsync,
  Notification,
  getPermissionsAsync,
  requestPermissionsAsync,
  AndroidImportance,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  Subscription,
  getDevicePushTokenAsync,
  DevicePushToken,
  scheduleNotificationAsync,
} from "expo-notifications";
import Constants from "expo-constants";
import { Linking, Platform } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";

export interface PushNotificationState {
  expoPushToken?: DevicePushToken;
  notification?: Notification;
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<
    DevicePushToken | undefined
  >();

  const [notification, setNotification] = useState<Notification | undefined>();
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();
  const queryClient = useQueryClient();

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
    token = await getDevicePushTokenAsync();

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
          setExpoPushToken(token);
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
        queryClient.invalidateQueries({ queryKey: ["notificationsCount"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    );

    responseListener.current = addNotificationResponseReceivedListener(
      (response) => {
        console.log("my action", response);
        queryClient.invalidateQueries({ queryKey: ["notificationsCount"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
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
