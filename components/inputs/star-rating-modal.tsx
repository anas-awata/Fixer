import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onRate: Function;
  isLoading: boolean;
}

const StarRatingModal = ({ visible, onClose, onRate, isLoading }: Props) => {
  const [rating, setRating] = useState(0);

  const handleRate = (selectedRating: any) => {
    setRating(selectedRating);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRate(index)}
                style={styles.starButton}
              >
                <Icon
                  name={rating >= index ? "star" : "star-outline"}
                  size={40}
                  color={rating >= index ? "#FFD700" : "#ccc"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ gap: 10 }}>
            <Button
              loading={isLoading}
              disabled={isLoading}
              buttonColor="green"
              mode="contained"
              onPress={() => {
                onRate(rating);
              }}
            >
              <Text style={{ color: "white" }}>Submit Your Rating</Text>
            </Button>
            <Button mode="text" onPress={onClose}>
              <Text>Cancel</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  starButton: {
    padding: 5,
  },
});

export default StarRatingModal;
