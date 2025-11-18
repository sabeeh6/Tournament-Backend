import express from "express";
import touramentRouter from "./tournamentRoutes.js"
import consentRouter from "./userConsentRoutes.js";
import authRouter from "./auth.js";

const router = express.Router();

router.use("/tourament", touramentRouter);
router.use("/consent", consentRouter);
router.use("/auth" , authRouter)


export default router;
