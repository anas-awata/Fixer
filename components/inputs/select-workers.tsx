import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Controller, ControllerProps } from "react-hook-form";
import { Button } from "react-native-paper";
import MultiSelect from "react-native-multiple-select";
import { serviceWorker } from "../../models/service";

interface SelectInputControllerProps extends Omit<ControllerProps, "render"> {
  control: any; // Type from react-hook-form
  name: string;
  label: string;
  rules?: object;
  defaultValue?: string[];
  errors: any; // Type from react-hook-form
  items: serviceWorker[];
}

const SelectWorkers: React.FC<SelectInputControllerProps> = ({
  control,
  name,
  label,
  rules = {},
  defaultValue = [],
  errors,
  items,
}) => {
  // Transform items for MultiSelect component
  const transformedItems = items.map((item) => ({
    id: item.id.toString(),
    name: `${item.user.full_name}-${item.department.slice(0, 15)}`, // Show name and department
  }));

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <View style={styles.container}>
              <MultiSelect
                items={transformedItems}
                uniqueKey="id"
                onSelectedItemsChange={(selectedIds: string[]) => {
                  onChange(selectedIds); // update the form value here
                }}
                selectedItems={value}
                selectText={label}
                searchInputPlaceholderText="Search items..."
                tagBorderColor="#666" // Border color
                tagTextColor="#666" // Text color
                selectedItemTextColor="#666" // Selected item text color
                itemTextColor="#000" // Item text color
                displayKey="name"
                searchInputStyle={{ color: "#666" }} // Search input text color
                submitButtonColor="#007AFF" // Submit button color
                submitButtonText="Done"
              />
            </View>
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
  container: {
    borderColor: "#666",
    borderWidth: 1,
    borderRadius: 4,
    padding: 5, // Adjust padding as needed
  },
  error: { color: "red", textAlign: "left", width: "90%" },
});

export default SelectWorkers;
