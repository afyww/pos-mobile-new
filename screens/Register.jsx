import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        try {
            const response = await axios.post('https://admin.beilcoff.shop/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            if (response.data.success) {
                Alert.alert('Registration successful', `Welcome, ${response.data.user.name}`);
                navigation.navigate('Login');
            } else {
                Alert.alert('Registration failed', response.data.error.message);
            }
        } catch (error) {
            Alert.alert('Registration error', 'Something went wrong');
        }
    };

    const navigateToLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <KeyboardAvoidingView className="flex-1" behavior="padding">
            <View className="bg-red-900 w-full h-full justify-center px-10 space-y-5">
                <View>
                    <Text className="text-6xl text-yellow-200 font-bold">BeilCoff</Text>
                </View>
                <View>
                    <Text className="text-4xl text-white font-bold">Registration</Text>
                    <Text className="text-xl text-white font-light">Create new account</Text>
                </View>
                <View>
                    <Text className="text-white text-xl font-semibold text-left">Name</Text>
                    <TextInput
                        className="p-3 bg-white rounded-xl border border-gray-400"
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
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
                <View>
                    <Text className="text-white text-xl font-semibold text-left">Password Confirmation</Text>
                    <TextInput
                        className="p-3 bg-white rounded-xl border border-gray-400"
                        placeholder="Password Confirmation"
                        value={passwordConfirmation}
                        onChangeText={setPasswordConfirmation}
                        secureTextEntry={true}
                    />
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-white text-lg font-light text-left">Already have an account?</Text>
                    <TouchableOpacity onPress={navigateToLogin}>
                        <Text className="text-blue-400 text-lg font-light text-left underline">Login here</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex items-center">
                    <TouchableOpacity
                        className="border-4 border-yellow-200 p-2 w-3/4 rounded-3xl"
                        onPress={handleRegister}
                    >
                        <Text className="text-white text-center font-extrabold text-2xl">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>

    );
}

export default Register;
