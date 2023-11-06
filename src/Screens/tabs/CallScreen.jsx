import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { colors } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import Customheader from "../../components/Customheader";
import Callsitem from "../../components/Callsitem";
import { Data } from "../../constants/Data";
import { heightPercentageToDP } from "react-native-responsive-screen";

const CallScreen = () => {
  return (
    <SafeAreaView
      className="flex-1"
      style={{
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: colors.gray,
      }}
    >
      <LinearGradient colors={[colors.bg, colors.black]} className="flex-1">
        <Customheader
          text="Calls"
          icon1="square-edit-outline"
          icon2="phone-call"
        />
        <FlatList
          contentContainerStyle={{
            paddingVertical: heightPercentageToDP(2),
            paddingHorizontal: heightPercentageToDP(0.5),
          }}
          data={Data}
          keyExtractor={(item) => item.title}
          renderItem={({ item, index }) => (
            <Callsitem key={index} item={item} index={index} />
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default CallScreen;

const styles = StyleSheet.create({});
