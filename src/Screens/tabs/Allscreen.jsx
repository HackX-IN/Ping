import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Customheader from "../../components/Customheader";
import { colors } from "../../constants";
import * as Contacts from "expo-contacts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import ContactList from "../../components/ContactList";
import { Data } from "../../constants/Data";
import { useUserContext } from "../../Hooks/UserApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "@react-native-firebase/database";
import { databaseUrl } from "../../utils/Data";
import { useNavigation } from "@react-navigation/core";
import uuid from "react-native-uuid";

const Allscreen = () => {
  const [contacts, setContacts] = useState([]);
  const { setUserData, user } = useUserContext();
  const [search, setSearch] = useState("");
  const [allUser, setAllUser] = useState([]);
  const [allUserBackup, setAllUserBackup] = useState([]);
  const [matchingNumbers, setMatchingNumbers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
          });

          if (data.length > 0) {
            const contactData = [];
            for (const contact of data) {
              if (contact.phoneNumbers) {
                for (const phoneNumber of contact.phoneNumbers) {
                  contactData.push({
                    name: contact.name,
                    phoneNumber: phoneNumber.number,
                  });
                }
              }
            }
            setContacts(contactData);
          }
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    const getAllUser = () => {
      try {
        firebase
          .app()
          .database(databaseUrl)
          .ref("users/")
          .once("value")
          .then((snapshot) => {
            const users = Object.values(snapshot.val()).filter(
              (it) => it.id !== user.id
            );
            setAllUser(users);
            setAllUserBackup(users);
          });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getAllUser();
  }, [user.id]);

  useEffect(() => {
    const getMatchingUsers = () => {
      const matchingUsers = allUser.map((user) => user.number);
      const contactUsers = contacts.map((it) => it.phoneNumber);

      const normalizedMatchingUsers = matchingUsers.map((number) =>
        number.replace(/\s/g, "")
      );
      const normalizedContactUsers = contactUsers.map((number) =>
        number.replace(/\s/g, "")
      );

      const matchingNumbers = normalizedMatchingUsers.filter((userNumber) =>
        normalizedContactUsers.includes(userNumber)
      );

      setMatchingNumbers(matchingNumbers);
    };

    getMatchingUsers();
  }, [allUser, contacts]);

  const searchuser = (val) => {
    setsearch(val);
    setallUser(allUserBackup.filter((it) => it.name.match(val)));
  };

  const createChatList = (data) => {
    firebase
      .app()
      .database(databaseUrl)
      .ref("/chatlist/" + user.id + "/" + data.id)
      .once("value")
      .then((snapshot) => {
        console.log("User data: ", snapshot.val());

        if (snapshot.val() == null) {
          let roomId = uuid.v4();
          let myData = {
            roomId,
            id: user.id,
            name: user.name,
            image: user.image,
            emailId: user.emailId,
            number: user.number,
            lastMsg: "",
            msgTime: "",
          };
          firebase
            .app()
            .database(databaseUrl)
            .ref("/chatlist/" + data.id + "/" + user.id)
            .update(myData)
            .then(() => console.log("Data updated."));

          delete data["password"];
          data.lastMsg = "";
          data.roomId = roomId;
          data.msgTime = "";
          firebase
            .app()
            .database(databaseUrl)
            .ref("/chatlist/" + user.id + "/" + data.id)
            .update(data)
            .then(() => console.log("Data updated."));

          navigation.navigate("Chat", { receiverData: data });
        } else {
          navigation.navigate("Chat", { receiverData: snapshot.val() });
        }
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.gray,
      }}
    >
      <LinearGradient colors={[colors.bg, colors.black]} style={{ flex: 1 }}>
        <Customheader text={user?.name} image={user?.image} text2="Logout" />
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            padding: 16,
          }}
        >
          Contacts
        </Text>
        <FlatList
          contentContainerStyle={{
            paddingVertical: heightPercentageToDP(0.5),
            paddingHorizontal: heightPercentageToDP(0.5),
          }}
          data={allUser.filter((item) => matchingNumbers.includes(item.number))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <ContactList
              key={item.id.toString()}
              name={item.name}
              phoneNumber={item.number}
              item={item}
              onPress={createChatList}
            />
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Allscreen;

const styles = StyleSheet.create({});
