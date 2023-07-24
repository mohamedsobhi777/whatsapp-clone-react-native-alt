import { View, Text, FlatList } from "react-native";
import React from "react";
import ContactListItem from "../components/ContactListItem";
import chats from "./../../assets/data/chats.json";

const ContactsScreen = () => {
    return (
        <FlatList
            data={chats}
            renderItem={({ item }) => <ContactListItem user={item.user} />}
            style={{ backgroundColor: "white" }}
        />
    );
};

export default ContactsScreen;
