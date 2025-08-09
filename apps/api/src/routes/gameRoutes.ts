import express, { Router } from "express";
import { getAIMove, getGameDetails } from "../controller/gameController";


const router = express.Router();

router.get('/:gameId/details', getGameDetails)
router.post('/ai/move',getAIMove)

export const gameRoutes: Router = router;
