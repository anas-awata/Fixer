import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { fetchServiceCategory } from "../services/service-categories/indexx";
import ServiceCard from "../components/service-card";
import CustomLoading from "../components/custom-loading";

interface Props {
  route: any;
  navigation: any;
}

const ServiceCategoryPage: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  console.log("route", route, id);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get-service-category", id],
    queryFn: () => fetchServiceCategory(id),
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
    <View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={data}
        style={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <ServiceCard key={item.id} service={item} navigation={navigation} />
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

export default ServiceCategoryPage;
