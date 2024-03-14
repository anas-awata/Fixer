import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Image,
  ScrollView,
} from "react-native";
import { List, Switch, Text } from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MarkNotificationAsRead,
  fetchNotifications,
} from "../services/notifications";
import { notificationResponse } from "../models/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Notifications = ({ navigation }: any) => {
  const [showAll, setshowAll] = useState(false);
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [`notifications`, showAll],
    queryFn: () => fetchNotifications(!showAll),
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: ["notificationsCount"] });
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  const [isStaff, setIsStaff] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);

  AsyncStorage.getItem("user")
    .then((user) => {
      const parsedUser = JSON.parse(user!);
      setIsStaff(parsedUser?.is_staff || false);
      setIsSupervisor(parsedUser?.is_supervisor || false);
    })
    .catch((error) => {
      console.error("Error retrieving user:", error);
    });

  const queryClient = useQueryClient();

  const MarkAsRead = useMutation({
    mutationFn: MarkNotificationAsRead,
    onSuccess: (data) => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["notificationsCount"] });
    },
    onError: (error: any) => {
      console.log(error);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["notificationsCount"] });
    },
  });

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
      <View style={{ flexDirection: "row", padding: 20 }}>
        <Text>Show All</Text>
        <Switch
          value={showAll}
          onValueChange={() => {
            setshowAll(!showAll);
          }}
        />
      </View>
      {notifications.length > 0 ? (
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
              onPress={() => {
                MarkAsRead.mutate({ id: item.id });
                if (isStaff) {
                  navigation.navigate("staff-service", {
                    name: item.ticket.service.title,
                    id: item.ticket.id,
                    serviceId: item.ticket.service.id,
                  });
                } else {
                  navigation.navigate("User-Service", {
                    name: item.ticket.service.title,
                    id: item.ticket.id,
                  });
                }
              }}
            />
          )}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Image
            source={require("../assets/support-team-1.png")}
            style={styles.image}
          />
          <Text style={styles.emptyText}>You Don't Have Notifications</Text>
        </ScrollView>
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
});
