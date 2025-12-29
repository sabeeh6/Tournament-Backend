import express from "express"
import { createGround, delGround, getGroundsById, updateGround } from "../controllers/organizorController.js"
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware.js"

export const organizorRouter = express.Router()

organizorRouter.post("/create-Ground" , authenticateUser , authorizeRoles("organizor") , createGround)
organizorRouter.put("/update-Ground/:id" , authenticateUser , authorizeRoles("organizor") , updateGround)
organizorRouter.get("/get-Grounds" , authenticateUser , authorizeRoles("organizor") , getGroundsById)
organizorRouter.delete("/del-Ground/:id" , authenticateUser , authorizeRoles("organizor") , delGround)
