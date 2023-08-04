// RN
import { Button, View, StyleSheet } from "react-native";

// AWS
import { Auth } from "aws-amplify";

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <Button title="Signout" onPress={() => Auth.signOut()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
export default SettingsScreen;
