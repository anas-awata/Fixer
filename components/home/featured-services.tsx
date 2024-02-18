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
import { fetchServices } from "../../services/service";
import { serviceResponse } from "../../models/service";

interface Props {
  navigation: any;
}

const FeaturedServices = ({ navigation }: Props) => {
  const { data, status } = useQuery({
    queryKey: ["get-services"],
    queryFn: () => fetchServices(),
  });

  const handleServicePress = (service: any) => {
    console.log(`Pressed: ${service.title}`);
    navigation.navigate("service", {
      id: service.id,
      name: service.title,
    });
  };

  const renderFeaturedService = (service: serviceResponse) => (
    <TouchableOpacity
      key={service.id}
      onPress={() => handleServicePress(service)}
      style={styles.featuredServiceCard}
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Services</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {status != "pending" && <>{data?.map(renderFeaturedService)}</>}
        {status == "pending" && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
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
});

export default FeaturedServices;
