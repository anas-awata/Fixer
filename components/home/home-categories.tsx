import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import ServiceCategoryCard from "../service-category-card";
import { useQuery } from "@tanstack/react-query";
import { fetchServiceCategories } from "../../services/service-categories/indexx";

type Props = {
  navigation: any;
};

const HomeCategories = (props: Props) => {
  const { data, status } = useQuery({
    queryKey: ["get-service-categories"],
    queryFn: () => fetchServiceCategories(),
  });

  return (
    <>
      <View
        style={{
          marginTop: 20,
          margin: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}>
          Our Services Categories
        </Text>
        <Button
          mode="text"
          onPress={() => {
            props.navigation.navigate("categories", { name: "categories" });
          }}
        >
          <Text>Show All</Text>
        </Button>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {status != "pending" && (
          <>
            {data?.map((category) => (
              <ServiceCategoryCard
                key={category.id}
                category={category}
                navigation={props.navigation}
              />
            ))}
          </>
        )}
        {status == "pending" && (
          <ActivityIndicator
            size="large"
            style={styles.activityIndicatorContainer}
          />
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 370,
  },
});

export default HomeCategories;
