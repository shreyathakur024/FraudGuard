const prisma = require("../lib/prisma");
const { predictTransaction } = require("../services/mlService");

const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {
    const earthRadius = 6371;

    const toRadians = (degree) =>
        (degree * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
};

const calculateLocationRisk = async (
    userId,
    currentLatitude,
    currentLongitude
) => {

    // Location not available
    if (
        !Number.isFinite(currentLatitude) ||
        !Number.isFinite(currentLongitude)
    ) {
        return {
            locationRiskScore: 0,
            locationAnomaly: false,
            distanceFromPrevious: null,
        };
    }


    // Find the user's latest transaction
    // that has a stored location.
    const previousTransaction =
        await prisma.transaction.findFirst({
            where: {
                userId,
                latitude: {
                    not: null,
                },
                longitude: {
                    not: null,
                },
            },

            orderBy: {
                createdAt: "desc",
            },

            select: {
                latitude: true,
                longitude: true,
            },
        });


    // No previous location available
    if (!previousTransaction) {
        return {
            locationRiskScore: 0,
            locationAnomaly: false,
            distanceFromPrevious: null,
        };
    }


    const distance = calculateDistance(
        previousTransaction.latitude,
        previousTransaction.longitude,
        currentLatitude,
        currentLongitude
    );

    let locationRiskScore = 0;
    let locationAnomaly = false;

    if (distance > 500) {
        locationRiskScore = 25;
        locationAnomaly = true;
    } else if (distance > 100) {
        locationRiskScore = 15;
        locationAnomaly = true;
    }


    return {
        locationRiskScore,
        locationAnomaly,
        distanceFromPrevious: Number(
            distance.toFixed(2)
        ),
    };
};

const getRiskLevel = (score) => {
    if (score <= 20) return "LOW";
    if (score <= 50) return "MEDIUM";
    if (score <= 75) return "HIGH";
    return "CRITICAL";
};


const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions =
            await prisma.transaction.findMany({
                where: {
                    OR: [
                        {
                            userId: userId,
                        },
                        {
                            recipientId: userId,
                        },
                    ],
                },

                include: {
                    prediction: true,

                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },

                    recipient: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
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
        console.error(
            "Get transactions error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch transactions",
        });
    }
};


