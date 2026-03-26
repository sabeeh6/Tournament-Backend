import { User, Organizor } from "../../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { clearCookies } from "../../util/cookies.js";

export const signUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      streetAddress,
      address,
      state,
      zipcode,
      number,
      role,
      status
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    if (role === "organizor") {
      newUser = new Organizor({
        name,
        email,
        password: hashedPassword,
        role: "organizor",
        streetAddress,
        address,
        state,
        zipcode,
        number,
        status: status || "inactive",
      });
    }
    // Otherwise, use regular User model
    else {
      newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "user", // Default: user
        streetAddress,
        address,
        state,
        zipcode,
        number,
      });
    }

    await newUser.save();

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: `${role === "organizor" ? "Organizor" : "User"} registered successfully`,
      data: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};

export const signIn = async (req, res) => {
  try {
    console.log("Start");

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    let loggedUser = user;
    if (user.role === "organizor") {
      loggedUser = await Organizor.findById(user._id);
    }

    // STEP 3: Check inactive status
    if (loggedUser.role === "organizor" && loggedUser.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Contact admin."
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
      { expiresIn: "1d" }
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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("here");
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    console.log("UserResponse", userResponse);

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
  try {
    // clearAllCookies(res);
    clearCookies(res);
    console.log("Cookies clear");
  
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
    
  } catch (error) {
    console.error("Error" , error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
