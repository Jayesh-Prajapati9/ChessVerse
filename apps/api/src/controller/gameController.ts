import { Request, Response } from "express";
import { getBestMove } from "../models/getBestMove";
import { getGame, setGame, updateGame } from "@repo/db";

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
  const { user1, user2, mode, fen } = req.body;
  const dbResponse = await setGame({
    user1,
    user2,
    winnerId: null,
    fen,
    whitemoves: [],
    blackmoves: [],
    mode,
  });

  if (!dbResponse.success) {
    res.status(404).json({
      status:false,
      message: dbResponse.message,
    });
    return;
  }

  console.log("Game created");

  res.status(200).json({
    status:true,
	  message: dbResponse.message,
	  gameId: dbResponse.game?.id
  });
};

export const modifyGame = async (req: Request, res: Response) => {
  const { gameId, blackMoves, whiteMoves, fen, winnerId } = req.body;
  const updated = await updateGame({
    gameId,
    whiteMoves,
    blackMoves,
    fen,
    winnerId,
  });

  if (!updated.success) {
    res.status(404).json({
      message: updated.message,
    });
    return;
  }

  console.log("Game updated");

  res.status(200).json({
    message: updated.message,
  });
};
