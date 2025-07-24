import { prismaClient } from "../index";
import { game } from "../../generated/prisma";
import { PrismaClientKnownRequestError } from "../../generated/prisma/runtime/library";

export const setGame = async ({
	user1,
	user2,
	winnerId,
	// fen,
	whitemoves,
	blackmoves,
}: game): Promise<string | unknown> => {
	try {
		const response = await prismaClient.game.create({
			data: {
				played_At: new Date(),
				user1,
				user2,
				whitemoves,
				blackmoves,
				winnerId,
			},
		});
		if (response) {
			return "Game created succesfully";
		}
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			return error.message;
		} else {
			return error;
		}
	}
};
