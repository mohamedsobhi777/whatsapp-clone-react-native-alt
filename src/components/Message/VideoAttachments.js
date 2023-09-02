import { View, Text } from "react-native";
import React from "react";
import { Video } from "expo-av";

const VideoAttachments = ({ attachments, width }) => {
    return (
        <>
            {attachments.map((attachment) => (
                <Video
                    key={attachment.id}
                    useNativeControls
                    source={{
                        uri: attachment.uri,
                    }}
                    shouldPlay={false}
                    style={{
                        width: width ,
                        height:
                            (attachment.height * width) / attachment.width ,
                    }}
                    resizeMode="contain"
                />
            ))}
        </>
    );
};

export default VideoAttachments;
