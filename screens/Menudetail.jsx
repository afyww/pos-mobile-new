import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Appbar, Button } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { addToCart } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Menudetail() {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const { item } = route.params;
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        if (jwtToken) {
          setToken(jwtToken);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
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
        setNotes("");
        console.log("Item added to cart successfully:", response);
        navigation.navigate("Createorder");
      } else {
        console.error("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
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
        <ScrollView
          className=""
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="p-10">
            <View className="flex-row justify-between">
              <View className="w-1/2 my-auto space-y-10">
                <View>
                  <Image
                    style={{ width: 160, height: 400, alignSelf: "center" }}
                    source={{
                      uri: `https://admin.beilcoff.shop/storage/${item.img}`,
                    }}
                  />
                </View>
                <View className="flex-row items-center space-x-2 mx-auto">
                  <TouchableOpacity
                    onPress={decreaseQuantity}
                    style={{
                      backgroundColor: "black",
                      opacity: 0.9,
                      borderRadius: 10,
                      width: 50,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 32,
                      }}
                    >
                      -
                    </Text>
                  </TouchableOpacity>
                  <View style={{ width: 80, alignItems: "center" }}>
                    <Text style={{ color: "black", fontSize: 40 }}>
                      {quantity}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={increaseQuantity}
                    style={{
                      backgroundColor: "black",
                      opacity: 0.9,
                      borderRadius: 10,
                      width: 50,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 32,
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="w-1/2 space-y-8">
                <Text className="text-4xl font-bold">{item.name}</Text>
                <Text className="text-gray-600 text-xl">
                  {item.description}
                </Text>
                <Text className="text-3xl font-semibold">$ {item.price}</Text>
                <View className="space-y-2">
                  <Text className="text-3xl font-light">*Notes</Text>
                  <TextInput
                    className="text-xl"
                    style={{
                      padding: 8,
                      borderWidth: 1,
                      borderColor: "#d1d5db",
                      borderRadius: 8,
                      height: 140,
                    }}
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
                  className="p-4 bg-black rounded-xl"
                >
                  <Text className="text-xl text-center my-auto font-extrabold text-white">
                    Add To Cart
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

export default Menudetail;
