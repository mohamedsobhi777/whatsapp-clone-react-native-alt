// RN
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

// AWS
import { API, graphqlOperation, Auth } from "aws-amplify";

// Data
import { listUsers } from "../graphql/queries";

// Components
import ContactListItem from "../components/ContactListItem";
import { MaterialIcons } from "@expo/vector-icons";

import {
    getCommonGet,
    ChatRoomWithUser,
    getCommonGetChatRoomWithUser,
} from "../services/chatRoomService";
import { createChatRoom, createUserChatRoom } from "../graphql/mutations";

const ContactsScreen = () => {
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();
    useEffect(() => {
        API.graphql(
            graphqlOperation(listUsers, { filter: { _deleted: { ne: true } } })
        ).then((result) => {
            setUsers(result?.data?.listUsers?.items);
        });
    }, []);

    const createAChatRoomWithTheUser = async (user) => {
        const existingChatRoom = await getCommonGetChatRoomWithUser(user.id);

        if (existingChatRoom) {
            navigation.navigate("Chat", { id: existingChatRoom.chatRoom.id });
            return;
        }

        const newChatRoomData = await API.graphql(
            graphqlOperation(createChatRoom, {
                input: {},
            })
        );
        // console.log(newChatRoomData);
        if (!newChatRoomData.data?.createChatRoom) {
            console.log("Error creating chat room error");
        }
        const newChatRoom = newChatRoomData.data?.createChatRoom;

        await API.graphql(
            graphqlOperation(createUserChatRoom, {
                input: { chatRoomId: newChatRoom.id, userId: user.id },
            })
        );

        // Add the auth user to the chat room
        const authUser = await Auth.currentAuthenticatedUser();

        await API.graphql(
            graphqlOperation(createUserChatRoom, {
                input: {
                    chatRoomId: newChatRoom.id,
                    userId: authUser.attributes.sub,
                },
            })
        );

        navigation.navigate("Chat", { id: newChatRoom.id });
    };

    return (
        <FlatList
            data={users}
            renderItem={({ item }) => (
                <ContactListItem
                    onPress={() => createAChatRoomWithTheUser(item)}
                    user={item}
                />
            )}
            style={{ backgroundColor: "white" }}
            ListHeaderComponent={() => (
                <Pressable
                    onPress={() => navigation.navigate("New Group")}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 15,
                        paddingHorizontal: 20,
                    }}
                >
                    <MaterialIcons
                        name="group"
                        size={24}
                        color="royalblue"
                        style={{
                            marginRight: 20,
                            backgroundColor: "gainsboro",
                            padding: 7,
                            borderRadius: 20,
                            overflow: "hidden",
                        }}
                    />
                    <Text style={{ color: "royalblue", fontSize: 16 }}>
                        New Group
                    </Text>
                </Pressable>
            )}
        />
    );
};

export default ContactsScreen;
