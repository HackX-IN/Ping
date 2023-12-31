import React, { useContext, useState } from "react";
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
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { useUserContext } from "../../Hooks/UserApi";
import { firebase } from "@react-native-firebase/database";
import { databaseUrl } from "../../utils/Data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SimpleToast from "react-native-simple-toast";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserData } = useUserContext();
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };
  const loginUser = async () => {
    try {
      setLoading(true);

      firebase
        .app()
        .database(databaseUrl)
        .ref("users/")
        .orderByChild("emailId")
        .equalTo(email.toLowerCase())
        .once("value")
        .then(async (snapshot) => {
          if (snapshot.val() == null) {
            SimpleToast.show("Invalid Email Id!");
            setLoading(false);
            return false;
          }
          let userData = Object.values(snapshot.val())[0];
          if (userData?.password != password) {
            SimpleToast.show("Invalid Password!");
            setLoading(false);
            return false;
          }

          console.log("User data: ", userData);
          setUserData(userData);

          await AsyncStorage.setItem("userData", JSON.stringify(userData));
          await AsyncStorage.setItem(
            "ForgetPassword",
            JSON.stringify(userData)
          );
          setLoading(false);
          SimpleToast.show("Login Successfully!");
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
            <Text style={styles.heading}>Welcome</Text>
            <Text style={styles.heading}>Back</Text>
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
              placeholder="Password"
              placeholderTextColor={colors.lightwhite}
              secureTextEntry={true}
              value={password}
              onChangeText={handlePasswordChange}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("FPassword")}
            >
              <Text style={styles.buttonText}>Forgot Password</Text>
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
              onPress={loginUser}
              disabled={loading}
            >
              <Text
                className="text-white "
                style={{
                  fontSize: heightPercentageToDP(2.2),
                  fontWeight: "bold",
                }}
              >
                Sign - In
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    bottom: 0,
    alignItems: "center",
    left: heightPercentageToDP(3),
  },
  button: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    borderBottomColor: colors.lightwhite,
    borderBottomWidth: 0.9,
    padding: 5,
  },
});

export default Login;
