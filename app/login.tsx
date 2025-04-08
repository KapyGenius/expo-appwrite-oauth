import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Client, Account, ID, Models } from 'react-native-appwrite';
import React, { useState } from 'react';
import { Redirect } from 'expo-router';

let client: Client;
let account: Account;

client = new Client();
client
    .setProject('expo-appwrite-auth')
    .setPlatform('com.kapygenius.expo-appwrite-oauth');

account = new Account(client);
export default function App() {
    const [loggedInUser, setLoggedInUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    async function login(email: string, password: string) {
        await account.createEmailPasswordSession(email, password);
        setLoggedInUser(await account.get());
    }

    async function register(email: string, password: string, name: string) {
        await account.create(ID.unique(), email, password, name);
        await login(email, password);
        setLoggedInUser(await account.get());
    }

    if (loggedInUser) {
        return <Redirect href="/" />;
    }

    return (
        <View style={styles.root}>
            <Text>
                {loggedInUser ? `Logged in as ${loggedInUser.name}` : 'Not logged in'}
            </Text>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="email"
                    value={email}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => login(email, password)}
                >
                    <Text>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => register(email, password, name)}
                >
                    <Text>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                        await account.deleteSession('current');
                        setLoggedInUser(null);
                    }}
                >
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    root: {
      marginTop: 40, 
      marginBottom: 40
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    button: {
      backgroundColor: 'gray',
      padding: 10,
      marginBottom: 10,
      alignItems: 'center',
    },
  });
  

