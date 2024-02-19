import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { userServiceResponse } from "../../models/service";
import { Button, Title } from "react-native-paper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ClientAcceptServicePrice,
  ClientRejectServicePrice,
} from "../../services/service";
import Toast from "react-native-toast-message";

type Props = {
  service: userServiceResponse;
  navigation: any;
  worker?: boolean;
};

const StaffServiceCard = ({ service, navigation, worker }: Props) => {
  const queryClient = useQueryClient();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("staff-service", {
          id: service.id,
          name: service.service.title,
          serviceId: service.service.id,
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
            <Text style={styles.text}>Client: {service.full_name}</Text>
            <Text style={styles.text}>
              $
              {service.final_price
                ? service.final_price
                : service.service.initial_price}
            </Text>
            <Text
              style={[
                styles.text,
                {
                  color:
                    service.status === "Open" ||
                    service.status === "In Progress" ||
                    service.status === "Rated"
                      ? "green"
                      : service.status === "Closed"
                      ? "gray"
                      : service.status === "Pending" ||
                        service.status === "Pending Payment" ||
                        service.status === "Pending Approval"
                      ? "orange"
                      : "red",
                },
              ]}
            >
              {service.status}
            </Text>
            <Text style={styles.text}>
              {service.submission_date.slice(0, 10)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 15,
    margin: 5,
    borderRadius: 10,
    width: "97%",
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
  text: {
    fontSize: 14,
    marginTop: 4,
    color: "#333",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498db",
  },
});
export default StaffServiceCard;
