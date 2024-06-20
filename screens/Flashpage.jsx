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
        <SafeAreaView className="bg-red-900 h-full">
            <ScrollView
                className=""
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className="flex-1 items-center justify-center">
                    <View className="space-y-3">
                        <View>
                            <Text className="text-4xl text-yellow-200 font-bold">BeilCoff</Text>
                        </View>
                        <View>
                            <Text className="text-2xl text-white font-bold">Login</Text>
                            <Text className="text-xl text-white font-light">As</Text>
                        </View>
                        <View className="flex-row space-x-2 ">
                            <TouchableOpacity onPress={openGoogle}>
                                <Text className="text-lg font-light bg-white text-black p-1">Back Office</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={navigateToLogin}>
                                <Text className="text-lg font-light bg-white text-black p-1">Cashier</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Flashpage;