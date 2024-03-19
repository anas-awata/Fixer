import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { FlatList, View, RefreshControl } from "react-native";
import {
  fetchStaffAvailableServices,
  fetchUserServices,
} from "../../services/service";
import UserServiceCard from "../user-service-card";
import { Text, Title } from "react-native-paper";
import StaffServiceCard from "./staff-service-card";
import CustomLoading from "../custom-loading";

interface Props {
  navigation: any;
}

const StaffAvailableServicesList: React.FC<Props> = ({ navigation }) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["get-staff-available-services"],
    queryFn: () => fetchStaffAvailableServices(),
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  if (isLoading || isFetching) {
    return <CustomLoading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#3498db",
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            paddingVertical: 10,
            fontSize: 18,
            color: "#fff",
          }}
        >
          There are {data?.length} Tickets Available
        </Text>
      </View>
      <FlatList
        style={{ flex: 1, paddingHorizontal: 10 }}
        data={data}
        renderItem={({ item }) => (
          <StaffServiceCard
            service={item}
            key={item.id}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default StaffAvailableServicesList;
