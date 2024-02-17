import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, BottomNavigation } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CommonActions } from "@react-navigation/native";
import WelcomeScreen from "../screens/welcome-screen";
import TicketList from "../screens/ticket-list";
import Settings from "../screens/settings";
import Landing from "../screens/landing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StaffLanding from "../screens/staff-landing";

type TabParamList = {
  Home: undefined;
  settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function BottomNavigator() {
  const [isStaff, setIsStaff] = useState(false);

  AsyncStorage.getItem("user")
    .then((user) => {
      const parsedUser = JSON.parse(user!);
      setIsStaff(parsedUser?.is_staff || false);
    })
    .catch((error) => {
      console.error("Error retrieving user:", error);
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
