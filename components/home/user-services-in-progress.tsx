import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { fetchServices, fetchUserServices } from "../../services/service";
import { serviceResponse, userServiceResponse } from "../../models/service";
import UserServiceCard from "../user-service-card";

interface Props {
  status: "error" | "success" | "pending";
  data: userServiceResponse[];
}

const UserServicesInProgress = ({ data, status }: Props) => {
  if (status == "pending")
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!data || data.length == 0) return null;
  return (
    <View style={styles.container}>
      {status == "success" && (
        <Text style={styles.title}>Services in Progress</Text>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <>
          {data?.map((service) => (
            <UserServiceCard service={service} key={service.id} />
          ))}
        </>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 370,
    marginTop: 10,
  },
});

export default UserServicesInProgress;
