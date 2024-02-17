import React, { useState } from "react";
import { TouchableOpacity, Text, View, Image, StyleSheet } from "react-native";
import { userServiceResponse } from "../models/service";
import { Button, Title } from "react-native-paper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ClientAcceptServicePrice,
  ClientRejectServicePrice,
} from "../services/service";
import Toast from "react-native-toast-message";

type Props = {
  service: userServiceResponse;
};

const UserServiceCard = ({ service }: Props) => {
  const queryClient = useQueryClient();
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

  const onPressAccept = async () => {
    Acceptservice({ id: service.id });
  };
  const onPressReject = async () => {
    rejectService({ id: service.id });
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "flex-start",
          width: "100%",
          flexDirection: "row",
          gap: 15,
        }}
      >
        <Image
          source={{ uri: service.service?.picture }}
          style={{
            width: 130,
            height: 105,
            resizeMode: "contain",
            borderRadius: 10,
          }}
        />
        <View
          style={{
            gap: -10,
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Title style={styles.title}>{service.service.title}</Title>
          <Text style={styles.text}>
            $
            {service.final_price
              ? service.final_price
              : service.service.initial_price}
          </Text>
          <Text
            style={{
              ...styles.text,
              color:
                service.status == "Open" ||
                service.status == "In Progress" ||
                service.status == "Rated"
                  ? "green"
                  : service.status == "Closed"
                  ? "gray"
                  : service.status == "Pending" ||
                    service.status == "Pending Payment"
                  ? "orange"
                  : "red",
            }}
          >
            {service.status}
          </Text>
          <Text style={styles.text}>
            {service.submission_date.slice(0, 10)}
          </Text>
        </View>
      </View>
      {service.status == "Pending" && (
        <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ecf0f1",
    paddingHorizontal: 15,
    paddingVertical: 25,
    margin: 5,
    borderRadius: 10,
    width: 330,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  text: {
    fontSize: 15,
    marginTop: 8,
    width: "100%",
    textAlign: "left",
    color: "#222",
  },
  title: { fontWeight: "600", color: "#3498db", fontSize: 17 },
});

export default UserServiceCard;
