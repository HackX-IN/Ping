import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors, sizes } from "../constants";
import { Feather } from "@expo/vector-icons";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const Callsitem = ({ item, index }) => {
  // console.log(item);
  return (
    <View>
      <View className="flex-row justify-between items-center p-3  ">
        <View className="flex-row items-center gap-3">
          <Image
            source={{
              uri: item?.userImage,
            }}
            style={{
              width: sizes.ImageSize,
              height: sizes.ImageSize,
              borderRadius: sizes.ImageSize / 2,
              resizeMode: "cover",
            }}
          />

          <View className="flex-col  items-start flex justify-start ">
            <Text className="text-white text-sm font-medium">{item.name}</Text>
            <Text
              className="text-white  font-light"
              style={{ fontSize: sizes.small }}
            >
              {item.phoneNumber}
            </Text>
          </View>
        </View>
        {item?.type === "OUTGOING" ? (
          <Feather name="arrow-up-right" size={24} color={colors.pink} />
        ) : (
          <Feather name="arrow-down-left" size={24} color={colors.green} />
        )}
      </View>
      <View
        style={{
          width: widthPercentageToDP(80),
          borderBottomColor: colors.lightwhite,
          borderBottomWidth: 0.3,
          left: heightPercentageToDP(8),
          marginBottom: heightPercentageToDP(2),
        }}
      />
    </View>
  );
};

export default Callsitem;

const styles = StyleSheet.create({});
