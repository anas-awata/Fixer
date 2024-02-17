import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import { serviceCategoryResponse } from "../models/service-categories";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";

type Props = {
  category: serviceCategoryResponse;
  navigation: any;
};

const ServiceCategoryCard = ({ category, navigation }: Props) => {
  return (
    <TouchableOpacity
      key={category.id}
      style={{
        backgroundColor: "#ecf0f1",
        padding: 12,
        margin: 5,
        borderRadius: 10,
        width: 170,
      }}
      onPress={() => {
        navigation.navigate("category", {
          id: category.id,
          name: category.title,
        });
      }}
    >
      <View style={{ alignItems: "center", width: "100%" }}>
        <Image
          source={{ uri: category.icon }}
          style={{ width: 100, height: 100, resizeMode: "contain" }}
        />
        <Text
          style={{
            fontSize: 15,
            marginTop: 10,
            width: "100%",
            textAlign: "center",
          }}
        >
          {category.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ServiceCategoryCard;
