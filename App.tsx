import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigators/root-navigator";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { setNotificationHandler } from "expo-notifications";
import { navigationRef } from "./api/api";
import { View } from "react-native";
import { I18nManager} from 'react-native';

I18nManager.allowRTL(false);

setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldShowAlert: true,
    shouldSetBadge: false,
  }),
});

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

  return (
    <>
      <NavigationContainer ref={navigationRef}>
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
