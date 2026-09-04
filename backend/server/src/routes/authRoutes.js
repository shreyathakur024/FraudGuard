const express = require("express");

const {
  signup,
  login,
  getCurrentUser,
} = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get(
  "/me",
  authenticateToken,
  getCurrentUser
);

module.exports = router;