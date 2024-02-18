import * as React from "react";
import { View, StyleSheet } from "react-native";

import StaffAvailableServicesList from "../../components/staff/staff-available-services-list";
import StaffMyTickitsList from "../../components/staff/staff-my-tickits-list";

interface Props {
  navigation: any;
}

const StaffMyTickets: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <StaffMyTickitsList navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default StaffMyTickets;
