import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, Image } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


function Createorder() {
  const [refreshing, setRefreshing] = useState(false);
  const [menu, setMenu] = useState([]);
  const navigation = useNavigation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
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
        <Appbar.Content title="Set Order" />
      </Appbar.Header>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="flex-1 bg-gray-100">
          <View className="flex-row justify-between p-4">
            {menu.length > 0 ? (
              menu.map((item, index) => (
                <View key={index} className="p-5 bg-red-600 rounded-xl ">
                  <Image className="w-12 h-24 mx-auto" source={{ uri: `https://admin.beilcoff.shop/storage/${item.img}` }} />
                  <Text className="text-lg text-white font-bold">{item.name}</Text>
                  <Text className="text-white text-sm">${item.price}</Text>
                </View>
              ))
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600">No menu items available.</Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </>
  )
}

export default Createorder
