const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", authRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Admin Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});