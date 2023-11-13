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
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Customheader from "../../components/Customheader";
import { colors, sizes } from "../../constants";
import ChatListItem from "../../components/ChatListItem";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Data } from "../../constants/Data";
import { firebase } from "@react-native-firebase/database";
import { databaseUrl } from "../../utils/Data";
import { useUserContext } from "../../Hooks/UserApi";
import { useFocusEffect } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [originalChatList, setOriginalChatList] = useState([]);
  const [chatList, setchatList] = useState([]);

  const { setUserData, user, lastMessage, lastMessageType, lastSentTime } =
    useUserContext();
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getChatlist();
  }, [chatList]);
  // console.log(chatList);

  // useEffect(() => {
  //   if (chatList.length > 0) {
  //     chatList.forEach((chatListItem) => {
  //       let chatListupdate = {
  //         lastMsg: lastMessage,
  //         sendTime: lastSentTime,
  //         msgType: lastMessageType,
  //       };

  //       firebase
  //         .app()
  //         .database(databaseUrl)
  //         .ref("/chatlist/" + RecieverId + "/" + user?.id)
  //         .update(chatListupdate)
  //         .then(() => console.log("Data updated."));
  //     });
  //   }
  // }, [lastMessage, lastMessageType, lastSentTime, chatList, user]);

  const getChatlist = async () => {
    firebase
      .app()
      .database(databaseUrl)
      .ref("/chatlist/" + user?.id)
      .on("value", (snapshot) => {
        if (snapshot.val() != null) {
          const chatListData = Object.values(snapshot.val());

          // Sort the chat list based on the sendTime property in descending order
          const sortedChatList = chatListData.sort((a, b) => {
            const timeA = new Date(a.sendTime).getTime();
            const timeB = new Date(b.sendTime).getTime();
            return timeB - timeA;
          });

          setOriginalChatList(sortedChatList);
          setchatList(sortedChatList);
        }
      });
  };

  // const handleSearch = () => {
  //   const filteredChatList = originalChatList.filter((item) => {
  //     const lowercasedName = item.name.toLowerCase();
  //     return lowercasedName.startsWith(searchText.toLowerCase());
  //   });

  //   setchatList(filteredChatList);
  //   setSearchText("");
  //   setIsSearching(false);
  // };

  const SearchToggle = () => {
    // setIsSearching(!isSearching);
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
          // icon2="search"
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
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <View style={styles.emptyChatContainer}>
              <LottieView
                source={require("../../assets/images/chat.json")}
                style={styles.emptyImage}
                autoPlay
                loop
              />
              <Text style={styles.emptyText}>No Chats Yet 😔</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("All")}
              >
                <Text style={styles.addButtonText}>Connect with Friends</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item, index }) => (
            <ChatListItem key={index} item={item} index={index} />
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  emptyChatContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: heightPercentageToDP(8),
  },
  emptyImage: {
    width: widthPercentageToDP(40),
    height: widthPercentageToDP(40),
    resizeMode: "contain",
    marginBottom: heightPercentageToDP(2),
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: heightPercentageToDP(2),
  },
  addButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: heightPercentageToDP(2),
    elevation: 3, // For a subtle shadow on Android
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
  },
});
