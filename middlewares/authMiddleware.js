import jwt from "jsonwebtoken";
import { User } from "../model/user.js";
import dotenv from "dotenv"
dotenv.config()

export const authenticateUser = async (req, res, next) => {
  try {

    // Check for token in cookies (both names for compatibility) or Authorization header
    const token = req.cookies?.accessToken || req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

    // console.log("Incoming token source check:", { 
    //   cookieAccessToken: !!req.cookies?.accessToken, 
    //   cookieAuthToken: !!req.cookies?.authToken,
    //   headerAuth: !!req.headers.authorization 
    // });

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // console.log("env" , process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ success: false, message: "Access denied. User not found." });
    if (["banned", "inactive"].includes(user.status))
      return res.status(403).json({ success: false, message: "Access denied. Account is inactive." });

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    res.clearCookie("accessToken"); // token clear
    return res.status(401).json({ success: false, message: "Access denied. Invalid or expired token." });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // console.log("User",req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You are not ${roles.join(",")}`
      });
    }
    next();
  };
}
