import { View, Text } from "react-native";
import React from "react";
import { Button } from "react-native";
import { Auth } from "aws-amplify";

const SettingsScreen = () => {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Button onPress={() => Auth.signOut()} />
        </View>
    );
};

export default SettingsScreen;
