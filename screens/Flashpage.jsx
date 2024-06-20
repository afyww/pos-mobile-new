import React from 'react';
import { View, TouchableOpacity, Text, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';


function Flashpage() {
    const navigation = useNavigation();

    const openGoogle = () => {
        Linking.openURL('https://admin.beilcoff.shop/');
    };

    const navigateToLogin = () => {
        navigation.navigate('Login');
    };


    return (
        <View className="flex-1 bg-red-900 h-screen justify-center px-10 space-y-5">
            <View>
                <Text className="text-6xl text-yellow-200 font-bold">BeilCoff</Text>
            </View>
            <View>
                <Text className="text-4xl text-white font-bold">Login</Text>
                <Text className="text-xl text-white font-light">As</Text>
                <View className="flex-row justify-between p-6">
                    <TouchableOpacity onPress={openGoogle}>
                        <Text className="text-xl font-light bg-white text-black p-2">Back Office</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToLogin}
                    >
                        <Text className="text-xl font-light bg-white text-black p-2">Cashier</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default Flashpage;
