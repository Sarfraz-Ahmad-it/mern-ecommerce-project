const Order = require("../models/Order");
// Create order
const createAdminOrder = async (req, res) => {
  try {
    const {
      customer,
      products,
      totalAmount,
      shippingAddress,
      paymentStatus,
      orderStatus,
    } = req.body;

    const order = await Order.create({
      customer,
      products,
      totalAmount,
      shippingAddress,
      paymentStatus,
      orderStatus,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log("Failed to create order:", error);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
};
// Get all orders
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.product", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log("Failed to fetch orders:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

// Get single order
const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product", "name image");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.log("Failed to fetch order:", error);

    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.log("Failed to update order status:", error);

    res.status(500).json({
      message: "Failed to update order status",
    });
  }
};

module.exports = {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  createAdminOrder
};
