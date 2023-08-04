// RN
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

// Utils
import dayjs from "dayjs";
dayjs.extend(relativeTime);
import relativeTime from "dayjs/plugin/relativeTime";
import { getCommonGetChatRoomWithUser } from "../../services/chatRoomService";

// AWS
import { API, graphqlOperation, Auth } from "aws-amplify";
// Data
import { createChatRoom, createUserChatRoom } from "../../graphql/mutations";

const ContactListItem = ({ user }) => {
    const navigation = useNavigation();

    const onPress = async () => {
        const existingChatRoom = await getCommonGetChatRoomWithUser(user.id);

        if (existingChatRoom) {
            navigation.navigate("Chat", { id: existingChatRoom.id });
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
        <Pressable onPress={onPress} style={styles.container}>
            <Image
                source={{
                    uri: user.image,
                }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.name}>
                    {user.name}
                </Text>

                <Text numberOfLines={2} style={styles.subTitle}>
                    {user.status}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 5,
        height: 70,
        alignItems: "center",
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    name: { fontWeight: "bold" },
    content: { flex: 1 },
    subTitle: {
        color: "gray",
    },
});
export default ContactListItem;
