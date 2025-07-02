import express, { Router } from "express";
import { gameLogic } from "../controller/gameController";

const router = express.Router();

router.get("/start-game", gameLogic);

export const gameRoutes = router;
