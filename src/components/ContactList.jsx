import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors, sizes } from "../constants";
import { Feather } from "@expo/vector-icons";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const ContactList = ({ phoneNumber, index, name, item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)} key={item.id}>
      <View className="flex-row justify-between items-center p-3  ">
        <View className="flex-row items-center gap-3">
          <Image
            source={{
              uri:
                item?.image ||
                "https://upload.wikimedia.org/wikipedia/en/2/21/Web_of_Spider-Man_Vol_1_129-1.png",
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
          <View className="flex-col  items-start flex justify-start ">
            <Text className="text-white text-sm font-medium">{name}</Text>
            <Text
              className="text-white  font-light"
              style={{ fontSize: sizes.small }}
            >
              {phoneNumber}
            </Text>
          </View>
        </View>

        <Feather name="chevron-right" size={24} color={colors.lightwhite} />
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
    </TouchableOpacity>
  );
};

export default ContactList;

const styles = StyleSheet.create({});
