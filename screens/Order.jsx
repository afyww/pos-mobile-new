import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, SafeAreaView } from 'react-native';
import { Appbar, DataTable, Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

function Order() {
    const [startIndex, setStartIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5); 
    const [order, setOrder] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const numberOfItemsPerPageList = [5, 10, 15]; 

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrder().finally(() => setRefreshing(false));
    }, []);

    const fetchOrder = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('Unauthorized: JWT token not found.');
            }

            const response = await axios.get('https://admin.beilcoff.shop/api/orders', {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('API Response:', response.data);

            if (response.data.orders && Array.isArray(response.data.orders)) {
                setOrder(response.data.orders); 
            } else {
                console.log('No orders found');
                setOrder([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.message.includes('Unauthorized')) {
                Alert.alert('Unauthorized', 'Please log in to access this page.');
            } else {
                Alert.alert('Error', 'Failed to fetch order data. Please try again later.');
            }
        }
    }, []);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleItemsPerPageChange = useCallback((value) => {
        setItemsPerPage(value);
        setStartIndex(0); // Reset startIndex when changing items per page
    }, []);

    const endIndex = Math.min(startIndex + itemsPerPage, order.length);

    return (
        <PaperProvider>
            <>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Orders" />
                </Appbar.Header>
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        contentContainerStyle={{ padding: 16 }}
                    >
                        {order.length > 0 ? (
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title>No</DataTable.Title>
                                    <DataTable.Title>Date</DataTable.Title>
                                    <DataTable.Title>Order Id</DataTable.Title>
                                    <DataTable.Title>Name</DataTable.Title>
                                    <DataTable.Title>Chair</DataTable.Title>
                                    <DataTable.Title>Order</DataTable.Title>
                                    <DataTable.Title>Payment</DataTable.Title>
                                    <DataTable.Title>Total</DataTable.Title>
                                    <DataTable.Title>Status</DataTable.Title>
                                </DataTable.Header>
                                {order.slice(startIndex, endIndex).map((item, index) => (
                                    <DataTable.Row key={index}>
                                        <DataTable.Cell>{startIndex + index + 1}</DataTable.Cell>
                                        <DataTable.Cell>{moment(item.created_at).format("MM/DD/YYYY")}</DataTable.Cell>
                                        <DataTable.Cell>{item.no_order}</DataTable.Cell>
                                        <DataTable.Cell>{item.atas_nama}</DataTable.Cell>
                                        <DataTable.Cell>{item.cart.user.name}</DataTable.Cell>
                                        <DataTable.Cell>
                                            {item.cart.cart_menus.map((cartMenu, idx) => (
                                                <Text key={idx}>
                                                    {cartMenu.menu.name} - {cartMenu.quantity} - {cartMenu.notes} {"\n"}
                                                </Text>
                                            ))}
                                        </DataTable.Cell>
                                        <DataTable.Cell>{item.payment_type}</DataTable.Cell>
                                        <DataTable.Cell>{item.cart.total_amount}</DataTable.Cell>
                                        <DataTable.Cell>{item.status}</DataTable.Cell>
                                    </DataTable.Row>
                                ))}
                                <DataTable.Pagination
                                    page={Math.floor(startIndex / itemsPerPage)}
                                    numberOfPages={Math.ceil(order.length / itemsPerPage)}
                                    onPageChange={(page) => setStartIndex(page * itemsPerPage)}
                                    label={`${startIndex + 1}-${endIndex} of ${order.length}`}
                                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                                    numberOfItemsPerPage={itemsPerPage}
                                    onItemsPerPageChange={handleItemsPerPageChange}
                                    showFastPaginationControls
                                    selectPageDropdownLabel={'Rows per page'}
                                />
                            </DataTable>
                        ) : (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>No orders available.</Text>
                            </View>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </>
        </PaperProvider>
    );
}

export default Order;
