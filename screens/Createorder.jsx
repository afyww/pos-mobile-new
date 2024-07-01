import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getMenus, getMenuDetails, fetchCart, fetchCartId, removeFromCart } from "../api";

function Createorder() {
  const [refreshing, setRefreshing] = useState(false);
  const [menu, setMenu] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [cart, setCart] = useState({ cart_menus: [] });
  const navigation = useNavigation();

  const fetchMenu = async () => {
    try {
      const data = await getMenus();
      setMenu(data);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchMenuItem = async (id) => {
    try {
      const data = await getMenuDetails(id);
      setMenu(data);
      navigation.navigate("Menudetail", { item: data });
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const fetchCartIdFromAPI = async () => {
      try {
        const id = await fetchCartId();
        setCartId(id);
      } catch (error) {
        console.error('Error fetching cart ID:', error);
        handleError(error);
      }
    };

    fetchCartIdFromAPI();
  }, []);

  useEffect(() => {
    const fetchCartData = async () => {
      if (cartId) {
        try {
          const cartData = await fetchCart(cartId);
          setCart(cartData);
        } catch (error) {
          console.error('Error fetching cart data:', error);
          handleError(error);
        }
      }
    };

    fetchCartData();

    const intervalId = setInterval(fetchCartData, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [cartId]);

  const handleRemoveFromCart = async (cartMenuId) => {
    try {
      console.log('Removing item from cart...', cartMenuId);
      const newCartMenus = cart.cart_menus.filter(item => item.id !== cartMenuId);
      setCart(prevCart => ({ ...prevCart, cart_menus: newCartMenus }));
      
      await removeFromCart(cartId, cartMenuId);
      const updatedCart = await fetchCart(cartId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      handleError(error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMenu().finally(() => setRefreshing(false));
  }, []);

  const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      Alert.alert("Unauthorized", "Please log in to access this page.");
    } else {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch data. Please try again later.");
    }
  };

  const memoizedMenu = useMemo(() => menu, [menu]);
  const memoizedCart = useMemo(() => cart, [cart]);

  return (
    <>
      <Appbar.Header className="rounded-b-xl">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Point Of Sale" />
      </Appbar.Header>
      <ScrollView
        className=""
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-row p-4">
          <View className="flex-1">
            <View className="flex-wrap flex-row justify-between">
              {memoizedMenu.length > 0 ? (
                memoizedMenu.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => fetchMenuItem(item.id)}
                    className="w-1/3 p-2"
                  >
                    <View className="">
                      <View className="bg-white rounded-xl">
                        <View className="p-4">
                          <Image
                            className="w-12 h-24 mx-auto"
                            source={{
                              uri: `https://admin.beilcoff.shop/storage/${item.img}`,
                            }}
                          />
                        </View>
                        <View className="p-2">
                          <Text className="text-base text-black font-bold">
                            {item.name}
                          </Text>
                          <Text
                            className="text-xs text-black font-light"
                            numberOfLines={1}
                          >
                            {item.description}
                          </Text>
                          <Text className="text-black text-sm">
                            $ {item.price}
                          </Text>
                        </View>
                      </View>
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
          <View className="bg-blue-400 h-96 rounded-xl w-1/3">
            <View className="border-b-2 border-white">
              <Text className="text-center text-white p-4 font-bold text-2xl">Cart</Text>
            </View>
            {memoizedCart.cart_menus && memoizedCart.cart_menus.length > 0 ? (
              memoizedCart.cart_menus.map((cartMenu, index) => (
                <View key={index} className="flex-row justify-between p-2 border-white border-b-2 items-center">
                  <View className="flex-1 space-y-1">
                    <Text className="font-bold text-white text-sm">{cartMenu.quantity} x {cartMenu.menu.name}</Text>
                    <Text className="font-extralight text-white text-sm">- {cartMenu.notes}</Text>
                    <Text className="font-semibold text-white text-sm">Subtotal: Rp.{cartMenu.subtotal}</Text>
                  </View>
                  <TouchableOpacity className="bg-red-500 p-2 rounded-xl" onPress={() => handleRemoveFromCart(cartMenu.id)}>
                    <Text className="text-white">Remove</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600">Cart is empty.</Text>
              </View>
            )}
            <View className="p-3">
              <Text className="font-bold text-white text-xl">Total: Rp.{memoizedCart.total_amount}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default Createorder;
