import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, sizes } from "../constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

const Customheader = ({ text, text2, image, icon1, icon2, color, onpress }) => {
  return (
    <View
      className=" flex h-28 flex-row justify-between items-center p-3 pt-8 "
      style={{
        backgroundColor: colors.gray,
        borderBottomLeftRadius: hp(2.5),
        borderBottomRightRadius: hp(2.5),
        paddingTop: hp(7),
      }}
    >
      {image ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: sizes.medium,
          }}
        >
          <Image
            source={{ uri: image }}
            style={{
              width: widthPercentageToDP(12),
              height: widthPercentageToDP(12),
            }}
          />
          <Text className="text-white text-base text-center font-medium">
            {text}
          </Text>
        </View>
      ) : (
        <>
          <TouchableOpacity onPress={onpress}>
            <MaterialCommunityIcons
              name={icon1}
              size={icon1 === "chevron-left" ? 33 : 23}
              color={
                icon1 === "chevron-left" ? colors.white : colors.lightwhite
              }
            />
          </TouchableOpacity>
          <Text className="text-white text-base text-center font-medium">
            {text}
          </Text>
        </>
      )}

      {text2 ? (
        <Text
          style={{
            fontSize: heightPercentageToDP(1.8),
            color: colors.link,
            fontWeight: "900",
          }}
        >
          {text2}
        </Text>
      ) : (
        <Feather
          name={icon2}
          size={21}
          color={color ? colors.lightwhite : colors.link}
        />
      )}
    </View>
  );
};

export default Customheader;

const styles = StyleSheet.create({});
