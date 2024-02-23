import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { userServiceResponse } from "../models/service";
import { Button, Divider, Menu, Title } from "react-native-paper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ClientAcceptServicePrice,
  ClientRateService,
  ClientRejectServicePrice,
} from "../services/service";
import Toast from "react-native-toast-message";
import StarRatingModal from "./inputs/start-rating-modal";

type Props = {
  service: userServiceResponse;
  navigation: any;
};

const UserServiceCard = ({ service, navigation }: Props) => {
  const queryClient = useQueryClient();

  const {
    mutate: rejectService,
    isPending: isPendingReject,
    error: errorReject,
  } = useMutation({
    mutationFn: ClientRejectServicePrice,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["get-user-services-in-progress"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-user-services"],
      });
      Toast.show({
        type: "success",
        text1: "Service Rejected successfully",
      });
    },
    onError: (error: any) => {
      console.log("error", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong please try again later",
      });
    },
  });

  const {
    mutate: Acceptservice,
    isPending,
    error,
  } = useMutation({
    mutationFn: ClientAcceptServicePrice,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["get-user-services-in-progress"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-user-services"],
      });
      Toast.show({
        type: "success",
        text1: "Service Accepted successfully",
      });
    },
    onError: (error: any) => {
      console.log("error", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong please try again later",
      });
    },
  });

  const {
    mutate: RateService,
    isPending: isPendingRating,
    error: isErrorRating,
  } = useMutation({
    mutationFn: ClientRateService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-user-services-in-progress"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-user-services"],
      });
      Toast.show({
        type: "success",
        text1: "Service Rated successfully",
      });
    },
    onError: (error: any) => {
      console.log("error", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong please try again later",
      });
    },
  });

  const onPressAccept = async () => {
    Acceptservice({ id: service.id });
  };
  const onPressReject = async () => {
    rejectService({ id: service.id });
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleRate = (selectedRating: any) => {
    RateService({ id: service.id, client_rating: selectedRating });
  };
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("User-Service", {
          id: service.id,
          name: service.service.title,
        });
      }}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Image
            source={{ uri: service.service?.picture }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{service.service.title}</Text>
            <Text style={styles.price}>
              $
              {service.final_price
                ? service.final_price
                : service.service.initial_price}
            </Text>
            <Text
              style={[styles.status, { color: getStatusColor(service.status) }]}
            >
              {service.status}
            </Text>
            <Text style={styles.date}>
              {service.submission_date.slice(0, 10)}
            </Text>
            {service.status == "Rated" && (
              <Text style={styles.date}>Rating :{service.client_rating}</Text>
            )}
          </View>
        </View>
        {/* {service.status === "Pending Approval" && (
        <View style={styles.buttonContainer}>
          <Button
            textColor="green"
            onPress={onPressAccept}
            disabled={isPending}
            loading={isPending}
          >
            Accept
          </Button>
          <Button
            textColor="red"
            onPress={onPressReject}
            disabled={isPendingReject}
            loading={isPendingReject}
          >
            Reject
          </Button>
        </View>
      )} */}
        {/* {service.status == "Closed" && (
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
      )} */}
      </View>
    </Pressable>
  );
};

const getStatusColor = (status: userServiceResponse["status"]) => {
  switch (status) {
    case "Open":
    case "In Progress":
    case "Rated":
      return "green";
    case "Closed":
      return "gray";
    case "Pending":
    case "Pending Payment":
    case "Pending Approval":
      return "orange";
    default:
      return "red";
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 20,
    margin: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    justifyContent: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 110,
    height: 100,
    resizeMode: "cover",
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  price: {
    fontSize: 14,
    color: "#777",
    marginBottom: 3,
  },
  status: {
    fontSize: 14,
    marginBottom: 3,
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonRatingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
});
export default UserServiceCard;
