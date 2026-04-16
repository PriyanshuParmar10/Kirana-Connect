require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/stores", storeRoutes);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
});