import axios from "axios";

const API_URL = "http://localhost:5001/api/orders";

export const createOrder = async (shippingAddress) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    {
      shippingAddress,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getUserOrders = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getOrderById = async (orderId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const cancelOrder = async (orderId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${orderId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};