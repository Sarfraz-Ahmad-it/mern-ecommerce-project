import axios from "axios";
import api from "./api";

const API_URL = "http://localhost:5000/api/admin";

export const adminLogin = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  return response.data;
};

export const getAdminProducts = async () => {
  const response = await api.get("/products");

  return response.data;
};

export const getAdminProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

export const createAdminProduct = async (productData) => {
  const response = await api.post("/products", productData);

  return response.data;
};

export const updateAdminProduct = async (id, productData) => {
  const response = await api.put(
    `/products/${id}`,
    productData
  );

  return response.data;
};

export const deleteAdminProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};