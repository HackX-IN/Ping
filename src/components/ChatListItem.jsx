import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors, sizes } from "../constants";
import { Feather } from "@expo/vector-icons";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/core";
import { useUserContext } from "../Hooks/UserApi";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

const ChatListItem = ({ item, index }) => {
  // console.log("Dta odf User", item);
  const navigation = useNavigation();
  const { lastMessage, lastMessageType, lastSentTime } = useUserContext();
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <TouchableOpacity
      key={item.id}
      onPress={() => navigation.navigate("Chat", { receiverData: item })}
    >
      <Animated.View
        className="flex-row justify-between items-center p-3 mb-2 "
        entering={FadeInUp.delay(index * 100)
          .springify()
          .easing(Easing.in)}
      >
        <View className="flex-row items-center gap-3">
          <Image
            source={{
              uri: item?.image
                ? item?.image
                : "data:image/jpeg;base64,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",
            }}
            style={{
              width: sizes.ImageSize,
              height: sizes.ImageSize,
              borderRadius: sizes.ImageSize / 2,
              resizeMode: "cover",
            }}
          />
          {/* <View
            style={{
              width: sizes.xtrasmall,
              height: sizes.xtrasmall,
              borderRadius: sizes.xtrasmall / 2,
              backgroundColor: colors.green,
              position: "absolute",
              bottom: 0,
              left: widthPercentageToDP(9),
            }}
          /> */}
          {lastMessage || lastMessageType ? (
            <View className="flex-col  items-start flex justify-start ">
              <Text className="text-white text-sm font-medium">
                {" "}
                {item.name}
              </Text>
              <Text
                className="text-white  font-light"
                style={{ fontSize: sizes.small }}
              >
                {lastMessageType === "image" || item?.msgtype === "image"
                  ? "Image"
                  : lastMessageType === "audio" || item?.msgtype === "audio"
                  ? "audio"
                  : lastMessage || item?.lastMsg}
              </Text>
            </View>
          ) : (
            <View className="items-start flex justify-start ">
              <Text className="text-white text-sm font-medium">
                {item.name}
              </Text>
            </View>
          )}
        </View>
        <Text
          className="text-white  font-light "
          style={{ fontSize: sizes.small }}
        >
          {lastSentTime || item?.sendTime}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({});
