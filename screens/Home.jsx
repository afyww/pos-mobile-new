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
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View className="bg-gray-100 space-y-5">
                <View className="p-10 bg-red-800 rounded-3xl space-y-4">
                    <View>
                        <View className="flex-row justify-center space-x-1">
                            <Image className="my-auto " source={require('../assets/beilcoff.png')} />
                            <Text className="text-xl font-semibold text-white my-auto">Beilcoff</Text>
                        </View>
                        <Text className="text-center text-lg font-semibold text-white">Semangat Bekerja, {user.name}</Text>
                    </View>
                    {profil && profil.map((profile, index) => (
                        <View key={index} className="rounded-3xl p-4 space-y-5 border-4 border-amber-100">
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
                    <View className="flex-row justify-between">
                        <View className="my-auto">
                            <Text className="text-center text-lg text-white font-bold">Shift</Text>
                        </View>
                        <Text className="text-center text-lg text-white font-semibold my-auto">Afy</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <View className="">
                            <Text className="text-lg text-white font-bold">Total Pendapatan</Text>
                            <Text className="text-lg text-white font-bold">Rp.2.500.000,00</Text>
                        </View>
                        <TouchableOpacity className="p-2 rounded-xl my-auto bg-amber-200" onPress={navigateToSetllement}>
                            <Text className="text-center text-lg text-red-800 font-semibold my-auto">Settlement</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View className="flex-row justify-around">
                    <View className="w-2/5">
                        <TouchableOpacity className="p-4 bg-yellow-500 rounded-xl" onPress={navigateToShift}>
                            <Text className="text-lg text-center my-auto font-bold text-white">Set Shift</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="w-2/5">
                        <TouchableOpacity className="p-4 bg-blue-500 rounded-xl" onPress={navigateToCreateOrder}>
                            <Text className="text-lg text-center my-auto font-bold text-white">Set Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="p-4">
                    <View className="rounded-2xl bg-white p-3 space-y-4">
                        <View className="flex-row justify-around">
                            <TouchableOpacity onPress={navigateToOrder} className="p-1 rounded-xl">
                                <Image className="w-8 h-8 mx-auto" source={require('../assets/menu.png')} />
                                <Text className="text-center text-lg text-red-800 font-extrabold my-auto">Listing</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={navigateToHistory} className="p-1 rounded-xl">
                                <Image className="w-8 h-8 mx-auto" source={require('../assets/menu.png')} />
                                <Text className="text-center text-lg text-red-800 font-semibold my-auto">History</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={navigateToSetting} className="p-1 rounded-xl">
                                <Image className="w-8 h-8 mx-auto" source={require('../assets/menu.png')} />
                                <Text className="text-center text-lg text-red-800 font-semibold my-auto">Setting</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View className="p-4">
                    <TouchableOpacity className="p-4 bg-red-600 rounded-xl" onPress={handleLogout}>
                        <Text className="text-lg text-center my-auto font-bold text-white">Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
