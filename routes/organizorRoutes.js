import express from "express"
import { createGround } from "../controllers/groundController.js"

export const organizorRouter = express.Router()

organizorRouter.post("/create-Ground" , createGround)

