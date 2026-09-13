const express = require("express");

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addToCart);

router.get("/", authMiddleware, getCart);

router.put("/", authMiddleware, updateCartQuantity);

router.delete("/:productId", authMiddleware, removeFromCart);

router.delete("/", authMiddleware, clearCart);

module.exports = router;