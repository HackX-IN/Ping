import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { sizes, colors } from "../constants/index.tsx";
import { Audio } from "expo-av";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const ChatFooter = React.memo(
  ({
    message,
    setMessage,
    activeState,
    setActiveState,
    onSend,
    pickImage,
    recording,
    setRecording,
    startRecording,
    stopRecording,
  }) => {
    return (
      <>
        <View
          style={{
            position: "absolute",
            bottom: heightPercentageToDP(0),
            width: widthPercentageToDP(100),
            padding: sizes.medium,
            backgroundColor: colors.bginput,
            left: heightPercentageToDP(1),
            flexDirection: "row",
            alignItems: "center",
            gap: sizes.xxsmall,
            zIndex: 5,
            paddingVertical: 12,
          }}
        >
          <Animated.View
            style={{
              width:
                message.length > 0
                  ? widthPercentageToDP(80)
                  : widthPercentageToDP(70),
              fontSize: heightPercentageToDP(1.9),
              fontWeight: "400",
              color: colors.black,
              backgroundColor: colors.white,
              padding: sizes.xxsmall,
              borderRadius: sizes.large,
            }}
          >
            <TextInput
              placeholder="Type Your message"
              placeholderTextColor={colors.lightwhite}
              multiline={true}
              value={message}
              onChangeText={setMessage}
            />
          </Animated.View>
          {message.length === 0 && (
            <>
              <TouchableOpacity
                onPress={() => pickImage()}
                style={{
                  backgroundColor: colors.primary,
                  padding: sizes.padding,
                  borderRadius: sizes.large,
                }}
              >
                <Feather name="camera" size={22} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={recording ? stopRecording : startRecording}
                style={{
                  backgroundColor: colors.primary,
                  padding: sizes.padding,
                  borderRadius: sizes.large,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {recording ? (
                  <Feather name="stop-circle" size={22} color={colors.white} />
                ) : (
                  <Feather name="mic" size={22} color={colors.white} />
                )}
              </TouchableOpacity>
            </>
          )}
          {message.length > 0 && (
            <TouchableOpacity
              onPress={() => onSend()}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.primary,
                padding: sizes.xxsmall,
                borderRadius: sizes.large,
              }}
            >
              <Feather
                name="send"
                size={sizes.subHeading}
                color={colors.white}
                style={{ top: 1, right: 1 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }
);

export default ChatFooter;
