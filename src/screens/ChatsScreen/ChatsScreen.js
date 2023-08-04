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
    useEffect(() => {
        const fecthChatRooms = async () => {
            const authUser = await Auth.currentAuthenticatedUser();
            const response = await API.graphql(
                graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
            );
            // console.log(response.data.getUser.ChatRooms.items);
            setChatRooms(response?.data?.getUser?.ChatRooms?.items);
        };
        fecthChatRooms();
    }, []);

    return (
        <FlatList
            data={chatRooms}
            renderItem={({ item }) => <ChatListItem chat={item.chatRoom} />}
            style={{ backgroundColor: "white" }}
        />
    );
};

export default ChatsScreen;
