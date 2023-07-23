import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import ChatsScreens from "./src/screens/ChatsScreen";
import ChatScreen from "./src/screens/ChatScreen";
import Navigator from "./navigation";

export default function App() {
    return (
        <View style={styles.container}>
            {/* <ChatsScreens /> */}
            {/* <ChatScreen /> */}
            <Navigator />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "whitesmoke",
        justifyContent: "center",
    },
});
