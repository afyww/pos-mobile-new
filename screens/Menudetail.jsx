import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, Image, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

function Menudetail() {
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const { item } = route.params;

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    const addToCartHandler = async () => {
        try {
            const response = await addToCart(token, menu, quantity, notes);
            if (response) {
                setQuantity(1);
                setNotes('');
                console.log('Item added to cart successfully:', response);
                navigate('/pricelist');
            } else {
                console.error('Failed to add item to cart.');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    return (
        <>
            <Appbar.Header className="rounded-b-xl">
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Detailes" />
            </Appbar.Header>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <View className="p-4">
                        <View className="flex-row justify-between">
                            <View className="w-1/2">
                                <Image className="w-36 h-60 mx-auto" source={{ uri: `https://admin.beilcoff.shop/storage/${item.img}` }} />
                            </View>
                            <View className="w-1/2 space-y-4">
                                <Text className="text-2xl font-bold mt-4">{item.name}</Text>
                                <Text className="text-gray-600 mt-2">{item.description}</Text>
                                <Text className="text-xl font-semibold mt-4">$ {item.price}</Text>
                                <View className="space-y-2">
                                    <Text className="text-xl font-light">*Notes</Text>
                                    <TextInput
                                        className="p-2 border border-gray-300 rounded-xl h-20"
                                        placeholder="Add notes here..."
                                        value={notes}
                                        onChangeText={setNotes}
                                        textAlignVertical="top"
                                        multiline
                                        numberOfLines={4}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

export default Menudetail;
