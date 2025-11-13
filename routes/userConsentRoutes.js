import express from "express";
import { createConsent, getUserConsents } from "../controllers/userConsent.js";


const consentRouter = express.Router();

consentRouter.post("/create-consent", createConsent);
consentRouter.get("/consents/:userId", getUserConsents)

export default consentRouter;
