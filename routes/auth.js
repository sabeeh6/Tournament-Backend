import express from "express";
import { createUser } from "../controllers/userController.js";
import { signInValidationRequest, signUpValidationRequest } from "../middlewares/validation/index.js";
import { signIn, signOut, signUp } from "../controllers/auth/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post( "/create-user",  signUpValidationRequest,  signUp);
authRouter.post( "/login-user",  signInValidationRequest , signIn );
authRouter.post("/log-out" , signOut)
// backend/routes/authRoutes.js

authRouter.get('/verify', authenticateUser, (req, res) => {
  console.log("Userrrrr" , req.user);
  
  res.json({
    success: true,
    user: req.user
  });
});

export default authRouter;
