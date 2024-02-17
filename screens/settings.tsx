import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Snackbar, Title } from "react-native-paper";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const Settings = ({ navigation }: Props) => {
  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);
  const { mutate, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log(data);
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
      navigation.navigate("log-in");
    },
    onError: (error) => {
      console.log(error);
      onToggleSnackBar();
    },
  });
  const handleEditProfilePress = () => {
    // Navigate to the edit profile screen
    navigation.navigate("EditProfile");
  };

  const handleLogoutPress = () => {
    mutate();
  };

  const handleServiceHistoryPress = () => {
    navigation.navigate("service-history", { name: "service history" });
  };

  return (
    <View style={styles.container}>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Close",
          onPress: () => {
            // Do something
          },
        }}
      >
        Something went wrong, please try again later.
      </Snackbar>
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleServiceHistoryPress}
          style={styles.button}
        >
          Services History
        </Button>
        <Button
          mode="outlined"
          onPress={handleEditProfilePress}
          style={styles.button}
        >
          Edit Profile
        </Button>
        <Button
          mode="contained"
          onPress={handleLogoutPress}
          style={styles.button}
          loading={isPending}
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  button: {
    marginBottom: 12,
    paddingVertical: 10,
  },
});

export default Settings;
