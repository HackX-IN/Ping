import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Customheader from "../../components/Customheader";
import { colors } from "../../constants";
import ChatListItem from "../../components/ChatListItem";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { Data } from "../../constants/Data";

const HomeScreen = () => {
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
          text="Messages"
          icon1="square-edit-outline"
          icon2="search"
          color={colors.lightwhite}
        />
        <FlatList
          contentContainerStyle={{
            paddingVertical: heightPercentageToDP(2),
            paddingHorizontal: heightPercentageToDP(0.5),
          }}
          data={Data}
          keyExtractor={(item) => item.title}
          renderItem={({ item, index }) => (
            <ChatListItem key={index} item={item} index={index} />
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
