import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Card, Title, Paragraph } from "react-native-paper";
import { serviceRequest, serviceResponse } from "../models/service";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AddClientService, fetchServicesById } from "../services/service";
import TextInputController from "../components/inputs/text-input-controller";
import { useForm } from "react-hook-form";
import LocationPickerModal from "../components/inputs/location-picker-modal";
import useReverseGeocoding from "../hooks/use-reverce-geocoding";
import SelectController from "../components/inputs/select-controller";
import SelectInputController from "../components/inputs/select-controller";
import Toast from "react-native-toast-message";
import PictureInputController from "../components/inputs/picture-input-controller";

type Props = {
  route: any;
  navigation: any;
};

const sizeOptions = [
  { label: "Small (Up to 100 sqm)", value: "Small" },
  { label: "Medium (100-200 sqm)", value: "Medium" },
  { label: "Large (200-350 sqm)", value: "Large" },
  { label: "Extra Large (more than 300 sqm)", value: "Extra Large" },
];

const ServicePage = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const { data, status } = useQuery({
    queryKey: ["get-service", id],
    queryFn: () => fetchServicesById(id),
  });
  const queryClient = useQueryClient();
  const {
    mutate: AddService,
    isPending,
    error,
  } = useMutation({
    mutationFn: AddClientService,
    onSuccess: (data: {
      email: string;
      id: number;
      token: string;
      is_staff: boolean;
      username: string;
    }) => {
      console.log(data);

      reset();
      navigation.navigate("home");
      queryClient.invalidateQueries({
        queryKey: ["get-user-services-in-progress"],
      });
      Toast.show({
        type: "success",
        text1: "Service Added successfully",
      });
    },
    onError: (error: any) => {
      // if (error.response && error.response.status === 400) {
      //   setError("email", {
      //     type: "manual",
      //     message: error?.response?.data.error,
      //   });
      // }
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something went wrong please try again later",
      });
    },
  });

  const {
    control,
    handleSubmit,
    formState,
    setError,
    reset,
    setValue,
    getValues,
  } = useForm<serviceRequest>();
  const { errors } = formState;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  //location modal logic
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const locationName = useReverseGeocoding(
    selectedLocation ? selectedLocation : null
  );

  const onSubmit = (submittedData: serviceRequest) => {
    console.log("pictures", submittedData.pictures);
    const ticketData = {
      ...submittedData,
      location: selectedLocation,
      service: data?.id!,
    };
    console.log("ticket", ticketData);
    AddService(ticketData);
  };

  if (status === "pending") {
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
  }

  if (status === "error") {
    return <Text>Error fetching service data</Text>;
  }

  if (!data) {
    return null;
  }

  const { title, description, initial_price, picture, type } = data;

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ImageBackground source={{ uri: picture }} style={styles.header}>
          <View style={styles.headerContent}>
            <Title style={styles.title}>{title}</Title>
            <Paragraph style={{ fontSize: 14, color: "#fff" }}>
              {description}
            </Paragraph>
            <Paragraph
              style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}
            >
              Price: ${initial_price}
            </Paragraph>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        style={{ flex: 1 }} // Ensure the KeyboardAvoidingView fills the entire screen
        behavior={Platform.OS === "ios" ? "padding" : undefined} // Adjust behavior based on platform
      >
        <Card style={styles.card}>
          <ScrollView
            style={{ height: "100%" }} // Set the height to fill the parent container
            contentContainerStyle={{
              paddingVertical: 20,
              paddingHorizontal: 10,
            }}
          >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <Card.Content style={{ display: "flex", gap: 10 }}>
                <Paragraph style={{ fontSize: 16, color: "blue" }}>
                  Enter order information
                </Paragraph>
                {type == "Fixing" && (
                  <TextInputController
                    control={control}
                    name="info_fields[device_type]"
                    label="Device Type"
                    placeholder="Enter Your device type"
                    rules={{
                      required: "Device Type is required",
                    }}
                    defaultValue=""
                    errors={errors}
                    style={styles.input}
                  />
                )}
                {type == "Setting" && (
                  <SelectInputController
                    control={control}
                    name="info_fields[company_size]"
                    label="Select Your Place Size"
                    items={sizeOptions}
                    rules={{ required: "Please select an option" }}
                    errors={errors}
                  />
                )}
                <TextInputController
                  control={control}
                  name="description"
                  label="Description"
                  placeholder="Enter description"
                  rules={{
                    required: "Description is required",
                  }}
                  defaultValue=""
                  errors={errors}
                  style={styles.input}
                  multiline
                  numberOfLines={3}
                />
                {/* <PictureInputController
                  control={control}
                  name="pictures"
                  label="pictures"
                  errors={errors}
                  setValue={setValue}
                  getValues={getValues}
                /> */}
                <View style={{}}>
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
                  <View style={{ width: "100%", marginTop: 10 }}>
                    {selectedLocation && <Text>{locationName || ""}</Text>}
                  </View>
                </View>
                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  disabled={formState.isSubmitting || isPending}
                  loading={isPending}
                >
                  Order Service
                </Button>
              </Card.Content>
            </TouchableWithoutFeedback>
          </ScrollView>
        </Card>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 300, // Adjust the height as needed
    justifyContent: "flex-end",
    padding: 20,
  },
  headerContent: {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background for text
    padding: 15,
    borderRadius: 10,
    display: "flex",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  card: {
    margin: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 5,
    backgroundColor: "transparent",
  },
});

export default ServicePage;

// const onSubmit = async (submittedData: serviceRequest) => {
//   try {
//     const { pictures, location, ...rest } = submittedData;

//     // Create FormData object
//     const formData = new FormData();
//     formData.append("service", id);

//     // Append location data to FormData if it exists
//     if (selectedLocation !== null) {
//       formData.append("location", JSON.stringify(selectedLocation));
//     }

//     // Append non-file data to FormData
//     Object.entries(rest).forEach(([key, value]) => {
//       if (
//         key === "info_fields" &&
//         typeof value === "object" &&
//         value !== null
//       ) {
//         // Append other info_fields data if present
//         Object.entries(value).forEach(([fieldKey, fieldValue]) => {
//           formData.append(`info_fields.${fieldKey}`, fieldValue.toString());
//         });
//       } else {
//         formData.append(key, value.toString());
//       }
//     });
//     // Convert image URIs to Blob objects and append to FormData
//     await Promise.all(
//       pictures.map(async (picture, index) => {
//         const response = await fetch(picture.uri);
//         console.log("pic", response);
//         const blob = await response.blob();
//         formData.append(`picture[${index}]`, blob, `picture_${index}.jpg`);
//       })
//     );

//     // Send FormData to backend using React Query mutation
//     // console.log(formData);
//     AddService(formData);
//   } catch (error) {
//     console.error("Error submitting service request:", error);
//   }
// };

// const onSubmit = (submittedData: serviceRequest) => {
//   console.log("pictures", submittedData.pictures);
//   const ticketData = {
//     ...submittedData,
//     location: selectedLocation,
//     service: data?.id!,
//   };
//   console.log("ticket", ticketData);
//   AddService(ticketData);
// };
