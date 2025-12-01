import express from "express"
import { createGround } from "../controllers/organizorController.js"

export const organizorRouter = express.Router()

organizorRouter.post("/create-Ground" , createGround)

