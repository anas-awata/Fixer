import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import { fetchServiceCategory } from "../services/service-categories/indexx";
import ServiceCard from "../components/service-card";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

interface Props {
  route: any;
  navigation: any;
}

const ServiceCategoryPage: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  console.log("route", route, id);
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-service-category", id],
    queryFn: () => fetchServiceCategory(id),
  });
  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
  }
  return (
    <View>
      <FlatList
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

export default ServiceCategoryPage;
