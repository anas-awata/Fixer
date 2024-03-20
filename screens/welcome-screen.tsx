import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  I18nManager,
} from "react-native";
import * as Updates from "expo-updates";

interface Props {
  navigation: any;
}

const WelcomeScreen = ({ navigation }: Props) => {
  React.useEffect(() => {
    const checkTokenAndNavigate = async () => {
      try {
        const temp = await AsyncStorage.getItem("isRTL");
        const AsyncIsRTLAndroid = JSON.parse(temp || "false");

        const isRTLAndroid =
          Platform.OS == "android" &&
          I18nManager.isRTL &&
          AsyncIsRTLAndroid != true;

        if (isRTLAndroid) {
          await AsyncStorage.setItem("isRTL", "true");
          I18nManager.forceRTL(false);
          I18nManager.allowRTL(false);
          await Updates.reloadAsync();
        }

        const token = await AsyncStorage.getItem("token");
        navigation.replace(token ? "home" : "log-in");
      } catch (error) {
        console.error("Error checking token:", error);
        // Handle error
      }
    };

    const timer = setTimeout(checkTokenAndNavigate, 1000);

    return () => clearTimeout(timer); // Clear the timer when the component is unmounted
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.contentContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/adaptive-icon.png")}
        />
        <Text style={styles.title}>Fixer</Text>
        <Text style={styles.title2}>Fix Anything Anywhere</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 200,
    width: 300,
    resizeMode: "contain",
  },
  title: {
    marginTop: 48,
    paddingVertical: 10,
    color: "#333333",
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
  },
  title2: {
    paddingVertical: 10,
    color: "#333333",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  buttonWrapper: {
    borderRadius: 8,
    backgroundColor: "#495E57",
    padding: 8,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "white",
  },
});

export default WelcomeScreen;
