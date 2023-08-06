// RN
import { FlatList } from "react-native";
import { useEffect, useState } from "react";

// AWS
import { API, graphqlOperation, Auth } from "aws-amplify";

// Components
import ChatListItem from "../../components/ChatListItem";

// Data
import { listChatRooms } from "./queries";

const ChatsScreen = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(false);

    const fecthChatRooms = async () => {
        setLoading(true);
        const authUser = await Auth.currentAuthenticatedUser();
        const response = await API.graphql(
            graphqlOperation(listChatRooms, {
                id: authUser.attributes.sub,
            })
        );

        const rooms = response?.data?.getUser?.ChatRooms?.items || [];
        const sortedRooms = rooms.sort(
            (room1, room2) =>
                new Date(room2.chatRoom.updatedAt) -
                new Date(room1.chatRoom.updatedAt)
        );

        setChatRooms(sortedRooms);
        setLoading(false);
    };
    useEffect(() => {
        fecthChatRooms();
    }, []);

    return (
        <FlatList
            data={chatRooms}
            renderItem={({ item }) => <ChatListItem chat={item.chatRoom} />}
            style={{ backgroundColor: "white" }}
            refreshing={loading}
            onRefresh={fecthChatRooms}
        />
    );
};

export default ChatsScreen;
