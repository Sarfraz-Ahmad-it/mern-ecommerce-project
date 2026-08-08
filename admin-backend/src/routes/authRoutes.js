const adminAuth = require("../middleware/authMiddleware");
const express = require("express");
const {
  createAdmin,
  loginAdmin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);

router.get("/protected", adminAuth, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    adminId: req.adminId,
  });
});

module.exports = router;