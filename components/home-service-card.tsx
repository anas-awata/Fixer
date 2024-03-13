import React from "react";
import { serviceResponse } from "../models/service";
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  DimensionValue,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type Props = {
  service: serviceResponse;
  navigation: any;
  width?: DimensionValue | undefined;
};

const HomeServiceCard = ({ service, navigation, width }: Props) => {
  const handleServicePress = (service: any) => {
    navigation.navigate("service", {
      id: service.id,
      name: service.title,
    });
  };


  return (
    <TouchableOpacity
      key={service.id}
      onPress={() => handleServicePress(service)}
      style={{ ...styles.featuredServiceCard, width: width ? width : 200 }}
    >
      <Image
        source={{ uri: service.picture }}
        style={styles.featuredServiceImage}
      />
      <Text style={styles.featuredServiceTitle}>{service.title}</Text>
      <Text style={styles.featuredServiceDescription}>
        {service.description.slice(0, 40)}
        {service.description.length > 40 ? "..." : ""}
      </Text>
      {service.average_rating && (
        <View style={styles.starContainer}>
          <Text style={styles.featuredServiceDescription}>Rating :</Text>
          {[1, 2, 3, 4, 5].map((index) => (
            <Icon
              //@ts-ignore
              name={service.average_rating >= index ? "star" : "star-outline"}
              size={15}
              //@ts-ignore
              color={service.average_rating >= index ? "#FFD700" : "#ccc"}
              key={index}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  featuredServiceCard: {
    marginRight: 20,
    width: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  featuredServiceImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
  },
  featuredServiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  featuredServiceDescription: {
    fontSize: 14,
    color: "#555",
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 350,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    gap:5
  },
});

export default HomeServiceCard;
