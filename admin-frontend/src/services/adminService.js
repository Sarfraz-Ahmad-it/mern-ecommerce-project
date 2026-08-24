import axios from "axios";
import api from "./api";

const API_URL = "http://localhost:5000/api/admin";

// Admin Login
export const adminLogin = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  return response.data;
};

// Get all products
export const getAdminProducts = async () => {
  const response = await api.get("/products");

  return response.data;
};

// Get single product
export const getAdminProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

// Create product
export const createAdminProduct = async (productData) => {
  const response = await api.post("/products", productData);

  return response.data;
};

// Update product
export const updateAdminProduct = async (id, productData) => {
  const response = await api.put(
    `/products/${id}`,
    productData
  );

  return response.data;
};

// Delete product
export const deleteAdminProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};


// ORDER APIs


// Get all orders
export const getAdminOrders = async () => {
  const response = await api.get("/orders");

  return response.data;
};

// Get single order
export const getAdminOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);

  return response.data;
};

// Update order status
export const updateAdminOrderStatus = async (id, status) => {
  const response = await api.put(
    `/orders/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");

  return response.data;
};