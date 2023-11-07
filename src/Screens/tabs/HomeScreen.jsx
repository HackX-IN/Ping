import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Customheader from "../../components/Customheader";
import { colors } from "../../constants";
import ChatListItem from "../../components/ChatListItem";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { Data } from "../../constants/Data";
import { firebase } from "@react-native-firebase/database";
import { databaseUrl } from "../../utils/Data";
import { useUserContext } from "../../Hooks/UserApi";
import { useFocusEffect } from "@react-navigation/core";

const HomeScreen = () => {
  const [chatList, setchatList] = useState([]);
  const { setUserData, user } = useUserContext();

  useFocusEffect(() => {
    getChatlist();
  });

  const getChatlist = async () => {
    firebase
      .app()
      .database(databaseUrl)
      .ref("/chatlist/" + user?.id)
      .on("value", (snapshot) => {
        if (snapshot.val() != null) {
          setchatList(Object.values(snapshot.val()));
        }
      });
  };
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
          data={chatList}
          keyExtractor={(item) => item.title}
          renderItem={({ item, index }) => (
            <ChatListItem key={item.id} item={item} index={index} />
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
