import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import ContactListItem from "../components/ContactListItem";
import chats from "./../../assets/data/chats.json";

import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "../graphql/queries";

const ContactsScreen = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((result) => {
            console.log(result);
            setUsers(result?.data?.listUsers?.items);
        });
    }, []);
    return (
        <FlatList
            data={users}
            renderItem={({ item }) => <ContactListItem user={item} />}
            style={{ backgroundColor: "white" }}
        />
    );
};

export default ContactsScreen;
