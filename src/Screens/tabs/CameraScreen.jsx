import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
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
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
    if (result.canceled) {
      setImage(null);
      navigation.navigate("Home");
    }
  };

  useFocusEffect(() => {
    pickImage();
  });

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[colors.bg, colors.black]} style={{ flex: 1 }}>
        {/* {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: widthPercentageToDP("100%"),
              height: heightPercentageToDP("100%"),
            }}
          />
        )} */}
      </LinearGradient>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({});
