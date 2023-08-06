// RN
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";

// Utils
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

// AWS
import { API, Auth, graphqlOperation } from "aws-amplify";
import { onUpdateChatRoom } from "../graphql/subscriptions";
dayjs.extend(relativeTime);

const ChatListItem = ({ chat }) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [chatRoom, setChatRoom] = useState(chat);

    useEffect(() => {
        const fetchUser = async () => {
            const authUser = await Auth.currentAuthenticatedUser();
            const userItem = chatRoom.users.items.find(
                (item) => item.user.id !== authUser.attributes.sub
            );
            setUser(userItem?.user);
        };
        fetchUser();
    }, []);

    // Subscribe to updates
    useEffect(() => {
        const subscription = API.graphql(
            graphqlOperation(onUpdateChatRoom, {
                filter: {
                    id: {
                        eq: chat.id,
                    },
                },
            })
        ).subscribe({
            next: ({ value }) => {
                setChatRoom((cr) => ({
                    ...(cr || {}),
                    ...value.data.onUpdateChatRoom,
                }));
            },
            error: () => console.log(error),
        });
        return () => subscription.unsubscribe();
    }, [chat.id]);
    return (
        <Pressable
            onPress={() =>
                navigation.navigate("Chat", {
                    id: chatRoom.id,
                    name: user?.name,
                })
            }
            style={styles.container}
        >
            <Image
                source={{
                    uri: user?.image,
                }}
                style={styles.image}
            />

            <View style={styles.content}>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>
                        {user?.name}
                    </Text>
                    {chatRoom.LastMessage && (
                        <Text style={styles.subTitle}>
                            {dayjs(chatRoom.LastMessage?.createdAt).fromNow(
                                true
                            )}
                        </Text>
                    )}
                </View>
                <Text numberOfLines={2} style={styles.subTitle}>
                    {chatRoom.LastMessage?.text}
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
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    content: {
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "lightgray",
    },
    row: {
        flexDirection: "row",
        marginBottom: 5,
    },
    name: { flex: 1, fontWeight: "bold" },
    subTitle: {
        color: "gray",
    },
});
export default ChatListItem;
