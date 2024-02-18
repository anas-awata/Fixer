import React from "react";
import { TouchableOpacity, Text, View, Image, StyleSheet } from "react-native";
import { serviceResponse } from "../models/service";

type Props = {
  service: serviceResponse;
  navigation: any;
};

const ServiceCard = ({ service, navigation }: Props) => {
  return (
    <TouchableOpacity
      key={service.id}
      onPress={() => {
        navigation.navigate("service", {
          id: service.id,
          name: service.title,
        });
      }}
      style={styles.featuredServiceCard}
    >
      <Image
        source={{ uri: service.picture }}
        style={styles.featuredServiceImage}
      />
      <Text style={styles.featuredServiceTitle}>{service.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  featuredServiceCard: {
    width: 180,
    borderRadius: 10,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredServiceImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
  },
  featuredServiceTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 8,
    textAlign: "center",
  },
  featuredServiceDescription: {
    fontSize: 14,
    color: "#555",
  },
});

export default ServiceCard;
