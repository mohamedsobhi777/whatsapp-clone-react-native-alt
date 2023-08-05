import { StyleSheet, Text, View } from "react-native";
import Navigator from "./navigation";
import { useEffect } from "react";

// AWS
import { Amplify, Auth, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

// API
import { getUser } from "./src/graphql/queries";
import { createUser } from "./src/graphql/mutations";

function App() {
    useEffect(() => {
        const syncUser = async () => {
            // Auth.signOut();
            const authUser = await Auth.currentAuthenticatedUser({
                bypassCache: true,
            });

            const userData = await API.graphql(
                graphqlOperation(getUser, { id: authUser.attributes.sub })
            );

            if (userData.data.getUser) {
                console.log("User already exists in the database");
                return;
            }

            const newUser = {
                id: authUser.attributes.sub,
                name: authUser.attributes.phone_number,
                status: "Hey, I am using whatsapp!",
            };

            await API.graphql(graphqlOperation(createUser, { input: newUser }));

            // console.log(newUserResponse);
            // Auth.signOut() ;

        };

        syncUser();
    }, []);

    return (
        <View style={styles.container}>
            <Navigator />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "whitesmoke",
        justifyContent: "center",
    },
});

export default withAuthenticator(App);
