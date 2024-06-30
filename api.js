import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = "https://admin.beilcoff.shop/api";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to set Authorization header
const setAuthHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// AUTH

export const handleLogin = async (user) => {
  try {
      const response = await axiosInstance.post('/login', user);
      await AsyncStorage.setItem('jwtToken', response.data.token);
      return response.data;
  } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Login failed' };
  }
};

// PROFILE 
export const getProfil = async () => {
  try {
    const response = await axiosInstance.get("/profil");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
};

// LOGOUT

export const logoutHandler = async () => {
  try {
      const token = await AsyncStorage.getItem('jwtToken');
      setAuthHeader(token);
      await axiosInstance.post('/logout');
      await AsyncStorage.removeItem('jwtToken');
      setAuthHeader(null);
  } catch (error) {
      console.error('Error during logout:', error);
      throw error;
  }
};

// REGISTER

export const handleRegister = async (user) => {
  try {
    const response = await axiosInstance.post("/register", user);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error.response.data);
    throw error.response.data;
  }
};

// FETCH DATA EACH USER WITH TOKEN

export const fetchData = async (token) => {
  try {
    setAuthHeader(token); // Assuming setAuthHeader function sets the authorization header
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// MENU API

const imageHeaders = { Accept: 'image/*' };

export const getMenus = async () => {
  try {
    const response = await axiosInstance.get("/menus", { headers: imageHeaders });
    return response.data;
  } catch (error) {
    console.error("Error fetching menus:", error);
    throw error;
  }
};

export const getMenuDetails = async (menuId) => {
  try {
    const response = await axiosInstance.get(`/menus/${menuId}`, { headers: imageHeaders });
    return response.data;
  } catch (error) {
    console.error("Error fetching menu details:", error);
    throw error;
  }
};

// CART API

export const addToCart = async (token, menu, quantity, notes) => {
  try {
    if (!token || !menu || !menu.id) {
      throw new Error("Token or menu details are missing or invalid.");
    }
    setAuthHeader(token);
    const { data: { id: cartId } } = await axiosInstance.get("/cart");
    const requestBody = { menu_id: menu.id, quantity, notes };
    const response = await axiosInstance.post(`/cart-menus/${cartId}`, requestBody);
    return response.data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
};

export const fetchCartId = async () => {
  try {
    const response = await axiosInstance.get("/cart", { headers: imageHeaders });
    return response.data.id;
  } catch (error) {
    console.error("Error fetching cartId:", error);
    throw error;
  }
};

export const fetchCart = async (cartId) => {
  try {
    const response = await axiosInstance.get(`/carts/${cartId}`, { headers: imageHeaders });
    return response.data.cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const removeFromCart = async (cartId, cartMenuId) => {
  try {
    const response = await axiosInstance.delete(`/carts/${cartId}/cart-menus/${cartMenuId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
};

// ORDERS

export const getOrder = async () => {
  try {
    const response = await axiosInstance.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const createOrder = async (cartId, atasNama, noTelpon) => {
  try {
    const response = await axiosInstance.post(`/orders/${cartId}`, {
      atas_nama: atasNama,
      no_telpon: noTelpon,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
