import MainTabNavigator from "./MainTabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import ChatScreen from "../src/screens/ChatScreen";
import ContactsScreen from "../src/screens/ContactsScreen";
import NewGroupScreen from "../src/screens/NewGroupScreen";
import ChatRoomInfo from "../src/screens/GroupInfoScreen";
import AddContactsToGroupScreen from "../src/screens/AddContactsToGroupScreen";

const Stack = createNativeStackNavigator();
const Navigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: "whitesmoke" },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={MainTabNavigator}
                    options={{ headerShown: false }}
                />
                {/* <Stack.Screen name="Chats" component={ChatsScreen} /> */}
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Group Info" component={ChatRoomInfo} />
                <Stack.Screen name="Contacts" component={ContactsScreen} />
                <Stack.Screen name="New Group" component={NewGroupScreen} />
                <Stack.Screen
                    name="Add Contacts"
                    component={AddContactsToGroupScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigator;
