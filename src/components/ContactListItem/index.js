// RN
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

// Utils
import dayjs from "dayjs";
dayjs.extend(relativeTime);
import relativeTime from "dayjs/plugin/relativeTime";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const ContactListItem = ({
    user,
    onPress = () => {},
    selectable = false,
    isSelected = false,
}) => {
    const navigation = useNavigation();

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image
                source={{
                    uri: user.image,
                }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.name}>
                    {user.name}
                </Text>

                <Text numberOfLines={2} style={styles.subTitle}>
                    {user.status}
                </Text>
            </View>
            {selectable &&
                (isSelected ? (
                    <AntDesign name="checkcircle" size={24} color="royalblue" />
                ) : (
                    <FontAwesome
                        name="circle-thin"
                        size={24}
                        color="lightgray"
                    />
                ))}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 5,
        height: 70,
        alignItems: "center",
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    name: { fontWeight: "bold" },
    content: { flex: 1, marginRight: 10 },
    subTitle: {
        color: "gray",
    },
});
export default ContactListItem;
