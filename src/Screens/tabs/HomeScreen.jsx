import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Customheader from "../../components/Customheader";
import { colors, sizes } from "../../constants";
import ChatListItem from "../../components/ChatListItem";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { Data } from "../../constants/Data";
import { firebase } from "@react-native-firebase/database";
import { databaseUrl } from "../../utils/Data";
import { useUserContext } from "../../Hooks/UserApi";
import { useFocusEffect } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";

const HomeScreen = () => {
  const [originalChatList, setOriginalChatList] = useState([]);
  const [chatList, setchatList] = useState([]);

  const { setUserData, user } = useUserContext();
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getChatlist();
  }, [chatList]);

  const getChatlist = async () => {
    firebase
      .app()
      .database(databaseUrl)
      .ref("/chatlist/" + user?.id)
      .on("value", (snapshot) => {
        if (snapshot.val() != null) {
          const chatListData = Object.values(snapshot.val());
          setOriginalChatList(chatListData);
          setchatList(chatListData);
        }
      });
  };

  const handleSearch = () => {
    const lowercaseSearchText = searchText.toLowerCase();
    const filteredChatList = originalChatList.filter((item) => {
      return item.name.toLowerCase().includes(lowercaseSearchText);
    });

    setchatList(filteredChatList);
    setSearchText("");
    setIsSearching(false);
  };

  const SearchToggle = () => {
    setIsSearching(!isSearching);
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
          SearchToggle={SearchToggle}
        />
        {isSearching && (
          <View className="flex-row justify-between items-center w-[90%] bg-white py-2  m-auto mt-2 rounded-xl">
            <TextInput
              placeholder="Search..."
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              className="text-black text-base font-normal w-[80%] px-3 "
            />
            <TouchableOpacity className="mr-2" onPress={handleSearch}>
              <Feather name="search" size={sizes.large} color={colors.link} />
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          contentContainerStyle={{
            paddingVertical: heightPercentageToDP(2),
            paddingHorizontal: heightPercentageToDP(0.5),
          }}
          data={chatList}
          keyExtractor={(item) => item.id.toString()}
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
