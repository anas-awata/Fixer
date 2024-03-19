import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { Button, Card, Title, Paragraph } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { fetchUserServiceById } from "../services/service";
import StarRatingModal from "../components/inputs/star-rating-modal";
import useReverseGeocoding from "../hooks/use-reverce-geocoding";
import QrCodeGeneratorModal from "../components/qr-code-generator-modal";
import useUserTicketMutations from "../hooks/use-user-ticket-mutations";
import CustomLoading from "../components/custom-loading";

type Props = {
  route: any;
  navigation: any;
};

const UserServicePage = ({ route, navigation }: Props) => {
  const { id } = route.params;

  //get ticket info
  const { data, status, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["get-user-service-by-id", id],
    queryFn: () => fetchUserServiceById(id),
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  //get location name
  const locationName = useReverseGeocoding(
    data?.location ? data.location : null
  );

  const {
    rejectService,
    isRejectServicePending,
    rejectServiceError,
    acceptService,
    isAcceptServicePending,
    acceptServiceError,
    rateService,
    isRateServicePending,
    rateServiceError,
  } = useUserTicketMutations();
  const onPressAccept = async () => {
    acceptService({ id: id });
  };
  const onPressReject = async () => {
    rejectService({ id: id });
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  const handleRate = (selectedRating: any) => {
    rateService({ id: id, client_rating: selectedRating });
  };

  if (status === "pending" || isLoading || isFetching) {
    return <CustomLoading />;
  }

  if (status === "error") {
    return <Text>Error fetching service data</Text>;
  }

  if (!data) {
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
        <TouchableWithoutFeedback>
          <ImageBackground
            source={{ uri: data.service.picture }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Title style={styles.title}>{data.service.title} Order</Title>
              <Paragraph style={styles.text}>
                client description : {data.description}
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
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          style={{ flex: 1 }} // Ensure the KeyboardAvoidingView fills the entire screen
          behavior={Platform.OS === "ios" ? "padding" : undefined} // Adjust behavior based on platform
        >
          <Card style={styles.card}>
            <TouchableWithoutFeedback>
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
                  {data.final_price && (
                    <Paragraph style={{ fontSize: 14, color: "blue" }}>
                      Final Price : ${data.final_price}
                    </Paragraph>
                  )}
                  {data.notes && (
                    <>
                      <Paragraph style={{ fontSize: 14, color: "blue" }}>
                        notes : {data.notes}
                      </Paragraph>
                      <Paragraph style={{ fontSize: 14, color: "black" }}>
                        {data.notes}
                      </Paragraph>
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
                {data.status === "Pending Approval" && (
                  <View style={styles.buttonContainer}>
                    <Button
                      mode="contained"
                      onPress={onPressAccept}
                      disabled={isAcceptServicePending}
                      loading={isAcceptServicePending}
                    >
                      Accept
                    </Button>
                    <Button
                      mode="contained"
                      buttonColor="#d10606"
                      onPress={onPressReject}
                      disabled={isRejectServicePending}
                      loading={isRateServicePending}
                    >
                      Reject
                    </Button>
                  </View>
                )}
                {data.status == "Closed" && (
                  <>
                    <View style={styles.buttonRatingContainer}>
                      <Button
                        mode="contained"
                        buttonColor="green"
                        textColor="#fff"
                        onPress={() => setModalVisible(true)}
                        // disabled={isPending}
                        // loading={isPending}
                      >
                        Rate The Service
                      </Button>
                    </View>
                    <StarRatingModal
                      visible={modalVisible}
                      onClose={() => setModalVisible(false)}
                      onRate={handleRate}
                    />
                  </>
                )}
                {data.status == "Pending Payment" && (
                  <>
                    <View style={styles.buttonRatingContainer}>
                      <Button
                        mode="contained"
                        buttonColor="green"
                        textColor="#fff"
                        onPress={() => setQrModalVisible(true)}
                      >
                        Click To Show Payment Qr Code
                      </Button>
                    </View>
                    <QrCodeGeneratorModal
                      value={data.paycode}
                      onClose={() => {
                        setQrModalVisible(false);
                      }}
                      visible={qrModalVisible}
                    />
                  </>
                )}
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
    justifyContent: "center",
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
    padding: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  input: {
    width: "100%",
    marginBottom: 2,
    backgroundColor: "transparent",
  },
  text: { fontSize: 14, color: "#fff" },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
  },
  buttonRatingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
});

export default UserServicePage;
