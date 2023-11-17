import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors, sizes } from "../constants";
import SimpleToast from "react-native-simple-toast";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const FullscreenImage = ({ route, navigation }) => {
  const { image } = route.params;
  console.log(
    "🚀 ~ file: FullscreenImage.jsx:6 ~ FullscreenImage ~ image:",
    image
  );

  const saveImageToGallery = async (imageUri) => {
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        throw new Error("MediaLibrary permission not granted");
      }

      const { uri } = await FileSystem.downloadAsync(
        imageUri,
        FileSystem.cacheDirectory + "image.jpg"
      );

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Ping", asset, false);

      SimpleToast.show("Image saved to gallery");
    } catch (error) {
      console.error("Error saving image to gallery", error);
      SimpleToast.show("Error saving image to gallery");
    } finally {
      // navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="arrow-left"
            size={sizes.heading}
            color={colors.white}
            style={{ marginRight: sizes.medium, marginTop: sizes.heading }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => saveImageToGallery(image)}>
          <Feather
            name="download"
            size={sizes.heading}
            color={colors.white}
            style={{ marginTop: sizes.heading }}
          />
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: image }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="contain"
      />
    </View>
  );
};

export default FullscreenImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  top: {
    position: "absolute",
    top: 0,
    backgroundColor: "rgba(255,255,255,0.1)",
    height: heightPercentageToDP(9),
    width: widthPercentageToDP(100),
    padding: sizes.xxsmall,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
