import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/settings/Navigation";
import { StatusBar } from "expo-status-bar";

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Navigation />
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
