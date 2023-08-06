// AWS
import { API, graphqlOperation, Auth } from "aws-amplify";

export const getCommonGetChatRoomWithUser = async (userID) => {
    const authUser = await Auth.currentAuthenticatedUser();
    const response = await API.graphql(
        graphqlOperation(listChatRooms, {
            id: authUser.attributes.sub,
            filter: { _deleted: { ne: true } },
        })
    );

    const chatRooms = response.data?.getUser?.ChatRooms?.items || [];

    const chatRoom = chatRooms.find((chatRoomItem) => {
        return (
            chatRoomItem.chatRoom.users.items.length === 2 &&
            chatRoomItem.chatRoom.users.items.some(
                (userItem) => userItem.user.id === userID
            )
        );
    });
    return chatRoom;
};

export const listChatRooms = /* GraphQL */ `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            ChatRooms(filter: { _deleted: { ne: true } }) {
                items {
                    chatRoom {
                        id
                        users {
                            items {
                                user {
                                    id
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
