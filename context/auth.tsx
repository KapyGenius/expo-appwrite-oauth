import { createContext, useState, useEffect, useContext } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { AuthError, makeRedirectUri } from 'expo-auth-session';
import { Client, Account, ID, Models, OAuthProvider } from 'react-native-appwrite';


const client = new Client()
    .setProject('expo-appwrite-auth')
    .setPlatform('com.kapygenius.expo-appwrite-oauth');

const AuthContext = createContext({
    user: null as Models.User<Models.Preferences> | null,
    EmailSignIn: (email: string, password: string) => Promise.resolve(),
    EmailRegister: (email: string, password: string, name: string) => Promise.resolve(),
    OauthSignIn: (provider: string) => Promise.resolve(),
    signOut: () => { },
    fetchWithAuth: (url: string, options: RequestInit) => Promise.resolve(new Response()),
    isLoading: false,
    error: null as AuthError | null,
});


const account = new Account(client);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<AuthError | null>(null);
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await account.get();
                setUser(user);
            } catch (error) {
                console.log('Error fetching user:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUser();
    }, []);

    const EmailSignIn = async (email: string, password: string) => {
        await account.createEmailPasswordSession(email, password);
        setUser(await account.get());
    };

    const EmailRegister = async (email: string, password: string, name: string) => {
        await account.create(ID.unique(), email, password, name);
        await EmailSignIn(email, password);
        setUser(await account.get());
    };

    const OauthSignIn = async (provider: string) => {
        console.log("Oauth signIn");
    };

    const signOut = async () => {
        await account.deleteSession('current');
        setUser(null);
    };

    const fetchWithAuth = async (url: string, options: RequestInit) => {
        // Implement fetch with authentication logic here
        return new Response();
    };

    return (
        <AuthContext.Provider value={{ user, EmailSignIn, EmailRegister, OauthSignIn, signOut, fetchWithAuth, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
