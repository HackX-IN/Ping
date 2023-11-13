import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from "react-native";
import { Audio } from "expo-av";

import { LinearGradient } from "expo-linear-gradient";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import * as ImagePicker from "expo-image-picker";
import MessageComponent from "../../components/MsgComponent";
import ChatCustomHeader from "../../components/ChatCustomHeader";
import storage from "@react-native-firebase/storage";
import ChatFooter from "../../components/ChatFooter";
import { colors, sizes } from "../../constants";

import { firebase } from "@react-native-firebase/database";
import { useUserContext } from "../../Hooks/UserApi";
import SimpleToast from "react-native-simple-toast";
import uuid from "react-native-uuid";
import { databaseUrl } from "../../utils/Data";
import { Feather } from "@expo/vector-icons";
import Uploading from "../../components/Uploading";
import Progressbar from "../../components/Progressbar";

const ChatScreen = ({ route, navigation }) => {
  const MESSAGE_ITEM_HEIGHT = 100;
  const MESSAGE_ITEM_WIDTH = 200;

  const { receiverData } = route.params;
  // console.log(receiverData);
  const [message, setMessage] = useState("");
  const [imageData, setImageData] = useState(null);
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayer = useRef(new Audio.Sound());
  const [audioDuration, setAudioDuration] = useState(0);
  const [allChat, setallChat] = React.useState([]);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const { setUserData, user, updateLastMessage } = useUserContext();
  const [progress, setProgress] = useState(0);
  const [activeState, setActiveState] = useState(false);

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

  const sendPushNotification = async (recipientFCMToken, messageContent) => {
    try {
      const FCM_SERVER_KEY =
        "AAAAGUl6xAU:APA91bFZAxc4f9LEHf_Aed3EIwDtWMNW0Ht8vw8jK31ameYch0Zp8N17S7nBlNJ5K2gtz1HkOWH_11RPUu2TllGubtog7wAf84Ckbpy6jI6wqjJrs4BM9ERFE4I5ItQSZJiC5i-oJhqs"; // Obtain your FCM server key from Firebase Console

      const message = {
        to: recipientFCMToken,
        notification: {
          title: user?.name,
          body: messageContent,
        },
      };

      const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${FCM_SERVER_KEY}`,
        },
        body: JSON.stringify(message),
      });

      if (response.status === 200) {
        console.log("Push notification with image sent successfully");
      } else {
        console.error("Failed to send push notification");
      }
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };

  const sendMsg = useCallback(() => {
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
      fcmtoken: receiverData.token,
    };
    updateMessagesToFirebase(msgData);
    Keyboard.dismiss();
    setMessage("");
  }, [message, receiverData.roomId, user]);

  const updateMessagesToFirebase = useCallback(
    (msgData) => {
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

        const chatListRef = firebase
          .app()
          .database(databaseUrl)
          .ref("/chatlist/" + receiverData?.id + "/" + user?.id);

        console.log("Updating chat list for:", receiverData?.id, user?.id);

        chatListRef
          .update(chatListupdate)
          .then(() => console.log("Data updated."))
          .catch((error) => console.error("Error updating data:", error));

        if (msgData.fcmtoken) {
          sendPushNotification(msgData.fcmtoken, msgData.message);
        }
      });
    },
    [receiverData.roomId, user]
  );

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

    if (!result.canceled) {
      const { uri } = result;
      setImageData(uri);
      onSendImage(uri);
    }
  };
  const onSendImage = useCallback(
    async (data) => {
      if (data !== null || "") {
        const imageId = uuid.v4();
        const imageRef = storage().ref().child(`chatMedia/${imageId}`);
        const response = await fetch(data);
        const blob = await response.blob();

        const uploadTask = imageRef.put(blob);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress.toFixed());
          },
          (error) => {
            console.error("Error uploading image: ", error);
          },
          async () => {
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            let msgData = {
              roomId: receiverData.roomId,
              message: downloadURL,
              from: user?.id,
              to: receiverData.id,
              sendTime: formattedTime,
              msgType: "image",
              fcmtoken: receiverData.token,
            };
            updateMessagesToFirebase(msgData);

            if (msgData?.fcmtoken) {
              await sendPushNotification(receiverData?.token, msgData?.msgType);
            }

            setImageData(null);
          }
        );
      }
    },
    [allChat, receiverData, updateLastMessage, user]
  );

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
      {imageData && <Uploading image={imageData} />}
      <LinearGradient colors={[colors.bg, colors.black]} style={styles.flex1}>
        <ChatCustomHeader
          text={receiverData?.name}
          icon1="chevron-left"
          icon2="phone-call"
          onpress={() => navigation.goBack()}
          item={receiverData}
          navigation={navigation}
        />

        <FlatList
          ref={scrollViewRef}
          data={allChat}
          keyExtractor={(msg) => String(msg.id)}
          inverted={true}
          contentContainerStyle={styles.messageContainer}
          renderItem={({ item, index }) => (
            <MessageComponent
              item={item}
              index={index}
              onActiveState={() => {
                setActiveState(true);
              }}
              activeState={activeState}
              setActiveState={setActiveState}
            />
          )}
        />

        <ChatFooter
          message={message}
          setMessage={setMessage}
          onSend={sendMsg}
          pickImage={pickImage}
          recording={recording}
          setRecording={setRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          activeState={activeState}
          setActiveState={setActiveState}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray,
    position: "relative",
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
    paddingVertical: heightPercentageToDP(8),
  },
  messageBubble: {
    padding: sizes.xxsmall,
    borderRadius: sizes.xxsmall,
    marginBottom: sizes.xxsmall,
    maxWidth: widthPercentageToDP(70),
    flexDirection: "row",
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
  audioContainer: {
    backgroundColor: colors.primary,
    padding: sizes.padding,
    borderRadius: sizes.large,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
});

export default ChatScreen;
