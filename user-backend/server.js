const productRoutes = require("./src/routes/productRoutes");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("User Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});