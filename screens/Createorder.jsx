import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, Image, SafeAreaView, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getMenus, getMenuDetails } from "../api"; // Import your API functions

function Createorder() {
  const [refreshing, setRefreshing] = useState(false);
  const [menu, setMenu] = useState([]);
  const [menuItem, setMenuItem] = useState(null);
  const navigation = useNavigation();

  const fetchMenu = async () => {
    try {
      const data = await getMenus(); // Call your getMenus function
      setMenu(data); // Update state with menu data
    } catch (error) {
      handleError(error); // Handle errors
    }
  };

  const fetchMenuItem = async (id) => {
    try {
      const data = await getMenuDetails(id); // Call your getMenuDetails function
      setMenuItem(data); // Update state with menu item details
      navigation.navigate('Menudetail', { item: data }); // Navigate to menu detail screen
    } catch (error) {
      handleError(error); // Handle errors
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMenu();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      Alert.alert("Unauthorized", "Please log in to access this page.");
    } else {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch menu data. Please try again later.");
    }
  };

  return (
    <>
      <Appbar.Header className="rounded-b-xl">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Point Of Sale" />
      </Appbar.Header>
      <SafeAreaView>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View className="flex-row p-4">
            <View className="flex-1">
              <View className="flex-wrap flex-row justify-around">
                {menu.length > 0 ? (
                  menu.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => fetchMenuItem(item.id)} className="w-1/3 gap-2">
                      <View className="bg-red-800 rounded-xl p-2">
                        <View className="bg-white p-4 rounded-xl">
                          <Image className="w-12 h-24 mx-auto" source={{ uri: `https://admin.beilcoff.shop/storage/${item.img}` }} />
                        </View>
                        <Text className="text-base text-white font-bold">{item.name}</Text>
                        <Text className="text-xs text-white font-light" numberOfLines={1}>{item.description}</Text>
                        <Text className="text-white text-sm">$ {item.price}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="flex-1 justify-center items-center w-full">
                    <Text className="text-gray-600">No menu items available.</Text>
                  </View>
                )}
              </View>
            </View>
            <View className="bg-white p-2 rounded-xl w-1/4 h-64">
              <Text className="text-center font-bold text-xl">Cart</Text>
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600">Cart is empty.</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export default Createorder;
