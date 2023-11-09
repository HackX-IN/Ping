import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { colors, sizes } from "../../constants";
import { firebase } from "@react-native-firebase/database";
import { databaseUrl } from "../../utils/Data";
import { useUserContext } from "../../Hooks/UserApi";
import ChatCustomheader from "../../components/ChatCustomHeader";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import storage from "@react-native-firebase/storage";
import { Feather, Ionicons } from "@expo/vector-icons";
import { heightPercentageToDP } from "react-native-responsive-screen";

const ChatScreen = ({ route, navigation }) => {
  const { receiverData } = route.params;
  const { user, updateLastMessage } = useUserContext();
  const [allChat, setAllChat] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [recording, setRecording] = useState(null);
  const [audioURI, setAudioURI] = useState(null);
  const audioPlayer = useRef(new Audio.Sound());
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onChildAdd = useCallback(
    (snapshot) => {
      const newMessage = snapshot.val();
      const messageExists = allChat.some(
        (message) => message._id === snapshot.key
      );

      if (!messageExists) {
        const formattedMessage = {
          _id: snapshot.key,
          text: newMessage.message,
          createdAt: newMessage.createdAt,
          user: {
            _id: newMessage.from,
            name: newMessage.fromName,
          },
          msgType: newMessage.msgType,
          imageUri: newMessage.imageUri,
          audioUri: newMessage.audioUri,
          loading: false,
        };
        setAllChat((prevMessages) =>
          GiftedChat.append(prevMessages, formattedMessage)
        );
      }
    },
    [allChat]
  );

  useEffect(() => {
    const messagesRef = firebase
      .app()
      .database(databaseUrl)
      .ref("/messages/" + receiverData.roomId);

    messagesRef.on("child_added", onChildAdd);

    return () => {
      messagesRef.off("child_added", onChildAdd);
    };
  }, [onChildAdd, receiverData.roomId]);

  const formattedTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const onSend = async (newMessages = []) => {
    const message = newMessages[0];
    let formattedMessage;

    formattedMessage = {
      _id: uuid.v4(),
      roomId: receiverData.roomId,
      message: message.text,
      from: user?.id,
      to: receiverData.id,
      sendTime: formattedTime(),
      msgType: "text",
      fcmtoken: receiverData.Token,
      createdAt: message.createdAt,
      user: {
        _id: user.id,
        name: user.name,
      },
    };
    updateLastMessage(
      formattedMessage.message,
      formattedMessage.msgType,
      formattedMessage.sendTime
    );
    setAllChat((previousMessages) =>
      GiftedChat.append(previousMessages, formattedMessage)
    );

    await firebase
      .app()
      .database(databaseUrl)
      .ref("/messages/" + receiverData.roomId)
      .push(formattedMessage);

    setImageData(null);
  };

  const onSendImage = async (data) => {
    if (data !== null || "") {
      const imageId = uuid.v4();
      const imageRef = storage().ref().child(`chatMedia/${imageId}`);
      const response = await fetch(data);
      const blob = await response.blob();
      await imageRef.put(blob);
      const downloadURL = await imageRef.getDownloadURL();
      const message = {
        _id: uuid.v4(),
        roomId: receiverData.roomId,
        from: user?.id,
        to: receiverData.id,
        sendTime: formattedTime(),
        msgType: "image",
        fcmtoken: receiverData.Token,
        createdAt: new Date(),
        user: {
          _id: user.id,
          name: user.name,
        },
        imageUri: downloadURL,
        loading: true,
      };
      updateLastMessage(message.imageUri, message.msgType, message.sendTime);

      setAllChat((previousMessages) =>
        GiftedChat.append(previousMessages, message)
      );

      await firebase
        .app()
        .database(databaseUrl)
        .ref("/messages/" + receiverData.roomId)
        .push(message);

      setImageData(null);
    }
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
      const { uri } = result;

      onSendImage(uri);
      setImageData(uri);
    }
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "transparent",
          borderTopWidth: 0,
          paddingHorizontal: 16,
        }}
        primaryStyle={{ alignItems: "center" }}
        textInputStyle={{ color: "#fff" }}
      />
    );
  };

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
      const message = {
        _id: uuid.v4(),
        roomId: receiverData.roomId,
        from: user?.id,
        to: receiverData.id,
        sendTime: formattedTime(),
        audioUri: downloadURL,
        msgType: "audio",
        fcmtoken: receiverData.Token,
        createdAt: new Date(),
        user: {
          _id: user.id,
          name: user.name,
        },
      };
      updateLastMessage(message.audioUri, message.msgType, message.sendTime);

      setAllChat((previousMessages) =>
        GiftedChat.append(previousMessages, message)
      );
      console.log("Audio uploaded to Firebase Storage:", downloadURL);

      await firebase
        .app()
        .database(databaseUrl)
        .ref("/messages/" + receiverData.roomId)
        .push(message);
      console.log("Audio uploaded to Firebase Storage:", downloadURL);
    } catch (error) {
      console.error("Error uploading audio to Firebase Storage:", error);
    }
  }
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
  const renderBubble = (props) => {
    const { currentMessage } = props;
    console.log(currentMessage);

    if (currentMessage.msgType === "image" && currentMessage.imageUri) {
      return (
        <View>
          {currentMessage.loading && (
            <ActivityIndicator size="small" color="#ffffff" />
          )}
          <Image
            source={{ uri: currentMessage.imageUri }}
            style={{ width: 200, height: 200, marginBottom: 6 }}
          />
        </View>
      );
    }
    if (currentMessage.msgType === "audio" && currentMessage.audioUri) {
      return (
        <View className="mb-2">
          <TouchableOpacity
            onPress={() => playAudio(currentMessage?.audioUri)}
            style={{
              backgroundColor: colors.primary,
              padding: sizes.padding,
              borderRadius: sizes.large,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Feather
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={22}
              color={colors.white}
            />
            {audioDuration > 0 && (
              <Text
                style={{
                  color: colors.white,
                  fontSize: heightPercentageToDP(1.4),
                  textAlign: "left",
                }}
              >
                {audioDuration.toFixed() + ".0"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#2C3E50",
            marginBottom: 6,
          },
          left: {
            backgroundColor: "#3498db",
            marginBottom: 6,
          },
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[colors.bg, colors.black]} style={{ flex: 1 }}>
        <ChatCustomheader
          text={receiverData?.name}
          icon1="chevron-left"
          icon2="phone-call"
          onpress={() => navigation.goBack()}
          item={receiverData}
          pickImage={pickImage}
          navigation={navigation}
        />

        <GiftedChat
          alwaysShowSend
          messages={allChat}
          onSend={(newMessages) => onSend(newMessages)}
          user={{
            _id: user.id,
            name: user.name,
            avatar: user?.image,
          }}
          placeholder="Type your message..."
          inverted={true}
          isTyping={true}
          timeFormat="HH:mm"
          renderTime={(props) => {
            return (
              <Text
                {...props}
                style={{
                  color: colors.grey,
                  fontSize: 8,
                  alignSelf: "flex-end",
                  marginRight: 8,
                }}
              />
            );
          }}
          renderSend={(props) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: 60,
                }}
              >
                {imageData ? (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: "#fff",
                      marginRight: 10,
                    }}
                  >
                    <Image
                      source={{ uri: imageData }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        position: "absolute",
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        setImageData(null);
                      }}
                    >
                      <Image
                        source={{
                          uri: "https://cdn-icons-png.flaticon.com/128/1828/1828843.png",
                        }}
                        style={{ width: 16, height: 16, tintColor: "#fff" }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
                <TouchableOpacity
                  onPress={recording ? stopRecording : startRecording}
                  style={{ marginRight: 10 }}
                >
                  {recording ? (
                    <Feather
                      name="stop-circle"
                      size={22}
                      color={colors.white}
                    />
                  ) : (
                    <Feather name="mic" size={22} color={colors.white} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => {
                    pickImage();
                  }}
                >
                  <Ionicons name="image" size={30} color="white" />
                </TouchableOpacity>
                <Send {...props} containerStyle={{ justifyContent: "center" }}>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/786/786205.png",
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 10,
                      tintColor: "orange",
                    }}
                  />
                </Send>
              </View>
            );
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
        />
      </LinearGradient>
    </View>
  );
};

export default ChatScreen;
