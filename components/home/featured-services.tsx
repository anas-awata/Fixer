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
import { Button } from "react-native-paper";
import HomeServiceCard from "../home-service-card";

interface Props {
  navigation: any;
}

const FeaturedServices = ({ navigation }: Props) => {
  const { data, status } = useQuery({
    queryKey: ["get-top-services"],
    queryFn: () => fetchServices(true),
  });

  const renderFeaturedService = (service: serviceResponse) => (
    <HomeServiceCard service={service} navigation={navigation} />
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 20,
          marginBottom: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}>
          Top Services
        </Text>
        <Button
          mode="text"
          onPress={() => {
            navigation.navigate("Services");
          }}
        >
          <Text>Show All</Text>
        </Button>
      </View>
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