const predictTransactionController = async (
    req,
    res
) => {

    try {

        const userId = req.user.id;

        const {
            recipientEmail,
            merchant,
            amount,
            paymentMethod,
            latitude,
            longitude,
        } = req.body;


        if (
            !recipientEmail ||
            !recipientEmail.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Recipient email is required",
            });
        }


        if (
            !merchant ||
            !merchant.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Merchant name is required",
            });
        }


        const transactionAmount =
            Number(amount);


        if (
            !Number.isFinite(
                transactionAmount
            ) ||
            transactionAmount <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid transaction amount is required",
            });
        }


        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment method is required",
            });
        }

        const sender =
            await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });


        if (!sender) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }

        const recipient =
            await prisma.user.findUnique({
                where: {
                    email:
                        recipientEmail
                            .trim()
                            .toLowerCase(),
                },
            });


        if (!recipient) {
            return res.status(404).json({
                success: false,
                message:
                    "Recipient account not found",
            });
        }


        if (
            recipient.id === sender.id
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "You cannot send money to yourself",
            });
        }

        if (
            transactionAmount >
            sender.balance
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Insufficient balance",
            });
        }

        const transactionDate =
            new Date();

        const transactionType =
            paymentMethod === "Card"
                ? "PAYMENT"
                : "TRANSFER";

        const oldSenderBalance =
            sender.balance;

        const oldReceiverBalance =
            recipient.balance;


        const newSenderBalance =
            oldSenderBalance -
            transactionAmount;

        const newReceiverBalance =
            oldReceiverBalance +
            transactionAmount;

        const senderBalanceChange =
            oldSenderBalance -
            newSenderBalance;

        const receiverBalanceChange =
            newReceiverBalance -
            oldReceiverBalance;


        const amountToSenderBalance =
            transactionAmount /
            (oldSenderBalance + 1);

        const amountToReceiverBalance =
            transactionAmount /
            (oldReceiverBalance + 1);

        const hour =
            transactionDate.getHours();

        const dayOfMonth =
            transactionDate.getDate();

        const step =
            ((dayOfMonth - 1) * 24) +
            hour +
            1;

        const currentLatitude =
            Number(latitude);

        const currentLongitude =
            Number(longitude);


        const hasLocation =
            Number.isFinite(
                currentLatitude
            ) &&
            Number.isFinite(
                currentLongitude
            );


        const locationResult =
            await calculateLocationRisk(
                userId,

                hasLocation
                    ? currentLatitude
                    : null,

                hasLocation
                    ? currentLongitude
                    : null
            );

        const features = [
            step,

            hour,

            transactionAmount,

            oldSenderBalance,

            newSenderBalance,

            oldReceiverBalance,

            newReceiverBalance,

            senderBalanceChange,

            receiverBalanceChange,

            amountToSenderBalance,

            amountToReceiverBalance,

            transactionType === "CASH_IN"
                ? 1
                : 0,

            transactionType === "CASH_OUT"
                ? 1
                : 0,

            transactionType === "DEBIT"
                ? 1
                : 0,

            transactionType === "PAYMENT"
                ? 1
                : 0,

            transactionType === "TRANSFER"
                ? 1
                : 0,
        ];


        // Safety check
        if (features.length !== 16) {
            return res.status(500).json({
                success: false,
                message:
                    "Internal ML feature configuration error",
            });
        }

        const mlResponse =
            await predictTransaction(
                features
            );

        const predictionData =
            mlResponse?.data ??
            mlResponse;


        if (
            !predictionData ||
            predictionData.fraud_probability === undefined
        ) {
            console.error(
                "Unexpected ML response:",
                mlResponse
            );

            throw new Error(
                "Invalid response from ML service"
            );
        }

        const modelRiskScore =
            Number(
                predictionData.risk_score
            );

        const modelRiskLevel =
            predictionData.risk_level;

        const finalRiskScore =
            Math.min(
                100,
                modelRiskScore +
                    locationResult.locationRiskScore
            );


        const finalRiskLevel =
            getRiskLevel(
                finalRiskScore
            );


        const isSuspicious =
            finalRiskLevel === "HIGH" ||
            finalRiskLevel === "CRITICAL";

        const transaction =
            await prisma.transaction.create({
                data: {

                    userId,

                    recipientId:
                        recipient.id,

                    merchant:
                        merchant.trim(),

                    amount:
                        transactionAmount,

                    paymentMethod,

                    timestamp:
                        transactionDate,

                    status:
                        isSuspicious
                            ? "FLAGGED"
                            : "COMPLETED",

                    latitude:
                        hasLocation
                            ? Number(
                                  currentLatitude.toFixed(
                                      6
                                  )
                              )
                            : null,

                    longitude:
                        hasLocation
                            ? Number(
                                  currentLongitude.toFixed(
                                      6
                                  )
                              )
                            : null,
                },
            });

        await prisma.prediction.create({
            data: {

                transactionId:
                    transaction.id,

                fraudProbability:
                    Number(
                        predictionData.fraud_probability
                    ),

                // XGBoost model risk
                riskScore:
                    modelRiskScore,

                riskLevel:
                    modelRiskLevel,

                prediction:
                    Number(
                        predictionData.prediction
                    ),

                predictionLabel:
                    predictionData.prediction_label,

                threshold:
                    Number(
                        predictionData.threshold
                    ),

                // Location signal
                locationRiskScore:
                    locationResult.locationRiskScore,

                locationAnomaly:
                    locationResult.locationAnomaly,

                // Combined risk
                finalRiskScore,

                finalRiskLevel,

                shapExplanation:
                    predictionData.shap_explanation ??
                    null,
            },
        });

        if (!isSuspicious) {

            await prisma.$transaction(
                async (tx) => {

                    // Deduct sender balance
                    const senderUpdate =
                        await tx.user.updateMany({
                            where: {
                                id: userId,

                                balance: {
                                    gte:
                                        transactionAmount,
                                },
                            },

                            data: {
                                balance: {
                                    decrement:
                                        transactionAmount,
                                },
                            },
                        });


                    if (
                        senderUpdate.count !== 1
                    ) {
                        throw new Error(
                            "Insufficient balance"
                        );
                    }


                    // Add receiver balance
                    await tx.user.update({
                        where: {
                            id:
                                recipient.id,
                        },

                        data: {
                            balance: {
                                increment:
                                    transactionAmount,
                            },
                        },
                    });
                }
            );
        }

        let alert = null;


        if (isSuspicious) {

            alert =
                await prisma.alert.create({
                    data: {

                        userId,

                        transactionId:
                            transaction.id,

                        title:
                            finalRiskLevel ===
                            "CRITICAL"
                                ? "Critical Fraud Risk Detected"
                                : "High Fraud Risk Detected",

                        message:
                            `Transaction of ₹${transactionAmount.toLocaleString(
                                "en-IN"
                            )} to ${recipient.name} has been flagged by FraudGuard.`,

                        severity:
                            finalRiskLevel,
                    },
                });
        }

        return res.status(200).json({

            success: true,

            data: {

                transaction: {
                    ...transaction,

                    recipient: {
                        id:
                            recipient.id,

                        name:
                            recipient.name,

                        email:
                            recipient.email,
                    },
                },

                fraud_probability:
                    predictionData.fraud_probability,

                model_risk_score:
                    modelRiskScore,

                model_risk_level:
                    modelRiskLevel,



                location_risk_score:
                    locationResult.locationRiskScore,

                location_anomaly:
                    locationResult.locationAnomaly,

                distance_from_previous_location:
                    locationResult.distanceFromPrevious,

                risk_score:
                    finalRiskScore,

                risk_level:
                    finalRiskLevel,

                prediction:
                    predictionData.prediction,

                prediction_label:
                    predictionData.prediction_label,

                threshold:
                    predictionData.threshold,

                shap_explanation:
                    predictionData.shap_explanation,

                alert,
            },
        });

    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Transaction analysis failed",
        });
    }
};

module.exports = {
    getTransactions,
    predictTransactionController,
};