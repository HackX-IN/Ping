import { useNavigation } from "@react-navigation/native";
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
import { useUserContext } from "../Hooks/UserApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ZegoSendCallInvitationButton } from "@zegocloud/zego-uikit-prebuilt-call-rn";

const Customheader = ({
  text,
  text2,
  image,
  icon1,
  icon2,
  color,
  onpress,
  item,
  SearchToggle,
  ProfileonPress,
}) => {
  const { setUserData, user } = useUserContext();
  const navigation = useNavigation();
  const Logout = async () => {
    await AsyncStorage.removeItem("userData");
    setUserData(null);
    navigation.replace("Auth");
  };
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
          <TouchableOpacity onPress={ProfileonPress} activeOpacity={0.5}>
            <Image
              source={{ uri: image }}
              style={{
                width: widthPercentageToDP(12),
                height: widthPercentageToDP(12),
                resizeMode: "cover",
                borderRadius: widthPercentageToDP(6),
              }}
            />
          </TouchableOpacity>
          <Text className="text-white text-base text-center font-medium">
            {text.toUpperCase()}
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
        <TouchableOpacity onPress={() => Logout()}>
          <Text
            style={{
              fontSize: heightPercentageToDP(1.8),
              color: colors.link,
              fontWeight: "900",
            }}
            className="tracking-wider font-extrabold text-blue-500 selection:text-white"
          >
            {text2}
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          {icon2 === "search" ? (
            <TouchableOpacity onPress={() => SearchToggle()}>
              <Feather
                name={icon2}
                size={21}
                color={color ? colors.lightwhite : colors.link}
              />
            </TouchableOpacity>
          ) : (
            <Feather
              name={icon2}
              size={21}
              color={color ? colors.lightwhite : colors.link}
            />
          )}
        </>
      )}
    </View>
  );
};

export default Customheader;

const styles = StyleSheet.create({});

// //  <ZegoSendCallInvitationButton
// invitees={[{ userID: item?.number, userName: item?.name }]}
// isVideoCall={false}
// resourceID={"zegouikit_call"}
// />
// <ZegoSendCallInvitationButton
// invitees={[{ userID: item?.number, userName: item?.name }]}
// isVideoCall={true}
// resourceID={"zegouikit_call"}
// />
