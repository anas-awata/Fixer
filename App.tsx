import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigators/root-navigator";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

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
