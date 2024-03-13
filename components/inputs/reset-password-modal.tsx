import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Text } from "react-native";
import { Button } from "react-native-paper";
import TextInputController from "./text-input-controller";
import { useForm } from "react-hook-form";
import { resetPassword } from "../../models/auth";
import { useMutation } from "@tanstack/react-query";
import { postChangePassword } from "../../services/auth";
import Toast from "react-native-toast-message";
import useFormErrorHandling from "../../hooks/use-form-error-handling";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ResetPasswordModal = ({ visible, onClose }: Props) => {
  const { control, handleSubmit, formState, setError, reset } =
    useForm<resetPassword>();
  const { errors } = formState;

  const { mutate, isPending, error } = useMutation({
    mutationFn: postChangePassword,
    onSuccess: (data) => {
      reset();
      Toast.show({
        type: "success",
        text1: "Profile Edited successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      console.log("error", error);
      useFormErrorHandling(error, setError);
    },
  });

  const onSubmit = async (data: resetPassword) => {
    try {
      mutate({ ...data, new_password1: data.new_password2 });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}> Update Your Password</Text>

          <TextInputController
            control={control}
            name="old_password"
            label="current Password"
            rules={{
              required: "Current Password is required",
            }}
            defaultValue=""
            errors={errors}
            style={styles.input}
            textContentType="password"
            secureTextEntry
          />

          <TextInputController
            control={control}
            name="new_password2"
            label="New Password"
            rules={{
              required: "New Password is required",
            }}
            defaultValue=""
            errors={errors}
            style={styles.input}
            textContentType="password"
            secureTextEntry
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
                Update Password
              </Button>
              <Button
                color="primary"
                mode="outlined"
                style={{ width: "100%" }}
                onPress={() => {
                  onClose();
                  reset();
                }}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
    width: "90%",
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
    width: "100%",
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

export default ResetPasswordModal;
