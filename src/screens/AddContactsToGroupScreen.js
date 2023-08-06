// RN
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// AWS
import { API, Auth, graphqlOperation } from "aws-amplify";

// Data
import { listUsers } from "../graphql/queries";

// Components
import ContactListItem from "../components/ContactListItem";
import { MaterialIcons } from "@expo/vector-icons";
import { createChatRoom, createUserChatRoom } from "../graphql/mutations";

const AddContactsToGroupScreen = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const navigation = useNavigation();
    const route = useRoute();
    const chatRoom = route.params.chatRoom;

    useEffect(() => {
        API.graphql(
            graphqlOperation(listUsers, {
                filter: {
                    _deleted: { ne: true },
                },
            })
        ).then((result) => {
            // console.log(result);
            setUsers(
                result.data?.listUsers?.items.filter(
                    (item) =>
                        !chatRoom.users.items.some(
                            (chatRoomUser) =>
                                !chatRoomUser._deleted &&
                                item.id === chatRoomUser.userId
                        )
                )
            );
        });
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    title="Add to group"
                    disabled={selectedUserIds.length === 0}
                    onPress={onAddToGroupPress}
                />
            ),
        });
    }, [selectedUserIds]);

    const onAddToGroupPress = async () => {
        // Add the selected users to the ChatRoom
        await Promise.all(
            selectedUserIds.map((userId) =>
                API.graphql(
                    graphqlOperation(createUserChatRoom, {
                        input: { chatRoomId: chatRoom.id, userId },
                    })
                )
            )
        );

        setSelectedUserIds([]);

        // navigate to the newly created ChatRoom
        navigation.goBack();
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
export default AddContactsToGroupScreen;
