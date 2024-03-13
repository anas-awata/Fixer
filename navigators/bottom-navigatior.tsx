import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, BottomNavigation } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CommonActions } from "@react-navigation/native";
import Settings from "../screens/settings";
import Landing from "../screens/landing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StaffLanding from "../screens/staff/staff-landing";
import StaffMyTickets from "../screens/staff/staff-my-tickets";
import Notifications from "../screens/notifications";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { fetchNotificationsNumber } from "../services/notifications";

type TabParamList = {
  Home: undefined;
  settings: undefined;
  myTickets: undefined;
  notifications: undefined;
};

interface NotificationsCountResponse {
  unseen_count: number;
}

const Tab = createBottomTabNavigator<TabParamList>();

export default function BottomNavigator() {
  const [isStaff, setIsStaff] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);

  AsyncStorage.getItem("user")
    .then((user) => {
      const parsedUser = JSON.parse(user!);
      console.log(parsedUser);
      setIsStaff(parsedUser?.is_staff || false);
      setIsSupervisor(parsedUser?.is_supervisor || false);
    })
    .catch((error) => {
      console.error("Error retrieving user:", error);
    });

  const {
    data: notificationsCount,
    isLoading,
    isError,
    refetch,
    isFetching,
  }: UseQueryResult<NotificationsCountResponse> = useQuery({
    queryKey: ["notificationsCount"],
    queryFn: fetchNotificationsNumber,
  });
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }: any) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }: any) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }: any) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={isStaff ? StaffLanding : Landing}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }: any) => {
            return <Icon name="home" size={size} color={"blue"} />;
          },
        }}
      />
      {isStaff && isSupervisor && (
        <Tab.Screen
          name="myTickets"
          component={StaffMyTickets}
          options={{
            tabBarLabel: "My Tickets",
            tabBarIcon: ({ color, size }: any) => {
              return (
                <Icon name="animation-outline" size={size} color={"blue"} />
              );
            },
          }}
        />
      )}
      <Tab.Screen
        name="notifications"
        component={Notifications}
        options={{
          tabBarLabel: "Notifications",
          tabBarBadge: notificationsCount?.unseen_count || 0,
          tabBarIcon: ({ color, size }: any) => {
            return <Icon name="bell" size={size} color={"blue"} />;
          },
        }}
      />
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }: any) => {
            return <Icon name="cog" size={size} color={"blue"} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
