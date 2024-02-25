import * as React from "react";
import { Alert, Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Button, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { logIn } from "../models/auth";
import TextInputController from "../components/inputs/text-input-controller";
import { fetchApi } from "../api/api";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const LogIn = ({ navigation }: Props) => {
  const { control, handleSubmit, formState, setError, reset, getValues } =
    useForm<logIn>();
  const { errors } = formState;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const [deviceToken, setDeviceToken] = useState("");
  AsyncStorage.getItem("deviceToken")
    .then((token) => {
      setDeviceToken(JSON.parse(token!));
    })
    .catch((error) => {
      console.error("Error retrieving user:", error);
    });

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data: {
      email: string;
      id: number;
      token: string;
      is_staff: boolean;
      username: string;
    }) => {
      console.log(data);
      AsyncStorage.setItem("token", data?.token);
      AsyncStorage.setItem("user", JSON.stringify({ ...data }));
      reset();
      navigation.navigate("home");
    },
    onError: (error: any) => {
      if (error.response.status == 403) {
        navigation.reset({
          index: 0,
          routes: [
            { name: "verify-account", params: { email: getValues("email") } },
          ],
        });
      }
      if (error.response && error.response.status === 400) {
        setError("email", {
          type: "manual",
          message: error?.response?.data.error,
        });
      }
    },
  });

  const onSubmit = async (data: logIn) => {
    console.log("deviceToken", deviceToken);
    try {
      await mutate({ ...data, device_reg_id: deviceToken });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/fixer_logo.png")}
        />

        <TextInputController
          control={control}
          name="email"
          label="Email"
          rules={{
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
          }}
          defaultValue=""
          errors={errors}
          style={styles.input}
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <TextInputController
          control={control}
          name="password"
          label="Password"
          rules={{
            required: "Password is required",
          }}
          defaultValue=""
          errors={errors}
          style={styles.input}
          textContentType="password"
          secureTextEntry={true}
        />
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={formState.isSubmitting || !!errors.email}
          style={[styles.buttonWrapper]}
        >
          <View style={{ width: "100%" }}>
            <Button
              color="primary"
              mode="contained"
              style={[{ width: "100%" }, !!errors.email && styles.disabled]}
              loading={isPending}
            >
              Login
            </Button>
          </View>
        </Pressable>
        <View style={styles.rowFlex}>
          <Text>don't have an acount ?</Text>
          <Button mode="text" onPress={() => navigation.navigate("register")}>
            SignUp
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#333333",
    textAlign: "center",
    fontSize: 20,
  },
  logo: {
    height: 200,
    width: 300,
    resizeMode: "contain",
    marginBottom: 32,
  },
  input: {
    width: "90%",
    marginVertical: 10,
  },
  buttonWrapper: {
    borderRadius: 8,
    padding: 8,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  disabled: {
    backgroundColor: "grey",
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  rowFlex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  error: { color: "red", textAlign: "left", width: "90%" },
});

export default LogIn;
