import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Button } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  initialLocation?: { latitude: number; longitude: number };
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
  onLocationSelect,
  initialLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setSelectedLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        onLocationSelect({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        // If fetching user location fails, set the location to the city center of Damascus, Syria
        setSelectedLocation({
          latitude: 33.5138,
          longitude: 36.2765,
        });
        onLocationSelect({
          latitude: 33.5138,
          longitude: 36.2765,
        });
        console.error("Error fetching user location:", error);
      }
    };

    fetchUserLocation();
  }, []);

  const onMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
    onLocationSelect(coordinate);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => onClose()}
    >
      <View style={styles.container}>
        <MapView
          style={styles.map}
          onPress={onMapPress}
          initialRegion={{
            latitude: selectedLocation ? selectedLocation.latitude : 33.5138,
            longitude: selectedLocation ? selectedLocation.longitude : 36.2765,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
        >
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
    width: "100%",
  },
});

export default LocationPickerModal;
