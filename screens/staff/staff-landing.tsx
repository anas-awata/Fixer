import * as React from "react";
import { View, StyleSheet } from "react-native";

import StaffAvailableServicesList from "../../components/staff/staff-available-services-list";

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
