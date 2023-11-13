import React, { useEffect, useState } from "react";
import {
  useNavigation,
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, sizes } from "../constants";
import { useUserContext } from "../Hooks/UserApi";
import ZegoUIKitPrebuiltCallService, {
  ZegoSendCallInvitationButton,
  ZegoMenuBarButtonName,
} from "@zegocloud/zego-uikit-prebuilt-call-rn";
import { APPID, APPSIGN } from "../utils/Data";
import * as ZIM from "zego-zim-react-native";
import * as ZPNs from "zego-zpns-react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ChatCustomHeader = React.memo(
  ({ text, icon1, icon2, onpress, item, navigation }) => {
    const { setUserData, user } = useUserContext();
    // const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    // console.log(item);

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
          requireConfig: (data) => {
            return {
              durationConfig: {
                isVisible: true,
                onDurationUpdate: (duration) => {
                  console.log("duration", duration);
                },
              },
              topMenuBarConfig: {
                buttons: [ZegoMenuBarButtonName.minimizingButton],
              },
              onWindowMinimized: () => {
                navigation.navigate("HomeScreen");
              },
              onWindowMaximized: () => {
                navigation.navigate("ZegoUIKitPrebuiltCallInCallScreen");
              },
            };
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
          backgroundColor: colors.gray,
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
              color={
                icon1 === "chevron-left" ? colors.white : colors.lightwhite
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", { user: item, Name: "Chat" })
            }
            className="items-center gap-2"
          >
            <Image
              source={{ uri: item?.image }}
              style={{ width: wp(10), height: wp(10), borderRadius: wp(5) }}
            />
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
          </TouchableOpacity>
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
                padding: sizes.button,
                rowGap: 6,
              }}
            >
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
            </View>
          </View>
        </Modal>
      </View>
    );
  }
);

export default ChatCustomHeader;

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
