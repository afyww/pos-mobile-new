import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, Linking, ScrollView, RefreshControl, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Flashpage() {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);


    const openGoogle = () => {
        Linking.openURL('https://admin.beilcoff.shop/');
    };

    const navigateToLogin = () => {
        navigation.navigate('Login');
    };
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    return (
        <SafeAreaView className="bg-red-900">
            <ScrollView className="" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View className="bg-red-900 h-screen">
                    <View className="p-10">
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
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Flashpage;
