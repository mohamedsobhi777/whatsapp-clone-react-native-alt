import { StyleSheet, Text, View } from "react-native";
import Navigator from "./navigation";

// AWS
import { Amplify } from 'aws-amplify'
import awsconfig from "./src/aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

function App() {
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

export default withAuthenticator(App);
