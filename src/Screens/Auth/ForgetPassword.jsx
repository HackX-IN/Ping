import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { colors, sizes } from "../../constants";
import { useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SimpleToast from "react-native-simple-toast";
import { firebase } from "@react-native-firebase/database";
import { databaseUrl } from "../../utils/Data";

const ForgetPassword = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [SyncData, setUserData] = useState({});

  useEffect(() => {
    GetUserDetails();
  }, []);

  const handleOldPasswordChange = (text) => {
    setOldPassword(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const GetUserDetails = async () => {
    try {
      const data = await AsyncStorage.getItem("ForgetPassword");
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error getting user details:", error);
    }
  };

  console.log("SynData:", SyncData);
  const handleChangePassword = async () => {
    try {
      setLoading(true);

      const success = await changePassword(email, oldPassword, password);

      if (success) {
        SimpleToast.show("Password Changed Successfully");
        navigation.goBack();
      } else {
        SimpleToast.show("Unable to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (email, oldPassword, newPassword) => {
    try {
      const snapshot = await firebase
        .app()
        .database(databaseUrl)
        .ref("users/")
        .orderByChild("emailId")
        .equalTo(email.toLowerCase())
        .once("value");

      if (snapshot.val() === null) {
        SimpleToast.show("Invalid Email Id!");
        return false;
      }

      const userData = Object.values(snapshot.val())[0];
      console.log("firebase Data:", userData?.id);

      if (userData?.password !== oldPassword) {
        SimpleToast.show("Invalid Old Password!");
        return false;
      }
      if (!/[A-Z]/.test(newPassword)) {
        SimpleToast.show(
          "Password must contain at least one uppercase letter!"
        );
        setLoading(false);
        return;
      }

      const updatedUser = {
        id: SyncData?.id,
        name: SyncData?.name,
        emailId: SyncData?.emailId,
        password: newPassword.length > 0 ? newPassword : SyncData?.password,
        number: SyncData?.number,
        image: SyncData?.image,
        token: SyncData?.token,
      };

      firebase
        .app()
        .database(databaseUrl)
        .ref(`users/${userData?.id}`)
        .update(updatedUser);

      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      await AsyncStorage.removeItem("ForgetPassword");

      return true;
    } catch (error) {
      console.error("Error changing password:", error);
      return false;
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
            <Text style={styles.heading}>Forget</Text>
            <Text style={styles.heading}>Password ?</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.lightwhite}
              value={email}
              onChangeText={handleEmailChange}
            />
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              placeholderTextColor={colors.lightwhite}
              secureTextEntry={true}
              value={oldPassword}
              onChangeText={handleOldPasswordChange}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor={colors.lightwhite}
              secureTextEntry={true}
              value={password}
              onChangeText={handlePasswordChange}
            />
          </View>

          {loading ? (
            <ActivityIndicator size={sizes.large} color={colors.white} />
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: colors.link,
                width: widthPercentageToDP(60),
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: 5,
              }}
              onPress={handleChangePassword}
              disabled={loading}
            >
              <Text
                style={{
                  fontSize: heightPercentageToDP(2.2),
                  fontWeight: "bold",
                  color: colors.white,
                }}
              >
                Change Password
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
});

export default ForgetPassword;
