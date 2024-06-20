import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, Alert } from "react-native";
import { Appbar, DataTable } from 'react-native-paper';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';  // Import moment for date formatting

function Order() {
  const [order, setOrder] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrder().then(() => setRefreshing(false));
  }, []);

  const fetchOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) {
        Alert.alert("Unauthorized", "Please log in to access this page.");
        return;
      }

      const response = await axios.get("https://admin.beilcoff.shop/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);  // Log the entire response

      if (response.data.orders && Array.isArray(response.data.orders)) {
        setOrder(response.data.orders);
      } else {
        console.log("No orders found");
        setOrder([]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      Alert.alert("Unauthorized", "Please log in to access this page.");
    } else {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch order data. Please try again later.");
    }
  };

  return (
    <>
      <Appbar.Header className="rounded-b-xl">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Order" />
      </Appbar.Header>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="bg-gray-100 p-2">
          {order.length > 0 ? (
            <DataTable className="border-2">
              <DataTable.Header className="">
                <DataTable.Title><Text>No</Text></DataTable.Title>
                <DataTable.Title><Text>Date</Text></DataTable.Title>
                <DataTable.Title><Text>Order Id</Text></DataTable.Title>
                <DataTable.Title><Text>Name</Text></DataTable.Title>
                <DataTable.Title><Text>Chair</Text></DataTable.Title>
                <DataTable.Title><Text>Order</Text></DataTable.Title>
                <DataTable.Title><Text>Payment</Text></DataTable.Title>
                <DataTable.Title><Text>Total</Text></DataTable.Title>
                <DataTable.Title><Text>Status</Text></DataTable.Title>
              </DataTable.Header>
              {order.map((item, index) => (
                <DataTable.Row className="" key={index}>
                  <DataTable.Cell><Text>{index + 1}</Text></DataTable.Cell>
                  <DataTable.Cell>
                    <Text>{moment(item.created_at).format("MM/DD/YYYY")}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell><Text>{item.no_order}</Text></DataTable.Cell>
                  <DataTable.Cell><Text>{item.atas_nama}</Text></DataTable.Cell>
                  <DataTable.Cell><Text>{item.cart.user.name}</Text></DataTable.Cell>
                  <DataTable.Cell>{item.payment_type}</DataTable.Cell>
                  <DataTable.Cell>{item.cart.total_amount}</DataTable.Cell>
                  <DataTable.Cell><Text>{item.status}</Text></DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-600">No order available.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

export default Order;
