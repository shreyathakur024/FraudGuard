const express = require("express");
const cors = require("cors");

const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const alertRoutes = require("./routes/alertRoutes");

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "FraudGuard Node Backend"
    });
});

app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/alerts", alertRoutes);

module.exports = app;