import React, { useState, useCallback, useEffect } from "react";
import {View, Text, Alert, TouchableOpacity, ScrollView, RefreshControl, Image, SafeAreaView,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutHandler, getProfil, fetchData } from "../api";

export default function Home() {
  const [user, setUser] = useState({});
  const [profil, setProfil] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllLines, setShowAllLines] = useState(false);
  const navigation = useNavigation();
  const handleLogout = useCallback(async () => {
    try {
        await logoutHandler();
        await AsyncStorage.removeItem("jwtToken");
        navigation.navigate("Login");
    } catch (error) {
        console.error('Error during logout:', error);
    }
}, [navigation]);



  const navigateToOrder = () => {
    navigation.navigate("Order");
  };

  const navigateToSetllement = () => {
    navigation.navigate("Settlement");
  };

  const navigateToHistory = () => {
    navigation.navigate("History");
  };

  const navigateToSetting = () => {
    navigation.navigate("Setting");
  };

  const navigateToCreateOrder = () => {
    navigation.navigate("Createorder");
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);


useEffect(() => {
  const fetchUserProfil = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) {
        navigation.navigate("Login");
        return;
      }

      const user = await fetchData(token);
      const profil = await getProfil();
      setUser(user);
      setProfil(profil);
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    }
  };

  fetchUserProfil();
}, [navigation]);

  const toggleLines = () => {
    setShowAllLines(!showAllLines);
  };

  return (
    <SafeAreaView className="bg-red-800 h-full">
      <ScrollView
        className=""
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="">
          <View className="bg-red-800 rounded-b-3xl">
            <View className="space-y-4 p-10">
              <View className="flex-row justify-center space-x-1">
                <Image
                  className="w-fit h-fit"
                  source={require("../assets/beilcoff.png")}
                />
                <Text className="text-xl font-semibold text-white my-auto">
                  Beilcoff
                </Text>
              </View>
              {profil &&
                profil.map((profile, index) => (
                  <View
                    key={index}
                    className="rounded-3xl border-4 border-amber-100 p-4"
                  >
                    <View className="space-y-4">
                      <Text className="text-xl font-extrabold text-white">
                        {profile.name}
                      </Text>
                      <TouchableOpacity onPress={toggleLines}>
                        <Text
                          numberOfLines={showAllLines ? undefined : 1}
                          style={{
                            fontSize: 16,
                            fontWeight: "semibold",
                            color: "white",
                          }}
                        >
                          {profile.alamat}
                        </Text>
                      </TouchableOpacity>
                      <Text className="text-base font-bold text-white">
                        {profile.jam}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
          <View className="">
            <View className="bg-gray-100 rounded-xl flex-row justify-between">
              <View className="w-1/2 p-6 my-auto">
                <View className="">
                  <TouchableOpacity
                    className="p-4 bg-red-800 rounded-xl"
                    onPress={navigateToCreateOrder}
                  >
                    <Text className="text-2xl text-center my-auto font-extrabold text-white">
                      Point Of Sale 
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="p-2">
                  <View className="p-3 space-y-4">
                    <View className="flex-row justify-between">
                      <TouchableOpacity onPress={navigateToOrder} className="">
                        <View className="p-5 rounded-xl bg-amber-200">
                          <Image
                            className="w-10 h-10"
                            source={require("../assets/listing.png")}
                          />
                        </View>
                        <Text className="text-center text-lg text-black font-semibold my-auto">
                          Listing
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={navigateToHistory}
                        className=""
                      >
                        <View className="p-5 rounded-xl bg-amber-200">
                          <Image
                            className="w-10 h-10"
                            source={require("../assets/history.png")}
                          />
                        </View>
                        <Text className="text-center text-lg text-black font-semibold my-auto">
                          History
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={navigateToSetting}
                        className=""
                      >
                        <View className="p-5 rounded-xl bg-amber-200">
                          <Image
                            className="w-10 h-10"
                            source={require("../assets/setting.png")}
                          />
                        </View>
                        <Text className="text-center text-lg text-black font-semibold my-auto">
                          Setting
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View className="">
                  <TouchableOpacity
                    className="p-4 bg-red-800 rounded-xl"
                    onPress={handleLogout}
                  >
                    <Text className="text-2xl text-center my-auto font-extrabold text-white">
                      Logout
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="w-1/2 p-6 my-auto">
                <View className="space-y-11">
                  <View className="flex-row justify-between border-4 border-amber-100 p-4 rounded-xl">
                    <Text className="text-center text-lg text-black font-extrabold">
                      Shift
                    </Text>
                    <Text className="text-center text-lg text-black font-semibold my-auto">
                      {user.name}
                    </Text>
                  </View>
                  <View className="text-center mx-auto">
                    <Text className="text-lg text-black font-bold">
                      Total Pendapatan
                    </Text>
                    <Text className="text-lg text-black font-bold">
                      Rp.2.500.000,00
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      className="p-4 bg-red-800 rounded-xl"
                      onPress={navigateToSetllement}
                    >
                      <Text className="text-2xl text-center my-auto font-bold text-white">
                        Settlement
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
