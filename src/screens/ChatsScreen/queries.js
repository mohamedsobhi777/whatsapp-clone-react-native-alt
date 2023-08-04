export const listChatRooms = /* GraphQL */ `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            ChatRooms {
                items {
                    chatRoom {
                        id
                        users {
                            items {
                                user {
                                    name
                                    id
                                    image
                                }
                            }
                        }
                        LastMessage {
                            id
                            text
                            createdAt
                        }
                    }
                }
            }
        }
    }
`;
