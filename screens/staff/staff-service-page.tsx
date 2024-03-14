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
  RefreshControl,
} from "react-native";
import { Button, Card, Title, Paragraph } from "react-native-paper";
import { assignTicketRequest } from "../../models/service";
import { useQuery } from "@tanstack/react-query";
import {
  fetchServiceWorkersById,
  fetchStaffServicesById,
} from "../../services/service";
import TextInputController from "../../components/inputs/text-input-controller";
import { useForm } from "react-hook-form";
import useReverseGeocoding from "../../hooks/use-reverce-geocoding";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import SelectWorkers from "../../components/inputs/select-workers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QrCodeScannerModal from "../../components/inputs/qr-code-scanner-modal";
import useStaffTicketMutations from "../../hooks/use-staff-ticket-mutations";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

type Props = {
  route: any;
  navigation: NavigationProp<ParamListBase>;
};

const StaffServicePage = ({ route, navigation }: Props) => {
  const { id, serviceId } = route.params;

  //get ticket info
  const { data, status, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["get-staff-service", id],
    queryFn: () => fetchStaffServicesById(id),
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  //get workers list to assign
  const {
    data: workers,
    status: workersStatus,
    isLoading: workersIsLoading,
  } = useQuery({
    queryKey: ["get-service-workers", serviceId],
    queryFn: () => fetchServiceWorkersById(serviceId),
  });
  const {
    assignTicket,
    isAssignTicketPending,
    assignTicketError,
    rejectTicket,
    isRejectTicketPending,
    rejectTicketError,
    markAsDone,
    isMarkAsDonePending,
    markAsDoneError,
  } = useStaffTicketMutations({ navigation: navigation });
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
      workers: submittedData.workers?.join(","),
    };

    if (data?.status == "Open") {
      //@ts-ignore
      assignTicket(ticketData);
    } else if (data?.status == "In Progress") {
      markAsDone({ id: data.id, notes: submittedData.notes! });
    }
  };

  //check if Supervisor
  const [isSupervisor, setIsSupervisor] = useState(false);

  AsyncStorage.getItem("user")
    .then((user) => {
      const parsedUser = JSON.parse(user!);
      setIsSupervisor(parsedUser?.is_supervisor || false);
    })
    .catch((error) => {
      console.error("Error retrieving user:", error);
    });

  const [modalVisible, setModalVisible] = useState(false);

  if (
    status === "pending" ||
    workersStatus === "pending" ||
    isLoading ||
    workersIsLoading ||
    isFetching
  ) {
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
  }

  if (status === "error" || workersStatus === "error") {
    return <Text>Error fetching service data</Text>;
  }

  if (!data || !workers) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ height: "100%" }} // Set the height to fill the parent container
        contentContainerStyle={{
          flexGrow: 1,
        }}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
              <Paragraph style={styles.text}>
                Client: {data.full_name}
              </Paragraph>
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
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          style={{ flex: 1 }} // Ensure the KeyboardAvoidingView fills the entire screen
          behavior={Platform.OS === "ios" ? "padding" : undefined} // Adjust behavior based on platform
        >
          <Card style={styles.card}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <Card.Content style={{ display: "flex", gap: 10 }}>
                <View
                  style={{
                    width: 320,
                    height: data.status != "Open" ? 350 : 300,
                  }}
                >
                  <Paragraph
                    style={{
                      fontSize: 14,
                      color:
                        data.status == "Open" ||
                        data.status == "In Progress" ||
                        data.status == "Rated"
                          ? "green"
                          : data.status == "Closed"
                          ? "gray"
                          : data.status == "Pending" ||
                            data.status == "Pending Payment" ||
                            data.status == "Pending Approval"
                          ? "orange"
                          : "red",
                    }}
                  >
                    Status : {data.status}
                  </Paragraph>
                  {data.final_price && isSupervisor && (
                    <Paragraph style={{ fontSize: 14, color: "blue" }}>
                      Final Price : ${data.final_price}
                    </Paragraph>
                  )}
                  {data.workers.length > 0 && (
                    <>
                      <Paragraph style={{ fontSize: 14, color: "blue" }}>
                        Workers :
                      </Paragraph>
                      {data.workers.map((worker) => (
                        <Paragraph style={{ fontSize: 14 }} key={worker.id}>
                          {`${worker.full_name} -${worker.department}  `}
                        </Paragraph>
                      ))}
                    </>
                  )}
                  <Paragraph style={{ fontSize: 14, color: "blue" }}>
                    Order Location
                  </Paragraph>
                  <Text style={{ marginBottom: 4 }}>
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
                      provider={PROVIDER_GOOGLE}
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
                {isSupervisor && (
                  <>
                    {data.status == "Open" && (
                      <>
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
                      </>
                    )}
                    {data.status == "In Progress" && (
                      <>
                        <Paragraph style={{ fontSize: 16, color: "blue" }}>
                          Enter order assignment information
                        </Paragraph>
                        {!data.service.is_final_price && (
                          <TextInputController
                            control={control}
                            name="notes"
                            label="notes"
                            placeholder="Enter Notes"
                            rules={{
                              required: "Notes are required",
                            }}
                            defaultValue=""
                            errors={errors}
                            style={styles.input}
                            multiline
                            numberOfLines={2}
                          />
                        )}
                      </>
                    )}
                    {(data.status == "Open" ||
                      data.status == "In Progress") && (
                      <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        disabled={
                          formState.isSubmitting ||
                          isAssignTicketPending ||
                          isMarkAsDonePending
                        }
                        loading={isAssignTicketPending || isMarkAsDonePending}
                      >
                        {data.status == "Open"
                          ? "Accept And Submit"
                          : "Mark Ticket as Done"}
                      </Button>
                    )}
                    {data.status == "Open" && (
                      <Button
                        mode="contained"
                        buttonColor="#d10606"
                        onPress={() => {
                          rejectTicket(data.id);
                        }}
                        disabled={isRejectTicketPending}
                        loading={isRejectTicketPending}
                      >
                        Reject Order
                      </Button>
                    )}
                    {data.status == "Pending Payment" && (
                      <Button
                        mode="contained"
                        // onPress={() => markAsPaid(data.id)}
                        onPress={() => {
                          setModalVisible(true);
                        }}
                      >
                        Scann Payment Qr Code
                      </Button>
                    )}
                  </>
                )}
                <QrCodeScannerModal
                  visible={modalVisible}
                  onClose={() => setModalVisible(false)}
                  id={data.id}
                  navigation={navigation}
                />
              </Card.Content>
            </TouchableWithoutFeedback>
          </Card>
        </KeyboardAvoidingView>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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
