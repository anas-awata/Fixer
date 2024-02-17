import { NavigationContainer } from "@react-navigation/native";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import BottomNavigator from "../navigators/bottom-navigatior";

export default function Home() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "blue",
      accent: "yellow",
    },
  };
  return (
    <>
      <PaperProvider theme={theme}>
        <BottomNavigator />
      </PaperProvider>
    </>
  );
}
