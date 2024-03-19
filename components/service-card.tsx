import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { serviceResponse } from "../models/service";
import Icon from "react-native-vector-icons/Ionicons";

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
      <ImageBackground
        source={{ uri: service.picture }}
        style={styles.featuredServiceImage}
      >
        {service.average_rating && (
          <View style={styles.headerContent}>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((index) => (
                <Icon
                  name={
                    service.average_rating! >= index ? "star" : "star-outline"
                  }
                  size={12}
                  color={service.average_rating! >= index ? "#FFD700" : "#ccc"}
                  key={index}
                />
              ))}
            </View>
          </View>
        )}
      </ImageBackground>
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
    color: "#fff",
  },
  header: {
    height: 200, // Adjust the height as needed
    justifyContent: "flex-end",
    padding: 20,
  },
  headerContent: {
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent background for text
    padding: 5,
    borderRadius: 10,
    display: "flex",
    gap: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    gap: 5,
  },
});

export default ServiceCard;
