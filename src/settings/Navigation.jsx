import { Entypo, MaterialIcons, Octicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { All, Calls, Camera, Chat, Home } from "../Screens/tabs/index";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors } from "../constants/index";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import { Login, Onboarding, Register } from "../Screens/Auth";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Main" component={MyTabs} />
        <Stack.Screen name="Chat" component={Chat} />
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
      initialRouteName="Onboarding"
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
