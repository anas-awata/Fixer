import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { View, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { fetchServices } from "../services/service";
import HomeServiceCard from "../components/home-service-card";

interface Props {
  navigation: any;
}

const Services: React.FC<Props> = ({ navigation }) => {
  const { data, status, isLoading } = useQuery({
    queryKey: ["get-services"],
    queryFn: () => fetchServices(false),
  });

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
  }
  return (
    <View style={{ flex: 1, alignItems: "center",marginLeft:"8%" }}>
      <FlatList
        style={{ width: "100%", paddingVertical: 10 }}
        data={data}
        renderItem={({ item }) => (
          <HomeServiceCard
            service={item}
            navigation={navigation}
            width={"90%"}
            key={item.id}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        ListEmptyComponent={null}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          gap: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Services;
