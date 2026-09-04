const prisma = require("../lib/prisma");
const { predictTransaction } = require("../services/mlService");

const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions = await prisma.transaction.findMany({
            where: {
                userId: userId,
            },
            include: {
                prediction: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            data: {
                transactions,
            },
        });
    } catch (error) {
        console.error("Get transactions error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch transactions",
        });
    }
};


const predictTransactionController = async (req, res) => {
    try {
        const { features } = req.body;

        // Check features exists
        if (!features || !Array.isArray(features)) {
            return res.status(400).json({
                success: false,
                message: "Features array is required",
            });
        }

        // Current ML model expects exactly 30 features
        if (features.length !== 30) {
            return res.status(400).json({
                success: false,
                message: "Exactly 30 features are required",
            });
        }

        // Check that every feature is a number
        const invalidFeature = features.some(
            (feature) =>
                typeof feature !== "number" || !Number.isFinite(feature)
        );

        if (invalidFeature) {
            return res.status(400).json({
                success: false,
                message: "All features must be valid numbers",
            });
        }

        // Send features to FastAPI ML service
        const result = await predictTransaction(features);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Prediction error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Prediction failed",
        });
    }
};

module.exports = {
    getTransactions,
    predictTransactionController,
};