import { Entypo, MaterialIcons, Octicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { All, Calls, Camera, Chat, Home } from "../Screens/tabs/index";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors, sizes } from "../constants/index";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import { Login, Onboarding, Register } from "../Screens/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../Hooks/UserApi";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [loginChk, setloginChk] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setUserData, user } = useUserContext();

  useEffect(() => {
    getUser();
  }, []);

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

  if (loading || loginChk) {
    return (
      <View className="justify-center items-center flex-1 bg-gray-700 ">
        <ActivityIndicator size={sizes.heading} color={colors.white} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MyTabs} />
            <Stack.Screen name="Chat" component={Chat} />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Auth" component={AuthStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: hp(11),
          backgroundColor: colors.gray,
          position: "absolute",
          bottom: 0,
          paddingHorizontal: wp(5),
          paddingBottom: hp(1.8),
          borderTopLeftRadius: hp(2.5),
          borderTopRightRadius: hp(2.5),
        },
        tabBarActiveTintColor: colors.link,
        tabBarInactiveTintColor: colors.white,
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="Calls"
        component={Calls}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Feather name="phone" size={23} color={color} />
          ),
        }}
      />
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
            <MaterialIcons name="chat-bubble-outline" size={24} color={color} />
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
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
