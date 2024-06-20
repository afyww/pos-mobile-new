import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, SafeAreaView } from 'react-native';
import { Appbar, DataTable, Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

function History() {
    const [startIndex, setStartIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5); 
    const [history, setHistory] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const numberOfItemsPerPageList = [5, 10, 15]; 

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchHistory().finally(() => setRefreshing(false));
    }, []);

    const fetchHistory = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('Unauthorized: JWT token not found.');
            }

            const response = await axios.get('https://admin.beilcoff.shop/api/historys', {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('API Response:', response.data);

            if (response.data && Array.isArray(response.data)) {
                setHistory(response.data); 
            } else {
                console.log('No orders found');
                setHistory([]);
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
        fetchHistory();
    }, [fetchHistory]);

    const handleItemsPerPageChange = useCallback((value) => {
        setItemsPerPage(value);
        setStartIndex(0); // Reset startIndex when changing items per page
    }, []);

    const endIndex = Math.min(startIndex + itemsPerPage, history.length);

    return (
        <PaperProvider>
            <>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="History" />
                </Appbar.Header>
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                        <View style={{ padding: 16 }}>
                            {history.length > 0 ? (
                                <DataTable>
                                    <DataTable.Header>
                                        <DataTable.Title><Text>No</Text></DataTable.Title>
                                        <DataTable.Title><Text>Date</Text></DataTable.Title>
                                        <DataTable.Title><Text>Order Id</Text></DataTable.Title>
                                        <DataTable.Title><Text>Name</Text></DataTable.Title>
                                        <DataTable.Title><Text>Chair</Text></DataTable.Title>
                                        <DataTable.Title><Text>Order</Text></DataTable.Title>
                                        <DataTable.Title><Text>Total</Text></DataTable.Title>
                                        <DataTable.Title><Text>Status</Text></DataTable.Title>
                                    </DataTable.Header>
                                    {history.slice(startIndex, endIndex).map((item, index) => (
                                        <DataTable.Row key={index}>
                                            <DataTable.Cell><Text>{startIndex + index + 1}</Text></DataTable.Cell>
                                            <DataTable.Cell><Text>{moment(item.created_at).format("MM/DD/YYYY")}</Text></DataTable.Cell>
                                            <DataTable.Cell><Text>{item.no_order}</Text></DataTable.Cell>
                                            <DataTable.Cell><Text>{item.name}</Text></DataTable.Cell>
                                            <DataTable.Cell><Text>{item.kursi}</Text></DataTable.Cell>
                                            <DataTable.Cell><Text>{item.order}</Text></DataTable.Cell>
                                            <DataTable.Cell><Text>{item.total_amount}</Text></DataTable.Cell>
                                            <DataTable.Cell><Text>{item.status}</Text></DataTable.Cell>
                                        </DataTable.Row>
                                    ))}
                                    <DataTable.Pagination
                                        page={Math.floor(startIndex / itemsPerPage)}
                                        numberOfPages={Math.ceil(history.length / itemsPerPage)}
                                        onPageChange={(page) => setStartIndex(page * itemsPerPage)}
                                        label={`${startIndex + 1}-${endIndex} of ${history.length}`}
                                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                                        numberOfItemsPerPage={itemsPerPage}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                        showFastPaginationControls
                                        selectPageDropdownLabel={'Rows per page'}
                                    />
                                </DataTable>
                            ) : (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>No order available.</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        </PaperProvider>
    );
}

export default History;
