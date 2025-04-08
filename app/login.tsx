import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/auth';


export default function App() {
    const { user, EmailSignIn, EmailRegister } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    async function login(email: string, password: string) {
        EmailSignIn(email, password);
    }

    async function register(email: string, password: string, name: string) {
        EmailRegister(email, password, name);
    }

    if (user) {
        return <Redirect href="/" />;
    }

    return (
        <View style={styles.root}>
            <Text>
                Register or Login
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
  

