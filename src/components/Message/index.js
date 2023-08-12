// RN
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useEffect, useState } from "react";

// Utils
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

// AWS
import { Auth, Storage } from "aws-amplify";
import { S3Image } from "aws-amplify-react-native";

import ImageView from "react-native-image-viewing";

const Message = ({ message }) => {
    const [isMe, setIsMe] = useState(false);
    const [imageSources, setImageSources] = useState([]);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);

    useEffect(() => {
        const isMyMessage = async () => {
            const authUser = await Auth.currentAuthenticatedUser();
            setIsMe(message.userID === authUser.attributes.sub);
        };
        isMyMessage();
    }, []);

    useEffect(() => {
        const downloadImages = async () => {
            if (message.images?.length > 0) {
                const url = await Storage.get(message.images[0]);
                setImageSources([{ uri: url }]);
            }
        };
        downloadImages();
    }, [message.images]);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: isMe ? "#DCF8C5" : "white",
                    alignSelf: isMe ? "flex-end" : "flex-start",
                },
            ]}
        >
            {message.images?.length > 0 && (
                <>
                    <Pressable onPress={() => setImageViewerVisible(true)}>
                        <Image source={imageSources[0]} style={styles.image} />
                    </Pressable>
                    <ImageView
                        images={imageSources}
                        imageIndex={0}
                        visible={imageViewerVisible}
                        onRequestClose={() => setImageViewerVisible(false)}
                    />
                </>
            )}
            {/* <Text>{JSON.stringify(message?.images)}</Text> */}
            <Text>{message.text}</Text>
            <Text style={styles.time}>
                {dayjs(message.createdAt).fromNow(true)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: "80%",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,

        elevation: 1,
    },
    time: {
        color: "gray",
        alignSelf: "flex-end",
    },
    image: {
        width: 200,
        height: 100,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 5,
    },
});
export default Message;
