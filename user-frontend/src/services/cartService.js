import axios from "axios";

const API = "http://localhost:5001/api/cart";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

// Get user's cart
export const getCart = async () => {
  const response = await axios.get(API, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  const response = await axios.post(
    API,
    {
      productId,
      quantity,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// Update product quantity
export const updateCartQuantity = async (
  productId,
  quantity
) => {
  const response = await axios.put(
    `${API}/${productId}`,
    {
      quantity,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  const response = await axios.delete(
    `${API}/${productId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// Clear cart
export const clearCart = async () => {
  const response = await axios.delete(API, {
    headers: getAuthHeaders(),
  });

  return response.data;
};