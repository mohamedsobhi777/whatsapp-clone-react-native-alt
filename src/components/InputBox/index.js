// RN
import { useState } from "react";
import {
    StyleSheet,
    TextInput,
    SafeAreaView,
    Text,
    View,
    Image,
    FlatList,
    ActivityIndicator,
} from "react-native";

// Assets
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

// AWS
import { API, Auth, Storage, graphqlOperation } from "aws-amplify";
import {
    createAttachment,
    createMessage,
    updateChatRoom,
} from "../../graphql/mutations";

// Uitls
import * as ImagePicker from "expo-image-picker";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const InputBox = ({ chatroom }) => {
    const [text, setText] = useState("");
    const [files, setFiles] = useState(null);
    const [progresses, setProgresses] = useState({});

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

        await Promise.all(
            files.map((file) =>
                addAttachment(file, newMessageData.data.createMessage.id)
            )
        );

        setFiles([]);

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

    const uploadFile = async ({ uri, type }) => {
        const exts = {
            image: "png",
            video: "mp4",
        };
        const contentTypes = {
            image: "image/png",
            video: "video/mp4",
        };
        try {
            const response = await fetch(uri);

            const blob = await response.blob();
            const key = `${uuidv4()}.${exts[type]}`;
            await Storage.put(key, blob, {
                contentType: contentTypes[type],
                progressCallback: (progress) => {
                    setProgresses((p) => ({
                        ...p,
                        [uri]: progress.loaded / progress.total,
                    }));
                },
            });
            return key;
        } catch (err) {
            console.log("Error uploading file:", err);
        }
    };

    const addAttachment = async (file, messageID) => {
        const types = {
            image: "IMAGE",
            video: "VIDEO",
        };

        const newAttachment = {
            storageKey: await uploadFile(file),
            type: types[file.type],
            width: file.width,
            height: file.height,
            duration: file.duration,
            messageID,
            chatroomID: chatroom.id,
        };

        return API.graphql(
            graphqlOperation(createAttachment, { input: newAttachment })
        );
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            setFiles(result.assets);
            // setFiles(
            //     result.assets.map((item) => ({
            //         uri: item.uri,
            //         type: item.type,
            //     }))
            // );
        }
    };

    return (
        <>
            {files?.length > 0 && (
                <View style={styles.attachmentsContainer}>
                    <FlatList
                        data={files}
                        horizontal
                        renderItem={({ item }) => (
                            <>
                                <Image
                                    source={{ uri: item.uri }}
                                    style={styles.selectedImage}
                                    resizeMode="contain"
                                />

                                {progresses[item.uri] && (
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            backgroundColor: "#8c8c8c",
                                            padding: 5,
                                            borderRadius: 50,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "white",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {(
                                                progresses[item.uri] * 100
                                            ).toFixed(0)}
                                            %
                                        </Text>
                                    </View>
                                )}

                                <MaterialIcons
                                    name="highlight-remove"
                                    onPress={() => {
                                        setFiles((existingFile) =>
                                            existingFile.filter(
                                                (file) => file !== item
                                            )
                                        );
                                    }}
                                    size={20}
                                    color={"gray"}
                                    style={styles.removeSelectedImage}
                                />
                            </>
                        )}
                    />
                </View>
            )}
            <SafeAreaView edges={["bottom"]} style={styles.container}>
                <AntDesign
                    onPress={pickImage}
                    name="plus"
                    size={20}
                    color="royalblue"
                />

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
        </>
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
    attachmentsContainer: {
        alignItems: "flex-end",
    },
    selectedImage: {
        width: 100,
        height: 100,
        margin: 5,
    },
    removeSelectedImage: {
        position: "absolute",
        right: 10,
        backgroundColor: "white",
        borderRadius: 10,
        overflow: "hidden",
    },
});
export default InputBox;
