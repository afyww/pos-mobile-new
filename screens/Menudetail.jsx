import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, Image, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Appbar, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addToCart } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Menudetail() {
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const { item } = route.params;
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const jwtToken = await AsyncStorage.getItem("jwtToken");
                if (jwtToken) {
                    setToken(jwtToken);
                }
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    const addToCartHandler = async () => {
        try {
            const response = await addToCart(token, item, quantity, notes); // Assuming `item` is the correct menu object
            if (response) {
                setQuantity(1);
                setNotes('');
                console.log('Item added to cart successfully:', response);
                navigation.navigate("Createorder");
            } else {
                console.error('Failed to add item to cart.');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const decreaseQuantity = () => {
        setQuantity(quantity > 1 ? quantity - 1 : 1);
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <>
            <Appbar.Header className="rounded-b-xl">
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Details" />
            </Appbar.Header>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <View className="p-4">
                        <View className="flex-row justify-between">
                            <View className="w-1/2 space-y-5">
                                <View>
                                    <Image style={{ width: 144, height: 240, alignSelf: 'center' }} source={{ uri: `https://admin.beilcoff.shop/storage/${item.img}` }} />
                                </View>
                                <View className="flex-row items-center space-x-2 mx-auto">
                                    <TouchableOpacity onPress={decreaseQuantity} style={{ backgroundColor: 'black', opacity: 0.9, borderRadius: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>-</Text>
                                    </TouchableOpacity>
                                    <View style={{ width: 30, alignItems: 'center' }}>
                                        <Text style={{ color: 'black', fontSize: 16 }}>{quantity}</Text>
                                    </View>
                                    <TouchableOpacity onPress={increaseQuantity} style={{ backgroundColor: 'black', opacity: 0.9, borderRadius: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="w-1/2 space-y-2">
                                <Text className="text-2xl font-bold mt-4">{item.name}</Text>
                                <Text className="text-gray-600 mt-2">{item.description}</Text>
                                <Text className="text-xl font-semibold mt-4">$ {item.price}</Text>
                                <View className="space-y-2">
                                    <Text className="text-xl font-light">*Notes</Text>
                                    <TextInput
                                        style={{ padding: 8, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, height: 80 }}
                                        placeholder="Add notes here..."
                                        value={notes}
                                        onChangeText={setNotes}
                                        textAlignVertical="top"
                                        multiline
                                        numberOfLines={4}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={addToCartHandler}
                                    className="p-2 bg-black rounded-xl">
                                    <Text className="text-lg text-center my-auto font-extrabold text-white">
                                        Add To Cart
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

export default Menudetail;
