import { Pressable, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import ImageView from "react-native-image-viewing";

const ImageAttachments = ({ attachments }) => {
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    return (
        <>
            {attachments.map((attachment, i) => (
                <Pressable
                    key={attachment.id}
                    style={[
                        styles.imageContainer,
                        attachments.length === 1 && {
                            flex: 1,
                        },
                    ]}
                    onPress={() => {
                        setSelectedIndex(i);
                        setImageViewerVisible(true);
                    }}
                >
                    <Image
                        source={{ uri: attachment.uri }}
                        style={styles.image}
                    />
                </Pressable>
            ))}
            <ImageView
                images={attachments.map(({ uri }) => ({
                    uri,
                }))}
                imageIndex={selectedIndex}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: "45%",
        aspectRatio: 1,
        padding: 3,
    },
    image: {
        flex: 1,
        height: 100,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 5,
    },
});
export default ImageAttachments;
