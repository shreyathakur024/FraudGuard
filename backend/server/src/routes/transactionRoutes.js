const express = require("express");

const {
    getTransactions,
    predictTransactionController,
} = require("../controllers/transactionController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's transactions
router.get("/", authenticateToken, getTransactions);

// ML prediction
router.post("/predict", authenticateToken, predictTransactionController);

module.exports = router;