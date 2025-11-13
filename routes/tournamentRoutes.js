import express from "express";
import { createTournament, deleteTournament, getTournamentById,updateTournament, getTournamentsByCategory, getAllTournaments, applyForTournament } from "../controllers/tournamentController.js";


const touramentRouter = express.Router();

// CRUD Routes
touramentRouter.post("/create-tournament", createTournament);
touramentRouter.get("/all-tournaments", getAllTournaments);
touramentRouter.post('/tournaments/:id/apply',applyForTournament)
touramentRouter.get("/:id", getTournamentById);
touramentRouter.put("/:id", updateTournament);
touramentRouter.delete("/:id", deleteTournament);
touramentRouter.get('/tournaments/:category',getTournamentsByCategory)


export default touramentRouter;
