import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library"; // Import MediaLibrary
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useFocusEffect, useNavigation } from "@react-navigation/core";

const CameraScreen = () => {
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      console.error("Camera permission not granted");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      base64: true,

      preferredAssetRepresentationMode:
        (ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Automatic =
          "automatic"),
    });

    if (!result.canceled) {
      setImage(result.uri);
      saveImageToGallery(result.uri);
    } else {
      setImage(null);
      navigation.navigate("Home");
    }
  };

  const saveImageToGallery = async (imageUri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(imageUri);
      await MediaLibrary.createAlbumAsync("Ping", asset, false);
      console.log("Image saved to gallery");
      setImage(null);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error saving image to gallery", error);
    }
  };

  useFocusEffect(() => {
    pickImage();
  });

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.bg, colors.black]}
        style={{ flex: 1 }}
      ></LinearGradient>
      {/* {image && <Image source={{ uri: image }} style={{ flex: 1 }} />} */}
      {/* Optionally display the captured image */}
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({});
