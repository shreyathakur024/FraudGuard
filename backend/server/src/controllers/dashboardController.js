const prisma = require("../lib/prisma");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total transactions
    const totalTransactions = await prisma.transaction.count({
      where: {
        userId,
      },
    });

    // Flagged / fraudulent transactions
    const flaggedTransactions = await prisma.transaction.count({
      where: {
        userId,
        prediction: {
          prediction: 1,
        },
      },
    });

    // Total amount processed
    const amountResult = await prisma.transaction.aggregate({
      where: {
        userId,
      },
      _sum: {
        amount: true,
      },
    });

    const amountProcessed = amountResult._sum.amount || 0;

    // Risk distribution
    const predictions = await prisma.prediction.groupBy({
      by: ["riskLevel"],
      where: {
        transaction: {
          userId,
        },
      },
      _count: {
        _all: true,
      },
    });

    const riskDistribution = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    predictions.forEach((item) => {
      const level = item.riskLevel?.toLowerCase();

      if (level === "low") {
        riskDistribution.low = item._count._all;
      } else if (level === "medium") {
        riskDistribution.medium = item._count._all;
      } else if (level === "high") {
        riskDistribution.high = item._count._all;
      } else if (level === "critical") {
        riskDistribution.critical = item._count._all;
      }
    });

    // Protection score
    let protectionScore = 100;

    if (totalTransactions > 0) {
      protectionScore = Math.max(
        0,
        Math.round(
          ((totalTransactions - flaggedTransactions) /
            totalTransactions) *
            100
        )
      );
    }

    // Return dashboard data
    return res.status(200).json({
      success: true,
      data: {
        totalTransactions,
        flaggedTransactions,
        amountProcessed,
        protectionScore,
        riskDistribution,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};