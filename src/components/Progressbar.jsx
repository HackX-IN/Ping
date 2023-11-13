import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Rect, Svg } from "react-native-svg";

const Progressbar = ({ progress }) => {
  const BarWidth = 230;
  const progressWidth = (progress / BarWidth) * 100;
  return (
    <View>
      <Svg width={BarWidth} height={"7"}>
        <Rect
          width={BarWidth}
          height={"100%"}
          fill={"#eee"}
          rx={3.5}
          ry={3.5}
        />
        <Rect width={progressWidth} height={"100%"} fill={"#3478f6"} />
      </Svg>
    </View>
  );
};

export default Progressbar;

const styles = StyleSheet.create({});
