import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  Directions,
  FlingGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useUserContext } from "../Hooks/UserApi";
import { colors, sizes } from "../constants";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const MessageComponent = ({
  item: msg,
  index,
  onActiveState,
  activeState,
  setActiveState,
}) => {
  const { setUserData, user, updateLastMessage } = useUserContext();
  const messageDirection =
    msg.from === user.id ? Directions.LEFT : Directions.RIGHT;
  let startingPoint = 0;
  const x = useSharedValue(startingPoint);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {},
    onActive: (event, ctx) => {
      x.value = msg.from === user.id ? 60 : -60;
    },
    onEnd: (event, ctx) => {
      x.value = withSpring(startingPoint);
    },
  });

  const AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }],
    };
  });

  return (
    <>
      {/* {activeState && (
        <View
          style={{
            position: "absolute",
            width: widthPercentageToDP(100),
            padding: sizes.large,
            backgroundColor: colors.bginput,
            bottom: widthPercentageToDP(18.3),
            left: heightPercentageToDP(1),
            borderTopLeftRadius: heightPercentageToDP(2),
            borderTopRightRadius: heightPercentageToDP(2),
            borderBottomWidth: 1,
            borderBottomColor: colors.white,
          }}
        >
          <View className="flex flex-row justify-between items-center px-2">
            <Text>{msg.message}</Text>
          </View>
        </View>
      )} */}
      <FlingGestureHandler
        direction={messageDirection}
        onGestureEvent={gestureHandler}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            onActiveState();
          }
        }}
      >
        <Animated.View
          key={index}
          style={[
            styles.messageBubble,
            msg.from === user.id ? styles.senderBubble : styles.receiverBubble,
            AnimatedStyle,
          ]}
        >
          {msg.msgType === "text" && (
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: heightPercentageToDP(1.9),
                }}
              >
                {msg.message}
              </Text>
              <Text
                style={{
                  color: colors.white,
                  fontSize: heightPercentageToDP(1.4),
                  textAlign: "right",
                }}
              >
                {msg.sendTime}
              </Text>
            </View>
          )}
          {msg.msgType === "image" && (
            <View>
              <Image source={{ uri: msg.message }} style={styles.profilePic} />
              <Text
                style={{
                  color: colors.white,
                  fontSize: heightPercentageToDP(1.4),
                  textAlign: "right",
                  paddingTop: 5,
                }}
              >
                {msg.sendTime}
              </Text>
            </View>
          )}
          {msg.msgType === "audio" && (
            <View>
              <TouchableOpacity
                onPress={() => playAudio(msg?.message)}
                style={{
                  backgroundColor: colors.primary,
                  padding: sizes.padding,
                  borderRadius: sizes.large,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <Feather
                  name={isPlaying ? "pause-circle" : "play-circle"}
                  size={22}
                  color={colors.white}
                />
                {/* <Progressbar progress={audioDuration} /> */}
                {audioDuration > 0 && (
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: heightPercentageToDP(1.4),
                      textAlign: "left",
                    }}
                  >
                    {audioDuration.toFixed() + ".0"}
                  </Text>
                )}
              </TouchableOpacity>

              <Text
                style={{
                  color: colors.white,
                  fontSize: heightPercentageToDP(1.4),
                  textAlign: "right",
                  paddingTop: 5,
                }}
              >
                {msg.sendTime}
              </Text>
            </View>
          )}
        </Animated.View>
      </FlingGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: sizes.medium,
    paddingVertical: heightPercentageToDP(8),
  },
  messageBubble: {
    padding: sizes.xxsmall,
    borderRadius: sizes.xxsmall,
    marginBottom: sizes.xxsmall,
    maxWidth: widthPercentageToDP(70),
    flexDirection: "row",
  },
  senderBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.blue,
  },
  receiverBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.lightwhite,
  },
  profilePic: {
    width: widthPercentageToDP(50),
    height: widthPercentageToDP(50),
    resizeMode: "cover",
  },
  audioContainer: {
    backgroundColor: colors.primary,
    padding: sizes.padding,
    borderRadius: sizes.large,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
});

export default MessageComponent;
