import * as React from "react";
import { Alert, Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Button, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { Activate, logIn } from "../models/auth";
import TextInputController from "../components/inputs/text-input-controller";
import { fetchApi } from "../api/api";
import { useMutation } from "@tanstack/react-query";
import { AccountVerification, login } from "../services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface Props {
  navigation: NavigationProp<ParamListBase>;
  route: any;
}

const VerifyAccount = ({ navigation, route }: Props) => {
  const { email } = route.params;
  const { control, handleSubmit, formState, setError, reset } =
    useForm<Activate>();
  const { errors } = formState;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: AccountVerification,
    onSuccess: (data: {
      email: string;
      id: number;
      token: string;
      is_staff: boolean;
      username: string;
    }) => {
      console.log(data);
      Toast.show({
        type: "success",
        text1: "Account Verified Successfully",
      });
      AsyncStorage.setItem("token", data?.token);
      AsyncStorage.setItem("user", JSON.stringify({ ...data }));
      reset();
      navigation.navigate("home");
    },
    onError: (error: any) => {
      if (
        error.response &&
        (error.response.status == 400 || error.response.status == 422)
      ) {
        setError("code", {
          type: "manual",
          message: error?.response?.data.error,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Something Wrong Happend,try again later",
        });
      }
    },
  });

  const onSubmit = async (data: Activate) => {
    console.log("mydata", { ...data, email: email });
    try {
      await mutate({ ...data, email: email });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/verify.png")} />
        <Text>Activation Code has been sent to Email</Text>
        <TextInputController
          control={control}
          name="email"
          value={email}
          label="Email"
          defaultValue=""
          errors={errors}
          style={styles.input}
          keyboardType="email-address"
          textContentType="emailAddress"
          disabled
        />

        <TextInputController
          control={control}
          name="code"
          label="Activation code"
          keyboardType="number-pad"
          rules={{
            required: "Activation Code is required",
          }}
          defaultValue=""
          errors={errors}
          style={styles.input}
        />
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={formState.isSubmitting}
          style={[styles.buttonWrapper]}
        >
          <View style={{ width: "100%" }}>
            <Button
              color="primary"
              mode="contained"
              style={[{ width: "100%" }, !!errors.email && styles.disabled]}
              loading={isPending}
            >
              Verify Account
            </Button>
          </View>
        </Pressable>
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

export default VerifyAccount;
