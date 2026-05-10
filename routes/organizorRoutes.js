import express from "express"
import { createGround, createTournamentSchedule, delGround, getGroundsById, updateGround, getGroundById } from "../controllers/organizorController.js"
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware.js"

import { upload } from "../util/multer.js"

export const organizorRouter = express.Router()

organizorRouter.post("/create-Ground" , authenticateUser , authorizeRoles("organizor") , upload.single('image') , createGround)
organizorRouter.put("/update-Ground/:id" , authenticateUser , authorizeRoles("organizor") , upload.single('image') , updateGround)
organizorRouter.get("/get-Grounds" , authenticateUser , authorizeRoles("organizor") , getGroundsById)
organizorRouter.get("/get-Ground/:id" , authenticateUser , authorizeRoles("organizor") , getGroundById)
organizorRouter.delete("/del-Ground/:id" , authenticateUser , authorizeRoles("organizor") , delGround)

organizorRouter.post("/tournament-schedule" , authenticateUser , authorizeRoles("organizor") , createTournamentSchedule)
