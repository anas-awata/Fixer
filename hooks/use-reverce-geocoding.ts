import { useState, useEffect } from "react";

const useReverseGeocoding = (
  selectedLocation: {
    latitude: number;
    longitude: number;
  } | null
) => {
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    const reverseGeocode = async () => {
      if (selectedLocation) {
        const { latitude, longitude } = selectedLocation;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          if (data.display_name) {
            setLocationName(data.display_name);
          }
        } catch (error) {
          console.error("Error fetching reverse geocoding data:", error);
        }
      }
    };

    reverseGeocode();
  }, [selectedLocation]);

  return locationName;
};

export default useReverseGeocoding;
