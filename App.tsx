import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigators/root-navigator";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { usePushNotifications } from "./hooks/usePushNotifications";
import NotificationHandler from "./hooks/notification-handler";
import { Text } from "react-native";

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
  const { expoPushToken } = usePushNotifications();
  console.log("expotoke", expoPushToken?.data);

  //eas build --profile production --platform android

  return (
    <>
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <RootNavigator />
            <Toast />
          </PaperProvider>
        </QueryClientProvider>
      </NavigationContainer>
    </>
  );
}
