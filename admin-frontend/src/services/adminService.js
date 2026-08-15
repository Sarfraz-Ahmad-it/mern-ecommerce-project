import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

export const adminLogin = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  return response.data;
};

export const getAdminProducts = async () => {
  const token = localStorage.getItem("adminToken");

  const response = await axios.get(`${API_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteAdminProduct = async (id) => {
  const token = localStorage.getItem("adminToken");

  const response = await axios.delete(`${API_URL}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAdminProductById = async (id) => {
  const token = localStorage.getItem("adminToken");

  const response = await axios.get(`${API_URL}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateAdminProduct = async (id, productData) => {
  const token = localStorage.getItem("adminToken");

  const response = await axios.put(
    `${API_URL}/products/${id}`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createAdminProduct = async (productData) => {
  const token = localStorage.getItem("adminToken");

  const response = await axios.post(
    `${API_URL}/products`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};