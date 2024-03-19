import React, { useRef, useEffect } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const CustomLoading = ({ style }: any) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.activityIndicator}>
      <Animated.Image
        source={require("../assets/loading.png")}
        style={[styles.image, style, { transform: [{ rotate: spin }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomLoading;
