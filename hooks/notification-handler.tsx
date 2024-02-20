import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import {
  scheduleNotificationAsync,
  addNotificationResponseReceivedListener,
} from "expo-notifications";

const NotificationHandler = ({ navigation }: any) => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  const handleNotificationClick = async (response: any) => {
    const screen = response?.notification?.request?.content?.data?.screen;
    if (screen !== null) {
      // navigation.navigate(screen);
    }
  };

  const handlePushNotification = async (remoteMessage: any) => {
    const notification = {
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      data: remoteMessage.data, // optional data payload
    };

    // Schedule the notification with a null trigger to show immediately
    await scheduleNotificationAsync({
      content: notification,
      trigger: null,
    });
  };
  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(handlePushNotification);
    const unsubscribeBackground = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);
        const notification = {
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,
          data: remoteMessage.data, // optional data payload
        };

        // Schedule the notification with a null trigger to show immediately
        await scheduleNotificationAsync({
          content: notification,
          trigger: null,
        });
      }
    );

    const notificationClickSubscription =
      addNotificationResponseReceivedListener(handleNotificationClick);

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage?.data?.screen
      );
      if (remoteMessage?.data?.screen) {
        navigation.navigate(`${remoteMessage.data.screen}`);
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
          if (remoteMessage?.data?.screen) {
            navigation.navigate(`${remoteMessage.data.screen}`);
          }
        }
      });

    requestUserPermission();

    return () => {
      unsubscribeForeground();
      //@ts-ignore
      unsubscribeBackground();
      notificationClickSubscription.remove();
    };
  }, []);

  return null;
};

export default NotificationHandler;
