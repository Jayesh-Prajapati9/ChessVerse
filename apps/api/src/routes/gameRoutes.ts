import express, { Router } from "express";
import { createGame, getAIMove, getGameDetails, modifyGame } from "../controller/gameController";


const router = express.Router();

router.get('/:userId/details', getGameDetails)
router.post('/ai/move', getAIMove)
router.post('/create',createGame)
router.patch('/update',modifyGame)

export const gameRoutes: Router = router;
