import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Customheader from "../../components/Customheader";
import { colors } from "../../constants";
import * as Contacts from "expo-contacts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import ContactList from "../../components/ContactList";
import { Data } from "../../constants/Data";

const Allscreen = () => {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  console.log("Data", contacts);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.gray,
      }}
    >
      <LinearGradient colors={[colors.bg, colors.black]} style={{ flex: 1 }}>
        <Customheader
          text="Hyon-Lu"
          image="https://cdn-icons-png.flaticon.com/128/4140/4140048.png"
          text2="Edit"
        />
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
          data={contacts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <ContactList
              key={index}
              name={item.name}
              phoneNumber={item.phoneNumber}
            />
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Allscreen;

const styles = StyleSheet.create({});
