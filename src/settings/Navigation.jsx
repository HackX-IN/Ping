import { Entypo, MaterialIcons, Octicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { All, Camera, Chat, Home, Profile } from "../Screens/tabs/index";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors, sizes } from "../constants/index";
import Uploading from "../components/Uploading";
import FullScreenImage from "../components/FullscreenImage";
import {
  ZegoCallInvitationDialog,
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoUIKitPrebuiltCallFloatingMinimizedView,
} from "@zegocloud/zego-uikit-prebuilt-call-rn";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import { ForgetPassword, Login, Onboarding, Register } from "../Screens/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../Hooks/UserApi";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [loginChk, setloginChk] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setUserData, user } = useUserContext();

  const getUser = async () => {
    let data = await AsyncStorage.getItem("userData");
    setLoading(true);
    if (data != null) {
      setUserData(JSON.parse(data));
      setloginChk(false);
      setLoading(false);
    } else {
      setloginChk(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  if (loading || loginChk) {
    return (
      <View className="justify-center items-center flex-1 bg-gray-700 ">
        <ActivityIndicator size={sizes.heading} color={colors.white} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <ZegoCallInvitationDialog />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={user ? "upload" : "Auth"}
      >
        {user ? (
          <>
            {/* <Stack.Screen name="upload" component={Uploading} /> */}
            <Stack.Screen name="Main" component={MyTabs} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen
              name="FullScreenImage"
              component={FullScreenImage}
              options={{ presentation: "fullScreenModal", animation: "fade" }}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              // DO NOT change the name
              name="ZegoUIKitPrebuiltCallWaitingScreen"
              component={ZegoUIKitPrebuiltCallWaitingScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              // DO NOT change the name
              name="ZegoUIKitPrebuiltCallInCallScreen"
              component={ZegoUIKitPrebuiltCallInCallScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthStack} />
          </>
        )}
      </Stack.Navigator>
      <ZegoUIKitPrebuiltCallFloatingMinimizedView />
    </NavigationContainer>
  );
}
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: hp(9),
            backgroundColor: colors.gray,
            position: "absolute",
            bottom: 0,
            paddingHorizontal: wp(1),
            paddingBottom: hp(1),
            // borderTopLeftRadius: hp(2.5),
            // borderTopRightRadius: hp(2.5),
            shadowColor: colors.red,
            shadowOpacity: 0.9,
            shadowRadius: 30,
            shadowOffset: {
              width: 0,
              height: -2,
            },
            borderTopWidth: 0.9,
            borderTopColor: colors.gray,
            elevation: 8,
            zIndex: 1,
          },
          tabBarActiveTintColor: colors.link,
          tabBarInactiveTintColor: colors.white,
          headerShadowVisible: false,
          tabBarHideOnKeyboard: true,
        }}
        initialRouteName="Home"
      >
        <>
          <Tab.Screen
            name="Camera"
            component={Camera}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <Feather name="camera" size={23} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <MaterialIcons
                  name="chat-bubble-outline"
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="All"
            component={All}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <Octicons name="people" size={24} color={color} />
              ),
            }}
          />
        </>
      </Tab.Navigator>
    </>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Onboarding"
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="FPassword" component={ForgetPassword} />
    </Stack.Navigator>
  );
}
