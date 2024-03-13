import * as React from "react";
import { Alert, Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Button, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { register } from "../models/auth";
import TextInputController from "../components/inputs/text-input-controller";
import { useMutation } from "@tanstack/react-query";
import { postRegister } from "../services/auth";
import useFormErrorHandling from "../hooks/use-form-error-handling";
import Toast from "react-native-toast-message";

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const Register = ({ navigation }: Props) => {
  const { control, handleSubmit, formState, setError, reset } =
    useForm<register>();
  const { errors } = formState;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: postRegister,
    onSuccess: (data: {
      email: string;
      id: number;
      token: string;
      is_staff: boolean;
      username: string;
    }) => {
      // AsyncStorage.setItem("token", data?.token);
      // AsyncStorage.setItem("user", JSON.stringify({ ...data }));
      reset();
      Toast.show({
        type: "success",
        text1: "Registered successfully",
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "verify-account", params: { email: data.email } }],
      });
    },
    onError: (error: any) => {
      console.log("error", error);
      useFormErrorHandling(error, setError);
    },
  });

  const onSubmit = async (data: register) => {
    try {
      await mutate(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}> Enter your Information</Text>

        <TextInputController
          control={control}
          name="full_name"
          label="Full Name"
          rules={{
            required: "Name is required",
          }}
          defaultValue=""
          errors={errors}
          style={styles.input}
        />

        <TextInputController
          control={control}
          name="mobile"
          label="Phone Number"
          rules={{
            required: "phone Number is required",
          }}
          defaultValue=""
          errors={errors}
          style={styles.input}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
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
          secureTextEntry
        />
        <TextInputController
          control={control}
          name="confirm_password"
          label="confirm password"
          rules={{
            required: "Password confirmation is required",
          }}
          defaultValue=""
          errors={errors}
          style={styles.input}
          textContentType="password"
          secureTextEntry
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
              Register
            </Button>
          </View>
        </Pressable>
        <View style={styles.rowFlex}>
          <Text>already have an account ?</Text>
          <Button mode="text" onPress={() => navigation.navigate("log-in")}>
            Login
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
    textAlign: "left",
    fontSize: 20,
    width: "90%",
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

export default Register;
