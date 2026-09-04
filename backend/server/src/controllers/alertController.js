const prisma = require("../lib/prisma");

const getAlerts = async (req, res) => {
  try {
    const userId = req.user.id;

    const alerts = await prisma.alert.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        alerts,
      },
    });
  } catch (error) {
    console.error("Get alerts error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch alerts",
    });
  }
};

module.exports = {
  getAlerts,
};