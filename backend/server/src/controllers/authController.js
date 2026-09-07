const {
  signupUser,
  loginUser,
} = require("../services/authService");
const prisma = require("../lib/prisma");


// SIGNUP

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await signupUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);

    if (error.message === "An account with this email already exists") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create account. Please try again later.",
    });
  }
};

// LOGIN

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });

  } catch (error) {
    console.error("Login error:", error);

    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again later.",
    });
  }
};


const getCurrentUser = async (req, res) =>  {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user",
    });
  }
}


module.exports = {
  signup,
  login,
  getCurrentUser,
};