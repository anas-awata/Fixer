import * as React from "react";
import { Alert, Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Button, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { editProfile, register } from "../models/auth";
import TextInputController from "../components/inputs/text-input-controller";
import { useMutation } from "@tanstack/react-query";
import { postEditProfile, postRegister } from "../services/auth";
import useFormErrorHandling from "../hooks/use-form-error-handling";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import ResetPasswordModal from "../components/inputs/reset-password-modal";

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const EditProfile = ({ navigation }: Props) => {
  const { control, handleSubmit, formState, setError, reset } =
    useForm<editProfile>();
  const { errors } = formState;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const [user, setUser] = useState({});

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((user) => {
        const parsedUser = JSON.parse(user!);
        setUser(parsedUser);
        reset({ mobile: parsedUser?.mobile, full_name: parsedUser?.full_name });
      })
      .catch((error) => {
        console.error("Error retrieving user:", error);
      });
    //@ts-ignore
  }, []);

  const { mutate, isPending, error } = useMutation({
    mutationFn: postEditProfile,
    onSuccess: async (data) => {
      console.log(data);
      reset({ full_name: data.full_name, mobile: data.mobile });
      Toast.show({
        type: "success",
        text1: "Profile Edited successfully",
      });

      // Update user state
      setUser((prevUser) => ({
        ...prevUser,
        full_name: data.full_name,
        mobile: data.mobile,
      }));

      // Save updated user object to AsyncStorage
      try {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            full_name: data.full_name,
            mobile: data.mobile,
          })
        );
      } catch (error) {
        console.error("Error saving user data to AsyncStorage:", error);
      }
    },
    onError: (error: any) => {
      console.log("error", error);
      useFormErrorHandling(error, setError);
    },
  });

  const onSubmit = async (data: editProfile) => {
    try {
      //@ts-ignore
      mutate({ ...data, id: user?.id });
    } catch (error: any) {
      console.log(error);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <Text style={styles.title}> Profile Information</Text>

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
          <View style={styles.buttonWrapper}>
            <View style={{ gap: 15, width: "100%" }}>
              <Button
                color="primary"
                mode="contained"
                style={{ width: "100%" }}
                loading={isPending}
                onPress={handleSubmit(onSubmit)}
                disabled={formState.isSubmitting}
              >
                Update Profile Information
              </Button>
              <Button
                color="primary"
                mode="outlined"
                style={{ width: "100%" }}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                Reset Password
              </Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <ResetPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
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
    marginBottom: 20,
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
    width: "95%",
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

export default EditProfile;
