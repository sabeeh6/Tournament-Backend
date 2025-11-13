import express from "express";
import touramentRouter from "./tournamentRoutes.js"
import consentRouter from "./userConsentRoutes.js";

const router = express.Router();

router.use("/tourament", touramentRouter);
router.use("/consent", consentRouter);


export default router;
