import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BlurView } from "@react-native-community/blur";
import { Video } from "expo-av";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { colors, sizes } from "../constants";
import Progressbar from "./Progressbar";

const Uploading = ({ image, video, audio, progress }) => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { justifyContent: "center", alignItems: "center", zIndex: 1 },
      ]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="materialDark"
      ></BlurView>
      <View
        style={{
          backgroundColor: "#d3d3d3",
          alignItems: "center",
          width: widthPercentageToDP(70),
          paddingVertical: 16,
          borderRadius: 14,
          rowGap: 12,
        }}
      >
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: widthPercentageToDP(20),
              height: widthPercentageToDP(20),
              resizeMode: "contain",
              borderRadius: sizes.padding,
              marginBottom: sizes.small,
            }}
          />
        )}
        {video && (
          <Video
            style={{
              width: widthPercentageToDP(25),
              height: widthPercentageToDP(25),
              marginBottom: sizes.small,
            }}
            source={{
              uri: video,
            }}
            resizeMode="contain"
            volume={1.0}
            isMuted={false}
          />
        )}
        <Text
          style={{
            fontSize: sizes.medium,
            color: colors.black,
            fontWeight: "600",
          }}
        >
          Sending...
        </Text>
        <Progressbar progress={progress} />
      </View>
    </View>
  );
};

export default Uploading;

const styles = StyleSheet.create({});

{
  /* {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: widthPercentageToDP(20),
            height: widthPercentageToDP(20),
            resizeMode: "contain",
            borderRadius: sizes.padding,
            marginBottom: sizes.small,
          }}
        />
      )}
      {video && (
        <Video
          style={{
            width: widthPercentageToDP(25),
            height: widthPercentageToDP(25),
            marginBottom: sizes.small,
          }}
          source={{
            uri: video,
          }}
          resizeMode="contain"
          volume={1.0}
          isMuted={false}
        />
      )}
      <Text
        style={{
          fontSize: sizes.medium,
          color: colors.black,
          fontWeight: "600",
        }}
      >
        Sending...
      </Text>
      <Progressbar progress={progress} /> */
}
{
  /* <View
        style={{
          height: 1,
          borderWidth: StyleSheet.hairlineWidth,
          width: "70%",
          borderColor: "#000",
        }}
      />
      <TouchableOpacity
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ fontSize: 16, color: "blue", fontWeight: "bold" }}>
          Cancel
        </Text>
      </TouchableOpacity> */
}
