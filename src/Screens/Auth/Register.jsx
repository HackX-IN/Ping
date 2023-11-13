import React, { useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { colors, sizes } from "../../constants";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import database from "@react-native-firebase/database";
import uuid from "react-native-uuid";
import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "@react-native-firebase/database";
import { databaseUrl } from "../../utils/Data";

import SimpleToast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleImagePick = (uri) => {
    setSelectedImage(uri);
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
      handleImagePick(uri);
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

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const registerUser = async () => {
    try {
      setLoading(true);
      if (
        name === "" ||
        email === "" ||
        password === "" ||
        number === "" ||
        img === null
      ) {
        SimpleToast.show("Fill in all the fields!");
        setLoading(false);
        return false;
      }

      // Email validation
      if (!email.includes("@")) {
        SimpleToast.show("Invalid email format!");
        setLoading(false);
        return;
      }

      // Password validation
      if (!/[A-Z]/.test(password)) {
        SimpleToast.show(
          "Password must contain at least one uppercase letter!"
        );
        setLoading(false);
        return;
      }

      const fcmToken = await AsyncStorage.getItem("Tokens");
      const data = {
        id: uuid.v4(),
        name: name,
        emailId: email.toLowerCase(),
        password: password,
        number: number,
        image: img,
        token: fcmToken,
      };

      const userPath = `/users/${data.id}`;
      const TokenPath = `/tokens/${data.id}`;

      // Check if a user with the same email or phone number already exists
      const userRef = firebase.app().database(databaseUrl).ref("/users");
      userRef
        .orderByChild("emailId")
        .equalTo(email.toLowerCase())
        .once("value", (snapshot) => {
          if (snapshot.exists()) {
            SimpleToast.show("User with the same email already exists!");
            setLoading(false);
            return;
          } else {
            userRef
              .orderByChild("number")
              .equalTo(number)
              .once("value", (snapshot) => {
                if (snapshot.exists()) {
                  SimpleToast.show(
                    "User with the same phone number already exists!"
                  );
                  setLoading(false);
                } else {
                  // If no user with the same email and phone number, proceed with registration
                  firebase
                    .app()
                    .database(databaseUrl)
                    .ref(TokenPath)
                    .set({
                      token: fcmToken,
                    })
                    .then(() => console.log("Token Saved"));

                  firebase
                    .app()
                    .database(databaseUrl)
                    .ref(userPath)
                    .set(data)
                    .then(() => {
                      SimpleToast.show("Register Successfully!");
                      setName("");
                      setEmail("");
                      setPassword("");
                      setImg(null);
                      setSelectedImage(null);
                      setLoading(false);
                      navigation.navigate("Login");
                    });
                }
              });
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/images/bg.png")}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.topContainer}>
            <Text style={styles.heading}>Create</Text>
            <Text style={styles.heading}>Account</Text>

            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={{
                  width: widthPercentageToDP(25),
                  height: widthPercentageToDP(25),
                  borderRadius: 50,
                  paddingVertical: 8,
                }}
              />
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                className="p-4 bg-white rounded-full"
              >
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/128/1042/1042339.png",
                  }}
                  className="h-20 w-20"
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={colors.lightwhite}
              value={name}
              onChangeText={(text) => handleNameChange(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.lightwhite}
              value={email}
              onChangeText={(text) => handleEmailChange(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={colors.lightwhite}
              value={number}
              onChangeText={setNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.lightwhite}
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => handlePasswordChange(text)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator
              className="justify-center items-center p-2 flex-row  rounded-lg "
              size={sizes.large}
              color={colors.white}
            />
          ) : (
            <TouchableOpacity
              className="justify-center items-center p-2 flex-row  rounded-lg  "
              style={{
                backgroundColor: colors.link,
                width: widthPercentageToDP(30),
              }}
              onPress={registerUser}
            >
              <Text
                className="text-white "
                style={{
                  fontSize: heightPercentageToDP(2.2),
                  fontWeight: "bold",
                }}
              >
                Sign - Up
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  inputContainer: {
    alignSelf: "center",
    width: widthPercentageToDP(80),
    marginTop: 30,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    fontSize: heightPercentageToDP(1.8),
    color: "white",
    marginBottom: sizes.avatar,
  },
  buttonContainer: {
    position: "absolute",
    marginBottom: 20,
    bottom: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    left: heightPercentageToDP(2),
  },
  button: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    borderBottomColor: colors.lightwhite,
    borderBottomWidth: 0.9,
    padding: 5,
    textAlign: "left",
  },
});

export default Register;
