// RN
import { useState } from "react";
import { StyleSheet, TextInput, SafeAreaView } from "react-native";

// Assets
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

// AWS
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../graphql/mutations";

const InputBox = ({ chatroom }) => {
    const [text, setText] = useState("");

    const onSend = async () => {
        const authUser = await Auth.currentAuthenticatedUser();
        // console.warn("Sending a new message: " + newMessage);
        const newMessage = {
            chatroomID: chatroom.id,
            text,
            userID: authUser.attributes.sub,
        };

        const newMessageData = await API.graphql(
            graphqlOperation(createMessage, { input: newMessage })
        );
        setText("");
        console.log({
            id: chatroom.id,
            chatRoomLastMessageId: newMessageData.data.createMessage.id,
            _version: chatroom._version,
        });
        await API.graphql(
            graphqlOperation(updateChatRoom, {
                input: {
                    id: chatroom.id,
                    chatRoomLastMessageId: newMessageData.data.createMessage.id,
                    _version: chatroom._version,
                },
            })
        );
    };

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <AntDesign name="plus" size={20} color="royalblue" />

            <TextInput
                style={styles.input}
                placeholder="type your message..."
                value={text}
                onChangeText={(newText) => setText(newText)}
            />

            <MaterialIcons
                onPress={onSend}
                style={styles.send}
                name="send"
                size={16}
                color="white"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "whitesmoke",
        padding: 5,
        paddingHorizontal: 10,
        alignItems: "center",
    },
    input: {
        flex: 1,
        backgroundColor: "white",
        padding: 5,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 50,
        borderColor: "lightgray",
        borderWidth: StyleSheet.hairlineWidth,
    },
    send: {
        backgroundColor: "royalblue",
        padding: 7,
        borderRadius: 15,
        overflow: "hidden",
    },
});
export default InputBox;
