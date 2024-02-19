import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { StyleSheet, ActivityIndicator, FlatList, View, ScrollView } from "react-native";
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
      <ScrollView showsHorizontalScrollIndicator={false}>
        <>
          {data?.map((service) => (
            <UserServiceCard service={service} key={service.id} />
          ))}
        </>
      </ScrollView>
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
