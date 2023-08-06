// RN
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

// AWS
import { API, Auth, graphqlOperation } from "aws-amplify";

// Data
import { listUsers } from "../graphql/queries";

// Components
import ContactListItem from "../components/ContactListItem";
import { MaterialIcons } from "@expo/vector-icons";
import { createChatRoom, createUserChatRoom } from "../graphql/mutations";

const NewGroupScreen = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [name, setName] = useState("");

    const navigation = useNavigation();
    useEffect(() => {
        API.graphql(
            graphqlOperation(listUsers, {
                filter: {
                    _deleted: { ne: true },
                },
            })
        ).then((result) => {
            // console.log(result);
            setUsers(result?.data?.listUsers?.items);
        });
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    title="Create"
                    disabled={!name || selectedUserIds.length === 0}
                    onPress={onCreateGroupPress}
                />
            ),
        });
    }, [name]);

    const onCreateGroupPress = async () => {
        const newChatRoomData = await API.graphql(
            graphqlOperation(createChatRoom, {
                input: { name },
            })
        );

        if (!newChatRoomData.data?.createChatRoom) {
            console.log("Error creating chat room error");
        }
        const newChatRoom = newChatRoomData.data?.createChatRoom;

        // Add the selected users to the ChatRoom
        await Promise.all(
            selectedUserIds.map((userId) =>
                API.graphql(
                    graphqlOperation(createUserChatRoom, {
                        input: { chatRoomId: newChatRoom.id, userId },
                    })
                )
            )
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

        setSelectedUserIds([]);
        setName("");
        // navigate to the newly created ChatRoom
        navigation.navigate("Chat", { id: newChatRoom.id });
    };

    const onContactPress = (id) => {
        setSelectedUserIds((userIds) => {
            if (userIds.includes(id)) {
                return userIds.filter((uid) => uid !== id);
            } else {
                return [...userIds, id];
            }
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Group name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <FlatList
                data={users}
                renderItem={({ item }) => (
                    <ContactListItem
                        user={item}
                        selectable
                        onPress={() => onContactPress(item.id)}
                        isSelected={selectedUserIds.includes(item.id)}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
    },
    input: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "lightgray",
        padding: 10,
        margin: 10,
    },
});
export default NewGroupScreen;
