const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: 5 },
    });

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const confirmedOrders = await Order.countDocuments({
      orderStatus: "Confirmed",
    });

    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
    });

    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      stats: {
        totalProducts,
        lowStockProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
      },
    });
  } catch (error) {
    console.log("Failed to fetch dashboard stats:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
};

module.exports = {
  getDashboardStats,
};