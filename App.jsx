import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/settings/Navigation";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "./src/Hooks/UserApi";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const requestUserPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,

          {
            title: "Notification Permission",
            message:
              "This app needs notification permissions to function properly.",
          }
        );

        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log("Authorization status:", authStatus);
          messaging()
            .getToken()
            .then(async (token) => await AsyncStorage.setItem("Tokens", token));
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

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
