import express from "express";
import { createTournament, deleteTournament, getTournamentById,updateTournament, getTournamentsByCategory, getAllTournaments, applyForTournament } from "../controllers/tournamentController.js";


const router = express.Router();

// CRUD Routes
router.post("/create-tournament", createTournament);
router.get("/all-tournaments", getAllTournaments);
router.post('/tournaments/:id/apply',applyForTournament)
router.get("/:id", getTournamentById);
router.put("/:id", updateTournament);
router.delete("/:id", deleteTournament);
router.get('/tournaments/:category',getTournamentsByCategory)


export default router;
