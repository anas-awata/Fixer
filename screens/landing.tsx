import * as React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Button,
  RefreshControl,
} from "react-native";
import CustomHeader from "../components/custom-header";
import Testimonials from "../components/home/testimonials";
import FeaturedServices from "../components/home/featured-services";
import HomeCategories from "../components/home/home-categories";
import UserServicesInProgress from "../components/home/user-services-in-progress";
import { useQuery } from "@tanstack/react-query";
import { fetchUserServices } from "../services/service";

interface Props {
  navigation: any;
}

const Landing: React.FC<Props> = ({ navigation }) => {
  const { data, status, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["get-user-services-in-progress"],
    queryFn: () => fetchUserServices(true),
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <CustomHeader
          inProgress={data && data.length > 0 ? data.length : null}
          navigation={navigation}
        />
        <UserServicesInProgress
          data={data!}
          status={status}
          isLoading={isLoading || isFetching}
          navigation={navigation}
        />
        <HomeCategories navigation={navigation} />
        <FeaturedServices navigation={navigation} />
        {/* <Testimonials /> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default Landing;
