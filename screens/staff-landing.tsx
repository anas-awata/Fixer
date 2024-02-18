import * as React from "react";
import { View, StyleSheet, ScrollView, Button } from "react-native";
import CustomHeader from "../components/custom-header";
import Testimonials from "../components/home/testimonials";
import FeaturedServices from "../components/home/featured-services";
import HomeCategories from "../components/home/home-categories";
import UserServicesInProgress from "../components/home/user-services-in-progress";
import { useQuery } from "@tanstack/react-query";
import {
  fetchStaffAvailableServices,
  fetchUserServices,
} from "../services/service";
import StaffAvailableServicesList from "../components/staff-available-services-list";

interface Props {
  navigation: any;
}

const StaffLanding: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <StaffAvailableServicesList navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default StaffLanding;
