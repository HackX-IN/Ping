import React, { useEffect, useState } from "react";
import {
  useNavigation,
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, sizes } from "../constants";
import { useUserContext } from "../Hooks/UserApi";
import * as ZIM from "zego-zim-react-native";
import * as ZPNs from "zego-zpns-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ZegoUIKitPrebuiltCallService, {
  ZegoSendCallInvitationButton,
} from "@zegocloud/zego-uikit-prebuilt-call-rn";
import { APPID, APPSIGN } from "../utils/Data";

const Customheader = ({
  text,
  text2,
  image,
  icon1,
  icon2,
  color,
  onpress,
  item,
}) => {
  const { setUserData, user } = useUserContext();
  //   const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  console.log(item);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const InitService = () => {
    ZegoUIKitPrebuiltCallService.init(
      APPID,
      APPSIGN,
      user.number.toString(),
      user.name.toString(),
      [ZIM, ZPNs],
      {
        ringtoneConfig: {
          incomingCallFileName: "zego_incoming.mp3",
          outgoingCallFileName: "zego_outgoing.mp3",
        },
        notifyWhenAppRunningInBackgroundOrQuit: true,
        androidNotificationConfig: {
          channelID: "ping_video_call",
          channelName: "ping_video_call",
        },
      }
    );
  };

  useEffect(() => {
    InitService();
  }, []);

  return (
    <View
      style={{
        backgroundColor: colors.lightwhite,
        borderBottomLeftRadius: hp(2.5),
        borderBottomRightRadius: hp(2.5),
        paddingTop: hp(7),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          paddingTop: 20,
        }}
      >
        <TouchableOpacity onPress={onpress}>
          <MaterialCommunityIcons
            name={icon1}
            size={icon1 === "chevron-left" ? 33 : 23}
            color={icon1 === "chevron-left" ? colors.white : colors.lightwhite}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: "white",
            fontSize: sizes.base,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {text}
        </Text>
        <TouchableOpacity onPress={toggleModal}>
          <Entypo name="dots-three-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View
          style={{ position: "absolute", right: hp(3), top: hp(8.5) }}
          onTouchEnd={toggleModal}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: sizes.icon,
              width: wp(40),
              gap: 8,
            }}
          >
            <View className="flex-row gap-2 items-center mb-3">
              <ZegoSendCallInvitationButton
                invitees={[
                  {
                    userID: item?.number.toString(),
                    userName: item?.name.toString(),
                  },
                ]}
                isVideoCall={false}
                resourceID={"ping_data"}
              />
              <Text
                className="text-base font-semibold"
                style={{ color: colors.link }}
              >
                Voice Call
              </Text>
            </View>
            <View className="flex-row gap-2 items-center">
              <ZegoSendCallInvitationButton
                invitees={[
                  {
                    userID: item?.number.toString(),
                    userName: item?.name.toString(),
                  },
                ]}
                isVideoCall={true}
                resourceID={"ping_chat_app"}
              />
              <Text
                className="text-base font-semibold"
                style={{ color: colors.link }}
              >
                Video Call
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Customheader;

const styles = StyleSheet.create({});

{
  /* <View className="flex-row ">
        <ZegoSendCallInvitationButton
          invitees={[{ userID: item?.number, userName: item?.name }]}
          isVideoCall={false}
          resourceID={"zegouikit_call"}
        />
        <ZegoSendCallInvitationButton
          invitees={[{ userID: item?.number, userName: item?.name }]}
          isVideoCall={true}
          resourceID={"zegouikit_call"}
        />
      </View> */
}
