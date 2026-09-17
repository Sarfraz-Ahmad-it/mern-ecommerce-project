const express = require("express");

const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createOrder);

router.get("/", authMiddleware, getUserOrders);

router.get("/:id", authMiddleware, getOrderById);

router.put("/:id/cancel", authMiddleware, cancelOrder);

module.exports = router;