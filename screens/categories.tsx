import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { fetchServiceCategories } from "../services/service-categories/indexx";
import ServiceCategoryCard from "../components/service-category-card";
import CustomLoading from "../components/custom-loading";

interface Props {
  navigation: any;
}

const Categories: React.FC<Props> = ({ navigation }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-service-categories"],
    queryFn: () => fetchServiceCategories(),
  });
  if (isLoading) {
    return <CustomLoading />;
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

export default Categories;
