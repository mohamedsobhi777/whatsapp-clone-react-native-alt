// RN
import {
    ImageBackground,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";

// Components
import Message from "../components/Message";
import InputBox from "../components/InputBox";

// Assets
import bg from "../../assets/images/BG.png";
import messages from "../../assets/data/messages.json";

const ChatScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: route.params.name });
    }, [route.params.name]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.bg}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 120}
        >
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => <Message message={item} />}
                    style={styles.list}
                    inverted
                    showsVerticalScrollIndicator={false}
                />
                <InputBox />
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
    list: {
        padding: 10,
    },
});
export default ChatScreen;
