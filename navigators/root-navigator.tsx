import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/welcome-screen";
import LogIn from "../screens/log-in";
import Register from "../screens/register";
import Home from "../screens/home";
import CustomHeader from "../components/custom-header";
import ServiceCategoryPage from "../screens/service-category-page";
import ServicePage from "../screens/service-page";
import Categories from "../screens/categories";
import UserHistoryPage from "../screens/user-history-page";
import VerifyAccount from "../screens/verify-account";
import StaffServicePage from "../screens/staff/staff-sevice-page";
import StaffServiceHistory from "../screens/staff/staff-service-history";
import EditProfile from "../screens/edit-profile";
import UserServicePage from "../screens/user-service-page";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="welcome">
      <Stack.Screen
        options={{ headerShown: false }}
        name="log-in"
        component={LogIn}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="welcome"
        component={WelcomeScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="register"
        component={Register}
      />
      <Stack.Screen
        options={({ route }: any) => ({
          headerShown: false,
        })}
        name="verify-account"
        component={VerifyAccount}
      />
      <Stack.Screen
        name="home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        options={({ route }: any) => ({
          headerShown: true,
          title: route.params.name,
        })}
        name="category"
        component={ServiceCategoryPage}
      />
      <Stack.Screen
        options={({ route }: any) => ({
          headerShown: true,
          title: route.params.name,
        })}
        name="service"
        component={ServicePage}
      />
      <Stack.Screen
        options={({ route }: any) => ({
          headerShown: true,
          title: route.params.name,
        })}
        name="categories"
        component={Categories}
      />
      <Stack.Screen
        options={({ route }: any) => ({
          headerShown: true,
          title: route.params.name,
        })}
        name="service-history"
        component={UserHistoryPage}
      />
      <Stack.Screen
        options={({ route }: any) => ({
          headerShown: true,
          title: route.params.name,
        })}
        name="staff-service"
        component={StaffServicePage}
      />
      <Stack.Screen
        options={({ route }: any) => ({
          headerShown: true,
          title: route.params.name,
        })}
        name="staff-history"
        component={StaffServiceHistory}
      />
      <Stack.Screen
        options={({ route }: any) => ({
          headerShown: true,
          title: route.params.name,
        })}
        name="Edit-Profile"
        component={EditProfile}
      />
      <Stack.Screen
        options={({ route }: any) => ({
          headerShown: true,
          title: route.params.name,
        })}
        name="User-Service"
        component={UserServicePage}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
