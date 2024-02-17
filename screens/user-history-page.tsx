import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { StyleSheet, ActivityIndicator, FlatList, View } from "react-native";
import { fetchUserServices } from "../services/service";
import UserServiceCard from "../components/user-service-card";

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
    <View>
      <FlatList
        style={{ paddingVertical: 20 }}
        data={data}
        renderItem={({ item }) => (
          <UserServiceCard service={item} key={item.id} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        ListEmptyComponent={null}
        contentContainerStyle={{ alignItems: "center" }}
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

export default UserHistoryPage;
