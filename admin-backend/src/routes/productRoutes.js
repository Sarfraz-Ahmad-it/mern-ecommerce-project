const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const adminAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminAuth, addProduct);

router.get("/", adminAuth, getAllProducts);

router.get("/:id", adminAuth, getProductById);

router.put("/:id", adminAuth, updateProduct);

router.delete("/:id", adminAuth, deleteProduct);

module.exports = router;