import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onRate: Function;
}

const StarRatingModal = ({ visible, onClose, onRate }: Props) => {
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
          <Button
            title="SUbmit Rating"
            onPress={() => {
              onRate(rating);
              onClose();
            }}
          />
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
