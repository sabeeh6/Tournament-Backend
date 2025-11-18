import { User } from "../../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, role, streetAddress, state, zipcode } =
      req.body;

    // logger.info("Creating new user", { email, role });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    //   logger.warn("User creation failed: Email already exists", { email });
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      streetAddress,
      state,
      zipcode,
    });

    await user.save();

    // logger.info("User created successfully", { userId: user._id, email });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user: userResponse },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
console.log(req.body);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const signOut = (req, res) => {
    clearCookies(res);
    console.log("Cookies clear");
    
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};
