import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigators/root-navigator";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
  TextInput,
} from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { usePushNotifications } from "./hooks/usePushNotifications";
import NotificationHandler from "./hooks/notification-handler";
import { Text } from "react-native";
import { firebase } from "@react-native-firebase/messaging";

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

  // const getFcmToken = async () => {
  //   const def = firebase.messaging();
  //   try {
  //     const token = await def.getToken();
  //     console.log("fcm");
  //     console.log("fcm token", token);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // getFcmToken();
    // {
      //   "icon": "./local/assets/notification-icon.png",
      //   "color": "#ffffff",
      //   "sounds": [
      //     "./local/assets/notification-sound.wav",
      //     "./local/assets/notification-sound-other.wav"
      //   ]
      // }

  return (
    <>
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <TextInput value={expoPushToken?.data} />
            <RootNavigator />
            <Toast />
          </PaperProvider>
        </QueryClientProvider>
      </NavigationContainer>
    </>
  );
}
