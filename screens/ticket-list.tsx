import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import TicketCard from "../components/ticket-card";
import { FAB } from "react-native-paper";
import CustomHeader from "../components/custom-header";

interface Props {
  navigation: any;
}

const TicketList: React.FC<Props> = ({ navigation }) => {
  const tickets = [
    {
      id: 1,
      title: "Concert Ticket",
      subTitle: "Music Event",
      description:
        "Join us for an amazing night of live music and entertainment!",
      avatarImage: "https://example.com/avatar1.jpg",
    },
    {
      id: 2,
      title: "Movie Ticket",
      subTitle: "Cinema Experience",
      description:
        "Experience the latest blockbuster in stunning high definition!",
      avatarImage: "https://example.com/avatar2.jpg",
    },
    {
      id: 3,
      title: "Sporting Event Ticket",
      subTitle: "Live Game",
      description:
        "Cheer for your favorite team in a thrilling live sports event!",
      avatarImage: "https://example.com/avatar3.jpg",
    },
    {
      id: 4,
      title: "Sporting Event Ticket",
      subTitle: "Live Game",
      description:
        "Cheer for your favorite team in a thrilling live sports event!",
      avatarImage: "https://example.com/avatar3.jpg",
    },
  ];

  const addTicket = () => {
    // Implement the functionality to add tickets
    console.log("Add ticket button pressed");
    navigation.navigate("add-ticket");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <CustomHeader />
        <View style={styles.container}>
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              title={ticket.title}
              subTitle={ticket.subTitle}
              description={ticket.description}
              avatarImage={ticket.avatarImage}
              onPress={() => console.log(`Ticket ${ticket.id} pressed`)}
            />
          ))}
        </View>
      </ScrollView>
      <FAB style={styles.fab} icon="plus" onPress={addTicket} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TicketList;
