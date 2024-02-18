import * as React from "react";
import { Alert, Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Button, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import MapView, { Marker } from "react-native-maps";
import LocationPickerModal from "../components/inputs/location-picker-modal";
import { useState } from "react";
import useReverseGeocoding from "../hooks/use-reverce-geocoding";
import TextInputController from "../components/inputs/text-input-controller";

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const AddNewTicket = ({ navigation }: Props) => {
  const { control, handleSubmit, formState } = useForm<ticketRequest>();
  const { errors } = formState;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const onSubmit = (data: ticketRequest) => {
    const ticketData = { ...data, location: selectedLocation };
    console.log(ticketData);
  };

  const locationName = useReverseGeocoding(
    selectedLocation ? selectedLocation : null
  );

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}> Enter Ticket Information</Text>

        <TextInputController
          control={control}
          name="title"
          label="title"
          rules={{
            required: "title is required",
          }}
          defaultValue=""
          errors={errors}
          style={styles.input}
        />

        <TextInputController
          control={control}
          name="description"
          label="description"
          rules={{
            required: "description is required",
          }}
          defaultValue=""
          errors={errors}
          style={styles.input}
        />

        <TextInputController
          control={control}
          name="contact_info"
          label="Phone Number"
          rules={{
            required: "Phone number is required",
          }}
          defaultValue=""
          errors={errors}
          style={styles.input}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
        />

        <View style={styles.input}>
          <Button
            mode="outlined"
            onPress={toggleModal}
            style={{ width: "100%" }}
          >
            <Text>Select Location</Text>
          </Button>
          <LocationPickerModal
            visible={isModalVisible}
            onClose={toggleModal}
            onLocationSelect={setSelectedLocation}
          />
          <View style={styles.input}>
            {selectedLocation && <Text>{locationName || ""}</Text>}
          </View>
        </View>

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={formState.isSubmitting}
          style={[styles.buttonWrapper]}
        >
          <View style={{ width: "100%" }}>
            <Button
              color="primary"
              mode="contained"
              style={[{ width: "100%" }]}
            >
              Add Ticket
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
  mapContainer: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
});

export default AddNewTicket;
