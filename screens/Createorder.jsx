import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, Image, SafeAreaView, Alert, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

function Createorder() {
  const [refreshing, setRefreshing] = useState(false);
  const [menu, setMenu] = useState([]);
  const [menuItem, setMenuItem] = useState(null);
  const navigation = useNavigation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMenu();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const fetchMenu = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) {
        Alert.alert("Unauthorized", "Please log in to access this page.");
        return;
      }

      const response = await axios.get("https://admin.beilcoff.shop/api/menus", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);  // Log the entire response

      if (Array.isArray(response.data)) {
        setMenu(response.data);
      } else {
        console.log("No menus found or response format is incorrect");
        setMenu([]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const fetchMenuItem = async (id) => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) {
        Alert.alert("Unauthorized", "Please log in to access this page.");
        return;
      }

      const response = await axios.get(`https://admin.beilcoff.shop/api/menus/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);  // Log the entire response

      setMenuItem(response.data);
    } catch (error) {
      handleError(error);
    }
  };

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
          <View className="flex flex-wrap p-2">
            {menu.length > 0 ? (
              menu.map((item, index) => (
                <View key={index} className="p-2 bg-red-800 rounded-xl w-1/5">
                  <View className="bg-white p-4 rounded-xl">
                    <Image className="w-12 h-24 mx-auto" source={{ uri: `https://admin.beilcoff.shop/storage/${item.img}` }} />
                  </View>
                  <Text className="text-base text-white font-bold">{item.name}</Text>
                  <Text className="text-xs text-white font-light" numberOfLines={1}>{item.description}</Text>
                  <Text className="text-white text-sm">$ {item.price}</Text>
                  <TouchableOpacity onPress={() => fetchMenuItem(item.id)}>
                    <Text className="text-blue-500">View Details</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600">No menu items available.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default Createorder;
