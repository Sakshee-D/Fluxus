import React from "react";
import { View, Text, Button, StyleSheet, Platform } from "react-native";
import { useNavigate } from "react-router-native";
import { WebView } from "react-native-webview";

export default function LandingScreen() {
  const navigate = useNavigate();
  const splineURL =
    "https://my.spline.design/thedriveanimated-e12e98ddfc0c7842eccde4b52524025f/";

  return (
    <View style={styles.container}>
      {/* 3D Spline Model */}
      {Platform.OS === "web" ? (
        <View style={styles.iframeContainer}>
          <iframe
            src={splineURL}
            width="100%"
            height="100%"
            style={styles.iframe}
          />
        </View>
      ) : (
        <WebView source={{ uri: splineURL }} style={styles.spline} />
      )}

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome to Flux Ride</Text>

      {/* Buttons */}
      <Button title="Login" onPress={() => navigate("/login")} />
      <Button title="Create Account" onPress={() => navigate("/register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "navy",
  },
  iframeContainer: {
    width: "100%",
    height: "60vh", // Responsive height
    marginBottom: 20,
  },
  iframe: {
    border: "none",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "lightgray",
    marginVertical: 20,
  },
  spline: {
    width: "100%",
    height: "60%",
    marginBottom: 20,
  },
});