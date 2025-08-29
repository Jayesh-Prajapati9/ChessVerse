import { Request, Response } from "express";
import { getBestMove } from "../models/getBestMove";
import { getGame, prismaClient } from "@repo/db";

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

export const getGameDetails = async (req: Request, res: Response) => {
	const { userId } = req.params;
	if (!userId) {
		res.status(401).json({ message: "User Id not provided" });
		return;
	}
	const details = await getGame(userId);
	if (!details.success) {
		res.status(401).json({ message: details.message });
		return;
	}
	res.status(200).json({
		message: details.message,
		game: details.data,
	});
};

export const createGame = async (req: Request, res: Response) => {
	const { user1, user2, blackCaptured, whiteCaptured, mode, fen, winnerId } =
		req.body;
	const dbresponse = await prismaClient.game.create({
		data: {
			userAsUser1: {
				connect: {
					username: user1,
				},
			},
			userAsUser2: {
				connect: {
					username: user2,
				},
			},
			fen,
			mode,
			blackmoves: blackCaptured,
			whitemoves: whiteCaptured,
			winnerId: winnerId,
			played_At: new Date(),
		},
	});

	if (!dbresponse) {
		res.status(404).json({
			message: "Error while creating the game data",
		});
	}

	console.log("Game created");

	res.status(200).json({
		message: "Game Created Successfully",
	});
};
