import React, { useState } from "react";
import { View, StyleSheet, Modal, Text } from "react-native";
import { Button } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";

interface Props {
  visible: boolean;
  onClose: () => void;
  value: string;
}

const QrCodeGeneratorModal = ({ visible, onClose, value }: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>
            Make the Worker Scan The Qr code for the payment to complete
          </Text>
          <QRCode value={value} size={200} />
          <Button
            onPress={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
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
    gap: 50,
  },
});

export default QrCodeGeneratorModal;
