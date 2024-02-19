import * as React from "react";
import { View, StyleSheet } from "react-native";
import StaffMyTicketsList from "../../components/staff/staff-my-tickets-list";


interface Props {
  navigation: any;
}

const StaffMyTickets: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <StaffMyTicketsList navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default StaffMyTickets;
