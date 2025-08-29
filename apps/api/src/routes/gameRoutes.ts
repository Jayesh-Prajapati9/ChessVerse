import express, { Router } from "express";
import { createGame, getAIMove, getGameDetails } from "../controller/gameController";


const router = express.Router();

router.get('/:userId/details', getGameDetails)
router.post('/ai/move', getAIMove)
router.post('/create',createGame)

export const gameRoutes: Router = router;
