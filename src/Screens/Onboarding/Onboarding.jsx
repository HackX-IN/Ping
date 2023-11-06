import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Onboarding from "react-native-onboarding-swiper";
import Lottie from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, sizes } from "../../constants";
import { getItem, setItem } from "../../utils/Storage.js";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [showOnboarding, setShowOnboarding] = useState(null);
  useEffect(() => {
    checkIfAlreadyOnboarded();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    let onboarded = await getItem("onboarded");
    if (onboarded == 1) {
      // hide onboarding
      setShowOnboarding(false);
      navigation.navigate("Login");
    } else {
      // show onboarding
      setShowOnboarding(true);
    }
  };

  if (showOnboarding == null) {
    return (
      <View style={styles.container}>
        <Onboarding
          onDone={handleDone}
          onSkip={handleDone}
          // bottomBarHighlight={false}
          DoneButtonComponent={doneButton}
          containerStyles={{ paddingHorizontal: sizes.button }}
          pages={[
            {
              backgroundColor: colors.green,
              image: (
                <View style={styles.lottie}>
                  <Lottie
                    source={require("../../assets/images/1.json")}
                    autoPlay
                    loop
                  />
                </View>
              ),
              title: "Boost Productivity",
              subtitle:
                "Subscribe this channel to boost your productivity level",
            },
            {
              backgroundColor: colors.accent,
              image: (
                <View style={styles.lottie}>
                  <Lottie
                    source={require("../../assets/images/2.json")}
                    autoPlay
                    loop
                  />
                </View>
              ),
              title: "Work Seamlessly",
              subtitle: "Get your work done seamlessly without interruption",
            },
            {
              backgroundColor: "#a78bfa",
              image: (
                <View style={styles.lottie}>
                  <Lottie
                    source={require("../../assets/images/3.json")}
                    autoPlay
                    loop
                  />
                </View>
              ),
              title: "Achieve Higher Goals",
              subtitle:
                "By boosting your productivity we help you to achieve higher goals",
            },
          ]}
        />
      </View>
    );
  }

  const handleDone = () => {
    navigation.navigate("Login");
    setItem("onboarded", "1");
  };

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.doneButton} {...props}>
        <Text>Done</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        // bottomBarHighlight={false}
        DoneButtonComponent={doneButton}
        containerStyles={{ paddingHorizontal: sizes.button }}
        pages={[
          {
            backgroundColor: colors.green,
            image: (
              <View style={styles.lottie}>
                <Lottie
                  source={require("../../assets/images/1.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Boost Productivity",
            subtitle: "Subscribe this channel to boost your productivity level",
          },
          {
            backgroundColor: colors.accent,
            image: (
              <View style={styles.lottie}>
                <Lottie
                  source={require("../../assets/images/2.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Work Seamlessly",
            subtitle: "Get your work done seamlessly without interruption",
          },
          {
            backgroundColor: "#a78bfa",
            image: (
              <View style={styles.lottie}>
                <Lottie
                  source={require("../../assets/images/3.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Achieve Higher Goals",
            subtitle:
              "By boosting your productivity we help you to achieve higher goals",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
  doneButton: {
    padding: sizes.cardTitle,
    // backgroundColor: 'white',
    // borderTopLeftRadius: '100%',
    // borderBottomLeftRadius: '100%'
  },
});
