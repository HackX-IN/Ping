import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/settings/Navigation";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "./src/Hooks/UserApi";

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <UserProvider>
        <Navigation />
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
