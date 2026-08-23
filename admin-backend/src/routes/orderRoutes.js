const express = require("express");


const {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  createAdminOrder
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAdminOrders);

router.get("/:id", authMiddleware, getAdminOrderById);

router.put("/:id/status", authMiddleware, updateOrderStatus);

router.post("/", authMiddleware, createAdminOrder);

module.exports = router;