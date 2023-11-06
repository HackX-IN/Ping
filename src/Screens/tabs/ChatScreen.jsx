import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import EmojiModal from "react-native-emoji-modal";
import { LinearGradient } from "expo-linear-gradient";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Entypo, Feather } from "@expo/vector-icons";
import Customheader from "../../components/Customheader";
import ChatFooter from "../../components/ChatFooter";
import { colors, sizes } from "../../constants";

const ChatScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayer = useRef(new Audio.Sound());
  const [audioDuration, setAudioDuration] = useState(0);

  const [playbackStatus, setPlaybackStatus] = useState(null);

  useEffect(() => {
    const sampleMessages = [
      {
        text: "Hello!",
        sender: "receiver",
        type: "text",
        profilePic: "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
        timestamp: new Date(),
      },
      {
        image:
          "https://insomniac.games/wp-content/uploads/2018/09/Spider-Man_PS4_Selfie_Photo_Mode_LEGAL.jpg",
        sender: "sender",
        type: "image",
        profilePic: "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
        timestamp: new Date(),
      },
      {
        audio:
          "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fping-b0e0f834-1c43-4e5e-99ab-acf6d9a536ce/Audio/recording-728ddd73-ab2e-4027-9436-92a327e27294.m4a",
        sender: "sender",
        type: "audio",
        profilePic: "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
        timestamp: new Date(),
      },
      {
        text: "Hello how Are you!",
        sender: "receiver",
        type: "text",
        profilePic: "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
        timestamp: new Date(),
      },
    ];

    setMessages(sampleMessages);
  }, []);

  const sendMessage = (message, type = "text") => {
    const newMessage = {
      text: message,
      sender: "sender",
      type,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  async function playAudio() {
    try {
      if (
        "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fping-b0e0f834-1c43-4e5e-99ab-acf6d9a536ce/Audio/recording-22060371-34da-44ba-9db2-deb20c5aef3c.m4a"
      ) {
        if (isPlaying) {
          await audioPlayer.current.pauseAsync();
        } else {
          await audioPlayer.current.loadAsync({
            uri: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fping-b0e0f834-1c43-4e5e-99ab-acf6d9a536ce/Audio/recording-22060371-34da-44ba-9db2-deb20c5aef3c.m4a",
          });
          await audioPlayer.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error("Failed to play audio", error);
    }
  }
  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.setOnPlaybackStatusUpdate((status) => {
        setPlaybackStatus(status);
        if (status.isLoaded) {
          setAudioDuration(status.durationMillis / 1000);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });
    }
  }, [audioPlayer]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.bg, colors.black]} style={styles.flex1}>
        <Customheader
          text={item.title}
          icon1="chevron-left"
          icon2="phone-call"
          onpress={() => navigation.goBack()}
        />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messageContainer}
        >
          {messages.map((msg, index) => (
            <>
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.sender === "sender"
                    ? styles.senderBubble
                    : styles.receiverBubble,
                ]}
              >
                {msg.type === "text" && (
                  <View>
                    <Text
                      style={{
                        color: "white",
                        fontSize: heightPercentageToDP(1.9),
                      }}
                    >
                      {msg.text}
                    </Text>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: heightPercentageToDP(1.4),
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString()}
                    </Text>
                  </View>
                )}
                {msg.type === "image" && (
                  <View>
                    <Image
                      source={{ uri: msg.image }}
                      style={styles.profilePic}
                    />
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: heightPercentageToDP(1.4),
                        textAlign: "right",
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString()}
                    </Text>
                  </View>
                )}
                {msg.type === "audio" && (
                  <View>
                    <TouchableOpacity
                      onPress={playAudio}
                      style={{
                        backgroundColor: colors.primary,
                        padding: sizes.padding,
                        borderRadius: sizes.large,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Feather
                        name={isPlaying ? "pause-circle" : "play-circle"}
                        size={22}
                        color={colors.white}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: heightPercentageToDP(1.4),
                        textAlign: "right",
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString()}
                    </Text>
                  </View>
                )}
              </View>
            </>
          ))}
        </ScrollView>

        <ChatFooter
          message={message}
          setMessage={setMessage}
          showEmoji={showEmoji}
          setShowEmoji={setShowEmoji}
          onSend={sendMessage}
        />
        {showEmoji && (
          <View style={styles.emojiModal}>
            <EmojiModal
              onEmojiSelected={(emoji) => setMessage(message + emoji)}
            />
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray,
  },
  flex1: {
    flex: 1,
  },
  emojiModal: {
    position: "absolute",
    bottom: heightPercentageToDP(11),
  },
  messageContainer: {
    padding: sizes.medium,
  },
  messageBubble: {
    padding: sizes.xxsmall,
    borderRadius: sizes.xxsmall,
    marginBottom: sizes.xxsmall,
    maxWidth: widthPercentageToDP(70),
    flexDirection: "row", // Allow profile images to be outside the bubbles
  },
  senderBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.blue,
  },
  receiverBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.lightwhite,
  },
  profilePic: {
    width: widthPercentageToDP(50),
    height: widthPercentageToDP(50),
    resizeMode: "cover",
  },
});

export default ChatScreen;
