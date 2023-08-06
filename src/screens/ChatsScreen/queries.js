export const listChatRooms = /* GraphQL */ `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            ChatRooms(filter: { _deleted: { ne: true } }) {
                items {
                    _deleted
                    chatRoom {
                        id
                        updatedAt
                        name
                        image
                        users {
                            items {
                                user {
                                    id
                                    image
                                    name
                                }
                            }
                        }
                        LastMessage {
                            id
                            createdAt
                            text
                        }
                    }
                }
            }
        }
    }
`;
