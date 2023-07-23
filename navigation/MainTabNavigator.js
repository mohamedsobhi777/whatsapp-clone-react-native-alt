import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "../src/screens/ChatsScreen";
import { Entypo, Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Chats"
            screenOptions={{
                tabBarStyle: { backgroundColor: "whitesmoke" },
                headerStyle: { backgroundColor: "whitesmoke" },
            }}
        >
            <Tab.Screen
                name="Status"
                component={ChatsScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="logo-whatsapp" size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Calls"
                component={ChatsScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="call-outline" size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Camera"
                component={ChatsScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="camera-outline" size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Chats"
                component={ChatsScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="ios-chatbubbles-sharp" size={size} />
                    ),
                    headerRight: () => (
                        <Entypo
                            name="new-message"
                            size={18}
                            color="royalblue"
                            style={{ marginRight: 15 }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={ChatsScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="settings-outline" size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
