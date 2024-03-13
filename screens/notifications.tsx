import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { List, Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../services/notifications";
import { notificationResponse } from "../models/notifications";
import { getBadgeCountAsync } from "expo-notifications";

type Notification = {
  id: number;
  title: string;
  message: string;
};

const Notifications = () => {
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  if (isLoading || isFetching) {
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
  }

  if (isError) {
    return <Text>Error fetching service data</Text>;
  }

  if (!notifications) {
    return null;
  }
  return (
    <>
      <FlatList
        data={notifications!}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item: notificationResponse) => item.id.toString()}
        renderItem={({ item }: { item: notificationResponse }) => (
          <List.Item
            title={item.title}
            description={item.body}
            titleNumberOfLines={2}
            descriptionNumberOfLines={3}
            titleStyle={{
              ...styles.title,
              color: item.is_seen ? "#666" : "#000",
            }}
            descriptionStyle={{
              ...styles.description,
              color: item.is_seen ? "#666" : "#000",
            }}
            style={{
              ...styles.itemContainer,
              backgroundColor: item.is_seen ? "#eee" : "aliceblue",
            }}
            right={() => (
              <Text style={styles.date}>{item.date.slice(0, 10)}</Text>
            )}
          />
        )}
      />
    </>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: "#888",
    alignSelf: "flex-start",
  },
});
