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
} from "react-native";

// Assets
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

// AWS
import { API, Auth, Storage, graphqlOperation } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../graphql/mutations";

// Uitls
import * as ImagePicker from "expo-image-picker";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const uploadFile = async (fileUri) => {
    try {
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const key = `${uuidv4()}.png`;
        await Storage.put(key, blob, {
            contentType: "image/png",
        });
        // console.log("za key") ;
        // console.log(key) ;
        return key;
    } catch (err) {
        console.log("Error uploading file:", err);
    }
};

const InputBox = ({ chatroom }) => {
    const [text, setText] = useState("");
    const [images, setImages] = useState(null);

    const onSend = async () => {
        const authUser = await Auth.currentAuthenticatedUser();
        // console.warn("Sending a new message: " + newMessage);
        const newMessage = {
            chatroomID: chatroom.id,
            text,
            userID: authUser.attributes.sub,
        };

        if (images.length > 0) {
            newMessage.images = await Promise.all(images.map(uploadFile));
            setImages([]);
            // [await uploadFile(images)];
        }

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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsMultipleSelection: true,
        });
        console.log("die results");
        console.log(result);
        console.log("ende results");
        if (!result.canceled) {
            // console.log(result.assets[0].uri);
            setImages(result.assets.map((resultItem) => resultItem.uri));
        }
    };

    return (
        <>
            {images?.length > 0 && (
                <View style={styles.attachmentsContainer}>
                    <FlatList
                        data={images}
                        horizontal
                        renderItem={({ item }) => (
                            <>
                                <Image
                                    source={{ uri: item }}
                                    style={styles.selectedImage}
                                    resizeMode="contain"
                                />
                                <MaterialIcons
                                    name="highlight-remove"
                                    onPress={() => {
                                        setImages((prev) =>
                                            prev.filter(
                                                (listItem) => listItem !== item
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
