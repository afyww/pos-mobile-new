import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, ScrollView, RefreshControl, Image, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

export default function Home() {
    const [user, setUser] = useState({});
    const [profil, setProfil] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showAllLines, setShowAllLines] = useState(false);
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem("jwtToken");
            if (!token) {
                return Alert.alert("No token found", "You are not logged in.");
            }
            const response = await axios.post("https://admin.beilcoff.shop/api/logout", {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                await AsyncStorage.removeItem("jwtToken");
                navigation.navigate("Login");
            } else {
                Alert.alert("Logout failed", response.data.message);
            }
        } catch (error) {
            Alert.alert("Logout error", error.response?.data?.message || "Something went wrong");
        }
    };

    const navigateToMenu = () => {
        navigation.navigate('Menu');
    };

    const navigateToOrder = () => {
        navigation.navigate('Order');
    };

    const navigateToSetllement = () => {
        navigation.navigate('Settlement');
    };

    const navigateToHistory = () => {
        navigation.navigate('History');
    };

    const navigateToSetting = () => {
        navigation.navigate('Setting');
    };

    const navigateToCreateOrder = () => {
        navigation.navigate('Createorder');
    };

    const navigateToShift = () => {
        navigation.navigate('Shift');
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    useEffect(() => {
        const fetchData = async (endpoint, setState) => {
            try {
                const token = await AsyncStorage.getItem("jwtToken");
                if (!token) {
                    return Alert.alert("Unauthorized", "Please log in to access this page.");
                }

                const response = await axios.get(`https://admin.beilcoff.shop/api/${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setState(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    Alert.alert("Unauthorized", "Please log in to access this page.");
                } else {
                    console.error("Error fetching data:", error);
                    Alert.alert("Error", `Failed to fetch ${endpoint} data. Please try again later.`);
                }
            }
        };

        fetchData("profil", setProfil);
        fetchData("user", setUser);
    }, []);

    const toggleLines = () => {
        setShowAllLines(!showAllLines);
    };

    return (
        <View className="">
            <ScrollView className="h-full" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View className="space-y-5">
                    <View className="p-10 bg-red-900 rounded-b-3xl space-y-4">
                        <View className="flex-row justify-center space-x-1">
                            <Image className="w-fit h-fit" source={require('../assets/beilcoff.png')} />
                            <Text className="text-xl font-semibold text-white my-auto">Beilcoff</Text>
                        </View>
                        {profil && profil.map((profile, index) => (
                            <View key={index} className="rounded-3xl p-4 space-y-5 border-4 border-amber-100 mx-24">
                                <View className="">
                                    <View className="my-auto">
                                        <Text className="text-xl font-extrabold text-white">{profile.name}</Text>
                                    </View>
                                    <TouchableOpacity onPress={toggleLines}>
                                        <Text
                                            numberOfLines={showAllLines ? undefined : 1}
                                            style={{ fontSize: 16, fontWeight: 'semibold', color: 'white' }}>
                                            {profile.alamat}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text className="text-base font-bold text-white">{profile.jam}</Text>
                            </View>
                        ))}
                    </View>
                    <View className="flex-row justify-between mx-10">
                        <View className="w-1/2 p-6">
                            <View className="">
                                <TouchableOpacity className="p-4 bg-red-800 rounded-xl" onPress={navigateToCreateOrder}>
                                    <Text className="text-lg text-center my-auto font-extrabold text-white">Point Of Sale</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="p-4">
                                <View className="p-3 space-y-4">
                                    <View className="flex-row justify-between">
                                        <TouchableOpacity onPress={navigateToOrder} className="">
                                            <View className="p-5 rounded-xl bg-amber-300">
                                                <Image className="w-10 h-10 mx-auto " source={require('../assets/listing.png')} />
                                            </View>
                                            <Text className="text-center text-lg text-black font-semibold my-auto">Listing</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={navigateToHistory} className="">
                                            <View className="p-5 rounded-xl bg-amber-300">
                                                <Image className="w-10 h-10 mx-auto" source={require('../assets/history.png')} />
                                            </View>
                                            <Text className="text-center text-lg text-black font-semibold my-auto">History</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={navigateToSetting} className="">
                                            <View className="p-5 rounded-xl bg-amber-300">
                                                <Image className="w-10 h-10 mx-auto" source={require('../assets/setting.png')} />
                                            </View>
                                            <Text className="text-center text-lg text-black font-semibold my-auto">Setting</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View className="">
                                <TouchableOpacity className="p-4 bg-red-800 rounded-xl" onPress={handleLogout}>
                                    <Text className="text-lg text-center my-auto font-extrabold text-white">Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="w-1/2 p-6">
                            <View className="my-auto space-y-5">
                                <View className="flex-row justify-around items-end">
                                    <View className="my-auto">
                                        <Text className="text-center text-lg text-black font-bold">Shift</Text>
                                    </View>
                                    <Text className="text-center text-lg text-black font-semibold my-auto">{user.name}</Text>
                                </View>
                                <View className="items-end space-y-8">
                                    <View className="">
                                        <Text className="text-lg text-black font-bold">Total Pendapatan</Text>
                                        <Text className="text-lg text-black font-bold">Rp.2.500.000,00</Text>
                                    </View>
                                    <TouchableOpacity className="p-4 bg-red-600 rounded-xl" onPress={navigateToSetllement}>
                                        <Text className="text-lg text-center my-auto font-bold text-white">Settlement</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
