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

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const ChatFooter = ({
  message,
  setMessage,
  showEmoji,
  setShowEmoji,
  onSend,
  pickImage,
  recording,
  startRecording,
  stopRecording,
}) => {
  return (
    <>
      <View
        style={{
          position: "absolute",
          bottom: heightPercentageToDP(0),
          width: widthPercentageToDP(95),
          padding: sizes.medium,
          backgroundColor: colors.bginput,
          left: heightPercentageToDP(1),
          borderRadius: sizes.thumbnail / 2,
          flexDirection: "row",
          alignItems: "center",
          gap: sizes.xxsmall,
          zIndex: 5,
        }}
      >
        <TouchableOpacity onPress={() => setShowEmoji(!showEmoji)}>
          <Entypo name="emoji-happy" size={20} color={colors.lightwhite} />
        </TouchableOpacity>

        <TextInput
          placeholder="Type Your message"
          placeholderTextColor={colors.lightwhite}
          style={{
            width: widthPercentageToDP(60),
            fontSize: heightPercentageToDP(1.9),
            fontWeight: "400",
            color: colors.white,
          }}
          multiline={true}
          value={message}
          onChangeText={setMessage}
        />
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
              left: heightPercentageToDP(5),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="send" size={18} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default ChatFooter;
