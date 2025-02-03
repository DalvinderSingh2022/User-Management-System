require("./cronJobs");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const notificationRoutes = require("./routes/notification");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then((connect) => console.log("Connected to:", connect.connection.name))
    .catch((err) => console.error("Could not connect to MongoDB", err))

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notification", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));