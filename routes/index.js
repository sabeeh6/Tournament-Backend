import express from "express";
import touramentRouter from "./tournamentRoutes.js"
import consentRouter from "./userConsentRoutes.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import { organizorRouter } from "./organizorRoutes.js";

const router = express.Router();

router.use("/tourament", touramentRouter);
router.use("/consent", consentRouter);
router.use("/auth" , authRouter)
router.use("/admin" , adminRouter )
router.use("/organizor" , organizorRouter )


export default router;
