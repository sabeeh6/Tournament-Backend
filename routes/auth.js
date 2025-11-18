import express from "express";
import { createUser } from "../controllers/userController.js";
import { signUpValidationRequest } from "../middlewares/validation/index.js";
import { signIn, signOut } from "../controllers/auth/authController.js";

const authRouter = express.Router();

authRouter.post( "/create-user",  signUpValidationRequest,  createUser);
authRouter.post( "/login-user",    signIn);
authRouter.post("/log-out" , signOut)

export default authRouter;
