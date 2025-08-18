import { prismaClient } from "../index";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { GameInput } from "../types/types";

export const setGame = async (data: GameInput) => {
	try {
		const game = await prismaClient.game.create({
			data: {
				played_At: new Date(),
				...data,
			},
		});

		return {
			success: true,
			message: "Game created successfully",
			game,
		};
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			return {
				success: false,
				message: error.message,
			};
		}
		return {
			success: false,
			message: "Unexpected error while creating game",
		};
	}
};

export const getGame = async (userId: string) => {
  try {
    const games = await prismaClient.game.findMany({
      where: {
        OR: [{ user1: userId }, { user2: userId }],
      },
      orderBy: {
        played_At: "desc",
      },
    });

    return {
      success: true,
      message: games.length ? "Games fetched successfully" : "No games found",
      data: games,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
    return {
      success: false,
      message: "Unexpected error while fetching games",
      data: [],
    };
  }
};