import React from "react";
import { Text, StyleSheet, View, Image, ScrollView } from "react-native";
import { Controller, ControllerProps } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";

interface PictureInputControllerProps extends Omit<ControllerProps, "render"> {
  control: any; // Type from react-hook-form
  name: string;
  label: string;
  rules?: object;
  errors: any; // Type from react-hook-form
  getValues: Function;
  setValue: Function;
}

const PictureInputController: React.FC<PictureInputControllerProps> = ({
  control,
  name,
  label,
  rules = {},
  errors,
  getValues,
  setValue,
  ...rest
}) => {
  const handlePictureSelect = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access media library is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Enable multiple selection
      quality: 1, // Set the image quality
    });

    if (pickerResult.canceled) {
      return; // User cancelled image picker
    }

    // Get the current value of the input field
    const currentPictures = getValues(name) || [];

    // Update the form state with the selected images
    setValue(name, [...currentPictures, ...pickerResult.assets]);

  
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Button onPress={handlePictureSelect} mode="outlined">
              Select Picture Attachments
            </Button>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {value && value.length > 0 ? (
                value.map((file: any, index: number) => (
                  <Image
                    source={{ uri: file.uri }}
                    style={styles.image}
                    onError={() => console.log("Image Error")}
                    key={index}
                  />
                ))
              ) : (
                <Text style={{ padding: 5 }}>No pictures selected</Text>
              )}
            </ScrollView>
          </View>
        )}
        rules={rules}
      />
      {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  error: { color: "red", textAlign: "left", width: "90%" },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    margin: 5,
    borderRadius: 5,
  },
});

export default PictureInputController;
