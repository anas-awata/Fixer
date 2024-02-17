import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import {
  fetchServiceCategories,
  fetchServiceCategory,
} from "../services/service-categories/indexx";
import ServiceCard from "../components/service-card";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import ServiceCategoryCard from "../components/service-category-card";

interface Props {
  navigation: any;
}

const Categories: React.FC<Props> = ({ navigation }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-service-categories"],
    queryFn: () => fetchServiceCategories(),
  });
  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
  }
  return (
    <View>
      <FlatList
        style={{ paddingVertical: 10 }}
        data={data}
        renderItem={({ item }) => (
          <ServiceCategoryCard
            key={item.id}
            category={item}
            navigation={navigation}
          />
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

export default Categories;
