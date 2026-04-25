require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();

connectDB();

app.use(cors({
    origin: ["https://kirana-connect-murex.vercel.app", "http://localhost:5173"],
    credentials: true
}));
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/stores", storeRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/delivery", deliveryRoutes);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
});