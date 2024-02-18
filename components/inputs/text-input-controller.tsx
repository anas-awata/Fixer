import React from "react";
import { Text, StyleSheet } from "react-native";
import { Controller, ControllerProps } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native-paper";

interface TextInputControllerProps
  extends Omit<ControllerProps, "render">,
    TextInputProps {
  control: any; // Type from react-hook-form
  name: string;
  label: string;
  rules?: object;
  defaultValue?: string;
  errors: any; // Type from react-hook-form
}

const TextInputController: React.FC<TextInputControllerProps> = ({
  control,
  name,
  label,
  rules = {},
  defaultValue = "",
  errors,
  ...rest
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            label={label}
            mode="outlined"
            error={errors[name] ? true : false}
            {...rest}
          />
        )}
        rules={rules}
        defaultValue={defaultValue}
      />
      {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    marginBottom: 16,
  },
  error: { color: "red", textAlign: "left", width: "90%" },
});

export default TextInputController;
