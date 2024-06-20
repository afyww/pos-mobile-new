import React, { useState, useCallback, useEffect } from "react";
import {
<<<<<<< HEAD
    View,
    Text,
    Alert,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Image,
    SafeAreaView,
=======
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  SafeAreaView,
>>>>>>> 52ec50953301f13c48758e781ab29b1b73d0ae5a
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const [user, setUser] = useState({});
  const [profil, setProfil] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllLines, setShowAllLines] = useState(false);
  const navigation = useNavigation();

<<<<<<< HEAD
    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem("jwtToken");
            if (!token) {
                return Alert.alert("No token found", "You are not logged in.");
            }
            const response = await axios.post(
                "https://admin.beilcoff.shop/api/logout",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                await AsyncStorage.removeItem("jwtToken");
                navigation.navigate("Login");
            } else {
                Alert.alert("Logout failed", response.data.message);
            }
        } catch (error) {
            Alert.alert(
                "Logout error",
                error.response?.data?.message || "Something went wrong"
            );
=======
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) {
        return Alert.alert("No token found", "You are not logged in.");
      }
      const response = await axios.post(
        "https://admin.beilcoff.shop/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
>>>>>>> 52ec50953301f13c48758e781ab29b1b73d0ae5a
        }
      );

      if (response.data.success) {
        await AsyncStorage.removeItem("jwtToken");
        navigation.navigate("Login");
      } else {
        Alert.alert("Logout failed", response.data.message);
      }
    } catch (error) {
      Alert.alert(
        "Logout error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const navigateToMenu = () => {
    navigation.navigate("Menu");
  };

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
    const fetchData = async (endpoint, setState) => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (!token) {
          return Alert.alert(
            "Unauthorized",
            "Please log in to access this page."
          );
        }

        const response = await axios.get(
          `https://admin.beilcoff.shop/api/${endpoint}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setState(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          Alert.alert("Unauthorized", "Please log in to access this page.");
        } else {
          console.error("Error fetching data:", error);
          Alert.alert(
            "Error",
            `Failed to fetch ${endpoint} data. Please try again later.`
          );
        }
      }
    };

<<<<<<< HEAD
    const navigateToMenu = () => {
        navigation.navigate("Menu");
    };

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
        const fetchData = async (endpoint, setState) => {
            try {
                const token = await AsyncStorage.getItem("jwtToken");
                if (!token) {
                    return Alert.alert(
                        "Unauthorized",
                        "Please log in to access this page."
                    );
                }

                const response = await axios.get(
                    `https://admin.beilcoff.shop/api/${endpoint}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setState(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    Alert.alert("Unauthorized", "Please log in to access this page.");
                } else {
                    console.error("Error fetching data:", error);
                    Alert.alert(
                        "Error",
                        `Failed to fetch ${endpoint} data. Please try again later.`
                    );
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
        <SafeAreaView className="bg-red-900 h-full">
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className="items-center justify-center">
                    <View className="bg-red-900 rounded-b-xl">
                        <View className="p-10 space-y-4">
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
                                        className="rounded-3xl p-4 space-y-5 border-4 border-amber-100"
                                    >
                                        <View className="">
                                            <View className="my-auto">
                                                <Text className="text-xl font-extrabold text-white">
                                                    {profile.name}
                                                </Text>
                                            </View>
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
                                        </View>
                                        <Text className="text-base font-bold text-white">
                                            {profile.jam}
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    </View>
                    <View className="p-10 w-full">
                        <View className="bg-gray-100 rounded-xl flex-row justify-between w-full">
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
=======
    fetchData("profil", setProfil);
    fetchData("user", setUser);
  }, []);

  const toggleLines = () => {
    setShowAllLines(!showAllLines);
  };

  return (
    <SafeAreaView className="bg-red-900">
      <ScrollView
        className=""
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="h-screen flex-1 justify-center">
          <View className="bg-red-900 rounded-b-xl">
            <View className="p-10 space-y-4">
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
                    className="rounded-3xl p-4 space-y-5 border-4 border-amber-100"
                  >
                    <View className="">
                      <View className="my-auto">
                        <Text className="text-xl font-extrabold text-white">
                          {profile.name}
                        </Text>
                      </View>
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
                    </View>
                    <Text className="text-base font-bold text-white">
                      {profile.jam}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
          <View className="p-10">
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
>>>>>>> 52ec50953301f13c48758e781ab29b1b73d0ae5a
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
