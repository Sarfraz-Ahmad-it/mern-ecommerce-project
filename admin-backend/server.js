const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");

dotenv.config();

connectDB();
const app = express();
app.use(express.json());

app.use("/api/admin", authRoutes);
app.use("/api/admin/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Admin Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});