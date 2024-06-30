import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, KeyboardAvoidingView, ScrollView, RefreshControl, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleLogin } from '../api';

function Login() {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await handleLogin({ email, password });
            console.log('Login response:', response);

            if (response && response.success) {
                await AsyncStorage.setItem('jwtToken', response.token);
                navigation.navigate('Home');
            } else {
                Alert.alert('Login failed', response?.message || 'Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Login error', error.message || 'Something went wrong');
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setEmail('');
            setPassword('');
        });

        return unsubscribe;
    }, [navigation]);

    const navigateToRegister = () => {
        navigation.navigate('Register');
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <SafeAreaView className="bg-red-900 h-full">
                <ScrollView
                    className=""
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View className="flex-1 justify-center">
                        <View className="mx-52">
                            <View>
                                <Text className="text-4xl text-yellow-200 font-bold">BeilCoff</Text>
                            </View>
                            <View>
                                <Text className="text-2xl text-white font-bold">Login</Text>
                                <Text className="text-xl text-white font-light">Sign in to continue</Text>
                            </View>
                            <View className="space-y-3">
                                <View>
                                    <Text className="text-white text-xl font-semibold text-left">Email</Text>
                                    <TextInput
                                        className="p-3 bg-white rounded-xl border border-gray-400"
                                        placeholder="Email"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                    />
                                </View>
                                <View>
                                    <Text className="text-white text-xl font-semibold text-left">Password</Text>
                                    <TextInput
                                        className="p-3 bg-white rounded-xl border border-gray-400"
                                        placeholder="Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={true}
                                    />
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-white text-lg font-light">Don't have an account?</Text>
                                    <TouchableOpacity onPress={navigateToRegister}>
                                        <Text className="text-blue-400 text-lg font-light underline">Register</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="flex items-center">
                                    <TouchableOpacity
                                        className="border-4 border-yellow-200 p-2 w-3/4 rounded-3xl"
                                        onPress={handleSubmit}
                                    >
                                        <Text className="text-white text-center font-extrabold text-2xl">Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default Login;
