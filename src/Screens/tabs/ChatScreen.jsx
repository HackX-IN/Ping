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
import * as ImagePicker from "expo-image-picker";
import { Entypo, Feather } from "@expo/vector-icons";
import Customheader from "../../components/Customheader";
import storage from "@react-native-firebase/storage";
import ChatFooter from "../../components/ChatFooter";
import { colors, sizes } from "../../constants";
import { databaseUrl } from "../../utils/Data";
import { firebase } from "@react-native-firebase/database";
import { useUserContext } from "../../Hooks/UserApi";
import SimpleToast from "react-native-simple-toast";
import uuid from "react-native-uuid";

const ChatScreen = ({ route, navigation }) => {
  const { receiverData } = route.params;
  console.log(receiverData);
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayer = useRef(new Audio.Sound());
  const [audioDuration, setAudioDuration] = useState(0);
  const [allChat, setallChat] = React.useState([]);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const { setUserData, user } = useUserContext();

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

  useEffect(() => {
    const onChildAdd = firebase
      .app()
      .database(databaseUrl)
      .ref("/messages/" + receiverData.roomId)
      .on("child_added", (snapshot) => {
        // console.log('A new node has been added', snapshot.val());
        setallChat((state) => [snapshot.val(), ...state]);
      });
    // Stop listening for updates when no longer required
    return () =>
      firebase
        .app()
        .database(databaseUrl)
        .ref("/messages" + receiverData.roomId)
        .off("child_added", onChildAdd);
  }, [receiverData.roomId]);

  const msgvalid = (txt) => txt && txt.replace(/\s/g, "").length;
  const currentTime = new Date();

  // Get the current time in hours, minutes, and seconds
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  // Create a formatted time string
  const formattedTime = `${hours}:${minutes}`;

  const sendMsg = () => {
    if (message == "" || msgvalid(message) == 0) {
      SimpleToast.show("Enter something....");
      return false;
    }

    let msgData = {
      roomId: receiverData.roomId,
      message: message,
      from: user?.id,
      to: receiverData.id,
      sendTime: formattedTime,
      msgType: "text",
    };
    updateMessagesToFirebase(msgData);
  };
  const updateMessagesToFirebase = async (msgData) => {
    const newReference = firebase
      .app()
      .database(databaseUrl)
      .ref("/messages/" + receiverData.roomId)
      .push();
    msgData.id = newReference.key;
    newReference.set(msgData).then(() => {
      let chatListupdate = {
        lastMsg: msgData.message,
        sendTime: msgData.sendTime,
        msgType: msgData.msgType,
      };
      firebase
        .app()
        .database(databaseUrl)
        .ref("/chatlist/" + receiverData?.id + "/" + user?.id)
        .update(chatListupdate)
        .then(() => console.log("Data updated."));
      firebase
        .app()
        .database(databaseUrl)
        .ref("/chatlist/" + user?.id + "/" + receiverData?.id)
        .update(chatListupdate)
        .then(() => console.log("Data updated."));

      setMessage("");
      // setShowEmoji(!showEmoji);
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      console.log(result.uri);
      const { uri } = result;
      const response = await fetch(uri);
      const blob = await response.blob();

      const imageId = uuid.v4();

      const imageRef = storage().ref().child(`chatMedia/${imageId}`);

      await imageRef.put(blob);

      const downloadURL = await imageRef.getDownloadURL();
      let msgData = {
        roomId: receiverData.roomId,
        message: downloadURL,
        from: user?.id,
        to: receiverData.id,
        sendTime: formattedTime,
        msgType: "image",
      };
      updateMessagesToFirebase(msgData);
    }
  };

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  async function playAudio(msg) {
    try {
      if (msg) {
        if (isPlaying) {
          await audioPlayer.current.pauseAsync();
        } else {
          await audioPlayer.current.loadAsync({
            uri: msg,
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

  const [recording, setRecording] = useState(null);
  const [audioURI, setAudioURI] = useState(null);

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    uploadRecordingToFirebase(uri);
  }

  async function uploadRecordingToFirebase(uri) {
    try {
      const AudioId = uuid.v4();
      const audioRef = storage().ref().child(`audio/${AudioId}`);

      await audioRef.putFile(uri);

      const downloadURL = await audioRef.getDownloadURL();

      setAudioURI(downloadURL);
      let msgData = {
        roomId: receiverData.roomId,
        message: downloadURL,
        from: user?.id,
        to: receiverData.id,
        sendTime: formattedTime,
        msgType: "audio",
      };

      updateMessagesToFirebase(msgData);
      console.log("Audio uploaded to Firebase Storage:", downloadURL);
    } catch (error) {
      console.error("Error uploading audio to Firebase Storage:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.bg, colors.black]} style={styles.flex1}>
        <Customheader
          text={receiverData?.name}
          icon1="chevron-left"
          icon2="phone-call"
          onpress={() => navigation.goBack()}
        />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messageContainer}
        >
          {allChat.map((msg, index) => (
            <>
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.from === user.id
                    ? styles.senderBubble
                    : styles.receiverBubble,
                ]}
              >
                {msg.msgType === "text" && (
                  <View>
                    <Text
                      style={{
                        color: "white",
                        fontSize: heightPercentageToDP(1.9),
                      }}
                    >
                      {msg.message}
                    </Text>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: heightPercentageToDP(1.4),
                        textAlign: "right",
                      }}
                    >
                      {msg.sendTime}
                    </Text>
                  </View>
                )}
                {msg.msgType === "image" && (
                  <View>
                    <Image
                      source={{ uri: msg.message }}
                      style={styles.profilePic}
                    />
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: heightPercentageToDP(1.4),
                        textAlign: "right",
                      }}
                    >
                      {msg.sendTime}
                    </Text>
                  </View>
                )}
                {msg.msgType === "audio" && (
                  <View>
                    <TouchableOpacity
                      onPress={() => playAudio(msg?.message)}
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
                      {msg.sendTime}
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
          onSend={sendMsg}
          pickImage={pickImage}
          recording={recording}
          setRecording={setRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
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
