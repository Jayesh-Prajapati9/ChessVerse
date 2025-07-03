import express from "express";
import { getGameDetails } from "../controller/gameController";


const router = express.Router();

router.get('/:gameId/details',getGameDetails)

export const gameRoutes = router;
