import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigators/root-navigator";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { usePushNotifications } from "./hooks/usePushNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { setNotificationHandler } from "expo-notifications";

export default function App() {
  const queryClient = new QueryClient();
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "blue",
      secondary: "yellow",
    },
  };
  const { expoPushToken, notification } = usePushNotifications();
  // console.log("expotoke", expoPushToken?.data);

  AsyncStorage.setItem("deviceToken", JSON.stringify(expoPushToken?.data));
  //eas build --profile production --platform android

  useEffect(() => {
    console.log("notification", notification);
    setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldShowAlert: true,
        shouldSetBadge: true,
      }),
    });
  }, [notification]);

  return (
    <>
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            {/* <TextInput value={expoPushToken?.data} /> */}
            <RootNavigator />
            <Toast />
          </PaperProvider>
        </QueryClientProvider>
      </NavigationContainer>
    </>
  );
}
