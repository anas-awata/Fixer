import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Controller, ControllerProps } from "react-hook-form";
import { TextInput, TextInputProps, Button } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";

interface SelectInputControllerProps
  extends Omit<ControllerProps, "render">,
    Omit<TextInputProps, "value" | "onChangeText" | "label"> {
  control: any; // Type from react-hook-form
  name: string;
  label: string;
  rules?: object;
  defaultValue?: string;
  errors: any; // Type from react-hook-form
  items: { label: string; value: string }[];
}

const SelectInputController: React.FC<SelectInputControllerProps> = ({
  control,
  name,
  label,
  rules = {},
  defaultValue = "",
  errors,
  items,
  ...rest
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <SelectDropdown
              data={items}
              onSelect={(selectedItem, index) => {
                onChange(selectedItem.value); // update the form value here
              }}
              //   renderDropdownIcon={isOpened => {
              //     return <FontAwesome
              //       name={isOpened ? 'chevron-up' : 'chevron-down'}
              //       color={theme.colors.azul}
              //       size={12}
              //     />;
              //   }}
              renderCustomizedRowChild={(item, index) => {
                return (
                  <View style={{ marginLeft: 10 }}>
                    <Text>{item?.label}</Text>
                  </View>
                );
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              defaultButtonText={label}
              buttonStyle={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 4,
                borderWidth: 1,
                borderColor: "#666",
                padding: 10,
              }}
              buttonTextStyle={{
                color: "#222",
                textAlign: "left",
                fontSize: 18,
              }}
            />
          </>
        )}
        rules={rules}
        defaultValue={defaultValue}
      />
      {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  error: { color: "red", textAlign: "left", width: "90%" },
});

export default SelectInputController;
