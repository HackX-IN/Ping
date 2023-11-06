import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { sizes, colors } from "../constants/index.tsx";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const ChatFooter = ({
  message,
  setMessage,
  showEmoji,
  setShowEmoji,
  onSend,
}) => {
  const [recording, setRecording] = useState(null);
  const [audioURI, setAudioURI] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayer = useRef(new Audio.Sound());
  const [audioDuration, setAudioDuration] = useState(0);

  const [playbackStatus, setPlaybackStatus] = useState(null);

  // useEffect(() => {
  //   if (audioPlayer.current) {
  //     audioPlayer.current.setOnPlaybackStatusUpdate((status) => {
  //       setPlaybackStatus(status);
  //       if (status.isLoaded) {
  //         setAudioDuration(status.durationMillis / 1000);
  //         if (status.didJustFinish) {
  //           setIsPlaying(false);
  //         }
  //       }
  //     });
  //   }
  // }, [audioPlayer]);

  // async function playAudio() {
  //   try {
  //     if (audioURI) {
  //       if (isPlaying) {
  //         await audioPlayer.current.pauseAsync();
  //       } else {
  //         await audioPlayer.current.loadAsync({ uri: audioURI });
  //         await audioPlayer.current.playAsync();
  //         setIsPlaying(true);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Failed to play audio", error);
  //   }
  // }

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
    setAudioURI(uri);
  }

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
      // Handle the selected image here (e.g., upload to a server or display it)
      console.log(result.uri);
    }
  };

  return (
    <>
      <View
        style={{
          position: "absolute",
          bottom: heightPercentageToDP(2),
          width: widthPercentageToDP(95),
          padding: sizes.medium,
          backgroundColor: colors.bginput,
          left: heightPercentageToDP(1),
          borderRadius: sizes.thumbnail / 2,
          flexDirection: "row",
          alignItems: "center",
          gap: sizes.xxsmall,
          zIndex: 5,
        }}
      >
        <TouchableOpacity onPress={() => setShowEmoji(!showEmoji)}>
          <Entypo name="emoji-happy" size={20} color={colors.lightwhite} />
        </TouchableOpacity>

        <TextInput
          placeholder="Type Your message"
          placeholderTextColor={colors.lightwhite}
          style={{
            width: widthPercentageToDP(60),
            fontSize: heightPercentageToDP(1.9),
            fontWeight: "400",
            color: colors.white,
          }}
          multiline={true}
          value={message}
          onChangeText={setMessage}
        />
        {message.length === 0 && (
          <>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                backgroundColor: colors.primary,
                padding: sizes.padding,
                borderRadius: sizes.large,
              }}
            >
              <Feather name="camera" size={22} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={recording ? stopRecording : startRecording}
              style={{
                backgroundColor: colors.primary,
                padding: sizes.padding,
                borderRadius: sizes.large,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {recording ? (
                <Feather name="stop-circle" size={22} color={colors.white} />
              ) : (
                <Feather name="mic" size={22} color={colors.white} />
              )}
            </TouchableOpacity>
          </>
        )}
        {message.length > 0 && (
          <TouchableOpacity
            onPress={() => onSend(message)}
            style={{
              left: heightPercentageToDP(5),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="send" size={18} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
      {/* {audioURI && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
          <Text style={{ color: colors.lightwhite }}>
            {audioDuration.toFixed(1)}s
          </Text>
        </View>
      )} */}
    </>
  );
};

export default ChatFooter;
