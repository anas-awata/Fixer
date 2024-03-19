import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { fetchServices } from "../services/service";
import HomeServiceCard from "../components/home-service-card";
import ServiceCard from "../components/service-card";
import CustomLoading from "../components/custom-loading";

interface Props {
  navigation: any;
}

const Services: React.FC<Props> = ({ navigation }) => {
  const { data, status, isLoading, refetch } = useQuery({
    queryKey: ["get-services"],
    queryFn: () => fetchServices(false),
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  if (isLoading) {
    return <CustomLoading />;
  }
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ width: "100%", paddingVertical: 10 }}
        data={data}
        renderItem={({ item }) => (
          <ServiceCard service={item} navigation={navigation} key={item.id} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListEmptyComponent={null}
        columnWrapperStyle={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          gap: 10,
          alignItems: "flex-start",
        }}
      />
    </View>
  );
};

export default Services;
