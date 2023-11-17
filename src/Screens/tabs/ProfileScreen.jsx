import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colors, sizes } from "../../constants";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { firebase } from "@react-native-firebase/database";
import { databaseUrl } from "../../utils/Data";
import SimpleToast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({ route, navigation }) => {
  const { user, Name } = route.params;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [update, setUpdate] = useState(false);

  const [showPassword, SetShowPassword] = useState(false);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Check if at least one field is filled without spaces
      if (!(name.trim() || email.trim() || password.trim())) {
        SimpleToast.show("Please enter at least one field!");
        setLoading(false);
        return false;
      }
      if (!/[A-Z]/.test(password)) {
        SimpleToast.show(
          "Password must contain at least one uppercase letter!"
        );
        setLoading(false);
        return;
      }

      const updatedUser = {
        id: user?.id,
        name: name.length > 0 ? name : user?.name,
        emailId: email.length > 0 ? email.toLowerCase() : user?.emailId,
        password: password.length > 0 ? password : user?.password,
        number: user?.number,
        image: img !== null ? img : user?.image,
        token: user?.token,
      };

      await firebase
        .app()
        .database(databaseUrl)
        .ref(`users/${user?.id}`)
        .update(updatedUser);

      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

      const allReceivers = await fetchAllReceivers();

      // Update chat list entries for all receivers
      const chatListRef = firebase.app().database(databaseUrl).ref("/chatlist");

      for (const receiverData of allReceivers) {
        const receiverChatListUpdate = {
          name: name.length > 0 ? name : user?.name,
          emailId: email.length > 0 ? email.toLowerCase() : user?.emailId,
        };

        await chatListRef
          .child(`${receiverData.id}/${user.id}`)
          .update(receiverChatListUpdate);
      }

      SimpleToast.show("Updated Successfully !");
      setEmail("");
      setPassword("");
      setName("");
      setLoading(false);
      setUpdate(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const OnUpdate = () => {
    setUpdate(!update);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access media library is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result;

      uploadImage(uri);
    }
  };
  const uploadImage = async (uri) => {
    try {
      setLoading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const imageId = uuid.v4();

      const imageRef = storage().ref().child(`usersprofilepic/${imageId}`);

      await imageRef.put(blob);

      const downloadURL = await imageRef.getDownloadURL();
      setImg(downloadURL);
      setLoading(false);

      console.log("Download URL:", downloadURL);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllReceivers = () => {
    return new Promise((resolve, reject) => {
      firebase
        .app()
        .database(databaseUrl)
        .ref("/chatlist/" + user.id)
        .once("value")
        .then((snapshot) => {
          const receivers = [];
          snapshot.forEach((childSnapshot) => {
            const receiverData = childSnapshot.val();
            receivers.push(receiverData);
          });
          resolve(receivers);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: colors.gray,
      }}
    >
      <LinearGradient colors={[colors.bg, colors.black]} className="flex-1">
        <LinearGradient
          start={[(x = 0.5), (y = 0.5)]}
          colors={[colors.purple, colors.primary]}
          className="h-[250] w-[100%]"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 top-8 absolute"
          >
            <Ionicons
              name="arrow-back"
              size={sizes.avatar}
              color={colors.white}
            />
          </TouchableOpacity>
        </LinearGradient>
        <View className="justify-center items-center p-1 bottom-14">
          {update ? (
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{
                  uri: img
                    ? img
                    : "https://cdn-icons-png.flaticon.com/128/10152/10152423.png",
                }}
                style={{
                  height: widthPercentageToDP(26),
                  width: widthPercentageToDP(26),
                  borderRadius: widthPercentageToDP(13),
                }}
              />
            </TouchableOpacity>
          ) : (
            <View
              style={{
                borderWidth: 3,
                borderColor: colors.white,
                borderRadius: sizes.borderRadius,
              }}
            >
              <Image
                source={{ uri: user.image }}
                style={{
                  height: widthPercentageToDP(26),
                  width: widthPercentageToDP(26),
                  borderRadius: widthPercentageToDP(13),
                }}
              />
            </View>
          )}

          {!update && (
            <Text className="text-white font-bold text-lg pt-1  ">
              {user?.name}
            </Text>
          )}
          {Name === "Profile" && (
            <>
              {!update && (
                <TouchableOpacity
                  className="bg-emerald-400 p-2 rounded-md mt-2 "
                  onPress={OnUpdate}
                >
                  <Text className="text-md text-white font-semibold">
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
        {!update ? (
          <ScrollView
            className="p-2 flex "
            contentContainerStyle={{ paddingBottom: heightPercentageToDP(2) }}
          >
            <Text className="text-purple-300 text-base font-semibold ">Id</Text>
            <Text
              style={{ borderBottomWidth: 0.4 }}
              className="text-white text-base font-bold pt-1 pb-2  border-gray-500 "
            >
              {user?.id.slice(0, 4)}
            </Text>
            <Text className="text-purple-300 text-base font-semibold pt-1">
              Name
            </Text>
            <Text
              style={{ borderBottomWidth: 0.4 }}
              className="text-white text-base font-bold pt-1 pb-2  border-gray-500 "
            >
              {user?.name}
            </Text>
            <Text className="text-purple-300 text-base font-semibold mt-4 ">
              Email
            </Text>
            <Text
              style={{ borderBottomWidth: 0.4 }}
              className="text-white text-base font-bold pt-1 pb-2  border-gray-500 "
            >
              {user?.emailId}
            </Text>
            {Name === "Profile" && (
              <>
                <Text className="text-purple-300 text-base font-semibold mt-4 ">
                  Password
                </Text>
                <View
                  style={{ borderBottomWidth: 0.4 }}
                  className="flex-row justify-between items-center pt-1 pb-2  border-gray-500"
                >
                  <Text className="text-white text-base font-bold  ">
                    {showPassword ? user?.password : "********"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => SetShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      color={colors.white}
                      size={sizes.large}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
            <Text className="text-purple-300 text-base font-semibold mt-4 ">
              Mobile No
            </Text>
            <Text
              style={{ borderBottomWidth: 0.4 }}
              className="text-white text-base font-bold pt-1 pb-2  border-gray-500 "
            >
              {user?.number}
            </Text>
          </ScrollView>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView>
              <View className="p-2">
                <Text className="text-purple-300 text-base font-semibold pt-1">
                  Name
                </Text>
                <TextInput
                  placeholder="Edit your Name"
                  placeholderTextColor={colors.white}
                  value={name}
                  onChangeText={setName}
                  style={{ borderBottomWidth: 0.4 }}
                  className="text-white text-base font-bold pt-1 pb-2  border-gray-500 "
                />
                <Text className="text-purple-300 text-base font-semibold pt-1">
                  Email
                </Text>
                <TextInput
                  placeholder="Edit your email"
                  placeholderTextColor={colors.white}
                  value={email}
                  onChangeText={setEmail}
                  style={{ borderBottomWidth: 0.4 }}
                  className="text-white text-base font-bold pt-1 pb-2  border-gray-500 "
                />
                <Text className="text-purple-300 text-base font-semibold pt-1">
                  Password
                </Text>
                <TextInput
                  placeholder="Edit your Password"
                  placeholderTextColor={colors.white}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={{ borderBottomWidth: 0.4 }}
                  className="text-white text-base font-bold pt-1 pb-2  border-gray-500 "
                />
                <TouchableOpacity
                  onPress={handleUpdate}
                  className="justify-center mt-6 items-center bg-sky-500 rounded-lg p-2"
                >
                  {loading ? (
                    <ActivityIndicator
                      size={sizes.extraLarge}
                      color={colors.white}
                    />
                  ) : (
                    <Text className="text-base font-bold text-black">
                      Update Profile
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
