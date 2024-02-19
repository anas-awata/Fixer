import * as React from "react";
import { View, StyleSheet } from "react-native";

import StaffAvailableServicesList from "../../components/staff/staff-available-services-list";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WorkerAssignedTicketList from "../../components/workers/worker-assigned-ticket-list";

interface Props {
  navigation: any;
}

const StaffLanding: React.FC<Props> = ({ navigation }) => {
  //check if Supervisor
  const [isSupervisor, setIsSupervisor] = useState(false);

  AsyncStorage.getItem("user")
    .then((user) => {
      const parsedUser = JSON.parse(user!);
      setIsSupervisor(parsedUser?.is_supervisor || false);
    })
    .catch((error) => {
      console.error("Error retrieving user:", error);
    });
  return (
    <View style={{ flex: 1 }}>
      {isSupervisor ? (
        <StaffAvailableServicesList navigation={navigation} />
      ) : (
        <WorkerAssignedTicketList navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default StaffLanding;
