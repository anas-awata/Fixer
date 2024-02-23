import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  View,
  ScrollView,
  Text,
  Image,
} from "react-native";
import { fetchUserServices } from "../services/service";
import UserServiceCard from "../components/user-service-card";
import { Button } from "react-native-paper";

interface Props {
  route: any;
  navigation: any;
}

const UserHistoryPage: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { data, isLoading } = useQuery({
    queryKey: ["get-user-services"],
    queryFn: () => fetchUserServices(false),
  });
  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
  }
  return (
    <View style={{ flex: 1 }}>
      {data && data?.length > 0 ? (
        <ScrollView showsHorizontalScrollIndicator={false}>
          <>
            {data?.map((service) => (
              <UserServiceCard
                service={service}
                key={service.id}
                navigation={navigation}
              />
            ))}
          </>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/support-team-1.png")}
            style={styles.image}
          />
          <Text style={styles.emptyText}>You Have No Previous Services</Text>
          <Button
            mode="outlined"
            onPress={() => {
              navigation.navigate("categories", { name: "Categories" });
            }}
          >
            Start Ordering
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
  },
});

export default UserHistoryPage;
