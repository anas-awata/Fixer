import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, BarCodeSettings } from "expo-camera";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal, Text } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import { StaffMarkAsPaid } from "../../services/service";
import { BarCodeScanner } from "expo-barcode-scanner";

interface Props {
  visible: boolean;
  onClose: () => void;
  id: number;
  navigation: any;
}

const QrCodeScannerModal = ({ visible, onClose, id, navigation }: Props) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const queryClient = useQueryClient();
  //mark ticket as paid
  const {
    mutate: markAsPaid,
    isPending: isPendingPaid,
    error: isErrorPAid,
  } = useMutation({
    mutationFn: StaffMarkAsPaid,
    onSuccess: (data) => {
      navigation.navigate("myTickets");
      queryClient.invalidateQueries({
        queryKey: ["get-staff-available-services"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-staff-assigned-services"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-user-service-by-id"],
      });
      Toast.show({
        type: "success",
        text1: "Service Marked As Paid successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "The Qr Code Is Wrong , Check the Qr Code and try again",
      });
      onClose();
    },
  });

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    markAsPaid({ id: id, paycode: data });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {!isPendingPaid ? (
            <Camera
              onBarCodeScanned={handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
              barCodeScannerSettings={{
                barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
              }}
            />
          ) : (
            <ActivityIndicator size={100} />
          )}
        </View>
        <Button
          onPress={() => {
            onClose();
          }}
          mode="contained"
          style={{ marginTop: 10, width: "90%" }}
        >
          Cancel
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
    gap: 50,
    flex: 0.7,
    justifyContent: "center",
  },
});

export default QrCodeScannerModal;
