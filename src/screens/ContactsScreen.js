// RN
import { useEffect, useState } from "react";
import { FlatList } from "react-native";

// AWS
import { API, graphqlOperation } from "aws-amplify";

// Data
import { listUsers } from "../graphql/queries";

// Components
import ContactListItem from "../components/ContactListItem";

const ContactsScreen = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((result) => {
            // console.log(result);
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
