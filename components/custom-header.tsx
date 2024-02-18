import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Props {
  navigation?: any;
  inProgress: number | null;
}

const CustomHeader = ({ inProgress, navigation }: Props) => {
  const handleActionPress = () => {
    navigation.navigate("categories", { name: "Categories" });
  };

  return (
    <View
      style={{
        backgroundColor: "#3498db",
        paddingVertical: 40,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
        Welcome to Fixer
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 30,
        }}
      >
        <View style={{ width: "40%" }}>
          <Text style={{ color: "white", fontSize: 22, lineHeight: 40 }}>
            {inProgress
              ? `You Have ${inProgress} Services In Progress`
              : `Your device deserves the best care`}
          </Text>
          {!inProgress && (
            <TouchableOpacity
              onPress={handleActionPress}
              style={{
                backgroundColor: "#2ecc71",
                padding: 10,
                borderRadius: 8,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Get Started
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ marginTop: 30, alignItems: "center" }}>
          <Image
            source={require("../assets/maintenance.png")}
            style={{ width: 200, height: 200, resizeMode: "contain" }}
          />
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;
