import { Request, Response } from "express";
import { getBestMove } from "../models/getBestMove";

export const getGameDetails = () => {};

export const getAIMove = async (req: Request, res: Response) => {
	const { fen } = req.body;

	try {
		const move = await getBestMove(fen);
		res.json({ move });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "AI failed" });
	}
};
