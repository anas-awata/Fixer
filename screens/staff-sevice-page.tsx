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
import { assignTicketRequest } from "../models/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AssignTicket,
  fetchServiceWorkersById,
  fetchStaffServicesById,
} from "../services/service";
import TextInputController from "../components/inputs/text-input-controller";
import { useForm } from "react-hook-form";
import useReverseGeocoding from "../hooks/use-reverce-geocoding";
import Toast from "react-native-toast-message";
import MapView, { Marker } from "react-native-maps";
import useFormErrorHandling from "../hooks/use-form-error-handling";
import SelectWorkers from "../components/inputs/select-workers";

type Props = {
  route: any;
  navigation: any;
};

const StaffServicePage = ({ route, navigation }: Props) => {
  const { id, serviceId } = route.params;
  const { data, status } = useQuery({
    queryKey: ["get-staff-service", id],
    queryFn: () => fetchStaffServicesById(id),
  });

  const { data: workers, status: workersStatus } = useQuery({
    queryKey: ["get-service-workers", serviceId],
    queryFn: () => fetchServiceWorkersById(serviceId),
  });
  const queryClient = useQueryClient();
  const {
    mutate: submitForm,
    isPending,
    error,
  } = useMutation({
    mutationFn: AssignTicket,
    onSuccess: (data) => {
      console.log(data);
      reset();
      navigation.navigate("home");
      queryClient.invalidateQueries({
        queryKey: ["get-staff-services"],
      });
      Toast.show({
        type: "success",
        text1: "Service Assigned successfully",
      });
    },
    onError: (error: any) => {
      console.log(error);
      if (error.response && error.response.status === 400) {
        useFormErrorHandling(error, setError);
      } else {
        Toast.show({
          type: "error",
          text1: "Something went wrong please try again later",
        });
      }
    },
  });

  const { control, handleSubmit, formState, setError, reset, watch } =
    useForm<assignTicketRequest>();
  const { errors } = formState;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  //get location name
  const locationName = useReverseGeocoding(
    data?.location ? data.location : null
  );

  const onSubmit = (submittedData: assignTicketRequest) => {
    const ticketData = {
      ...submittedData,
      id: data?.id!,
    };
    console.log("ticket", ticketData);
    submitForm(ticketData);
  };

  if (status === "pending" || workersStatus === "pending") {
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
  }

  if (status === "error" || workersStatus === "error") {
    return <Text>Error fetching service data</Text>;
  }

  if (!data || !workers) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: data.service.picture }}
          style={styles.header}
        >
          <ScrollView style={styles.headerContent}>
            <Title style={styles.title}>{data.service.title} Order</Title>
            <Paragraph style={styles.text}>order id : {data.id}</Paragraph>
            <Paragraph style={styles.text}>
              client description : {data.description}
            </Paragraph>
            <Paragraph style={styles.text}>Client: {data.full_name}</Paragraph>
            <Paragraph style={styles.text}>
              phone number: {data.mobile}
            </Paragraph>
            {data.service.type == "Fixing" && (
              <Paragraph style={styles.text}>
                Device Type {data.info_fields?.device_type}
              </Paragraph>
            )}
            {data.service.type == "Setting" && (
              <Paragraph style={styles.text}>
                Company size : {data.info_fields?.company_size}
              </Paragraph>
            )}
            <Paragraph style={styles.text}>
              initial Price: ${data.service.initial_price}
            </Paragraph>
          </ScrollView>
        </ImageBackground>
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
              <Card.Content style={{ display: "flex", gap: 10 }}>
                <View style={{ width: 320, height: 200 }}>
                  <Paragraph style={{ fontSize: 14, color: "blue" }}>
                    Order Location
                  </Paragraph>
                  <Text>
                    {
                      //@ts-ignore
                      locationName?.slice(0, 75)
                    }
                    ..
                  </Text>
                  {data.location?.latitude && data.location?.longitude ? (
                    <MapView
                      style={{ flex: 1 }}
                      initialRegion={{
                        latitude: data.location.latitude,
                        longitude: data.location.longitude,
                        latitudeDelta: 0.008,
                        longitudeDelta: 0.008,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: data.location.latitude,
                          longitude: data.location.longitude,
                        }}
                        title="Location"
                        description="This is the location"
                      />
                    </MapView>
                  ) : (
                    <Text>No Location Entered</Text>
                  )}
                </View>
                <Paragraph style={{ fontSize: 16, color: "blue" }}>
                  Enter order assignment information
                </Paragraph>
                {!data.service.is_final_price && (
                  <TextInputController
                    control={control}
                    name="final_price"
                    label="final price"
                    placeholder="Enter Final Price"
                    rules={{
                      required: "Price is required",
                    }}
                    defaultValue=""
                    errors={errors}
                    style={styles.input}
                    keyboardType="number-pad"
                  />
                )}
                <SelectWorkers
                  items={workers}
                  control={control}
                  name="workers"
                  label="select workers"
                  errors={errors}
                  rules={{
                    required: "Workers are required",
                  }}
                />
                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  disabled={formState.isSubmitting || isPending}
                  loading={isPending}
                >
                  Submit
                </Button>
              </Card.Content>
            </ScrollView>
          </Card>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
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
    fontSize: 20,
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
    marginBottom: 2,
    backgroundColor: "transparent",
  },
  text: { fontSize: 14, color: "#fff" },
});

export default StaffServicePage;
