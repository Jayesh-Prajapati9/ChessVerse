import {
	CreateUserPayload,
	QueryResult,
	User,
	UserPlayload,
	UpdateStatsPayload,
	UpdateUserPayload,
} from "../types/types";
import { prismaClient } from "..";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";

export const createUser = async ({
	username,
	password,
	email,
}: CreateUserPayload): Promise<User | string> => {
	try {
		const user = await prismaClient.user.create({
			data: {
				username: username,
				password: password,
				email: email,
				joined_Date: new Date(),
			},
		});
		if (user) {
			return user;
		} else {
			return "Error while registering the user in DataBase";
		}
	} catch (error) {
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			return "Email is already register with the account";
		} else {
			return "Error";
		}
	}
};

export const getUserDetails = async (
	id: string | null,
	email: string | null,
	password: string | null
): Promise<QueryResult> => {
	try {
		const user = await prismaClient.user.findFirst({
			where: {
				OR: [
					id ? { id } : undefined,
					email && password ? { email, password } : undefined,
				].filter(Boolean) as Prisma.userWhereInput[],
			},
			include: {
				playerstats: true,
			},
		});
		if (user) {
			if (user.playerstats.length <= 0) {
				const dummyData = {
					userId: user.id,
					rating: 0,
					games_won: 0,
					games_draw: 0,
					games_played: 0,
					win_streak: 0,
					win_rate: 0,
				};
				user.playerstats.push(dummyData);
				return { success: true, data: user };
			}
			return { success: true, data: user };
		} else {
			return {
				success: false,
				error: "Email or Password is incorrect",
			};
		}
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			return {
				success: false,
				error: error,
			};
		} else if (error instanceof Error) {
			return {
				success: false,
				error: error,
			};
		} else {
			return {
				success: false,
				error: new Error("Error Occured while fetching the user stats"),
			};
		}
	}
};

export const updateUserDetails = async ({
	id,
	data,
	field,
}: UpdateUserPayload): Promise<User | string | unknown> => {
	try {
		return await prismaClient.user.update({
			where: {
				id: id,
			},
			data: {
				[field]: data,
			},
		});
	} catch (error) {
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			return error.message;
		} else {
			return error;
		}
	}
};

export const updateUserStats = async ({
	userId,
	field,
}: UpdateStatsPayload): Promise<string | unknown> => {
	try {
		const updatedStats = await prismaClient.player_stats.update({
			where: {
				userId: userId,
			},
			data: {
				...(field.rating && { rating: { set: field.rating } }),
				...(field.games_draw && {
					games_draw: { increment: field.games_draw },
				}),
				...(field.games_played && {
					games_played: { increment: field.games_played },
				}),
				...(field.games_won && { games_won: { increment: field.games_won } }),
				...(field.win_rate && { win_rate: { increment: field.win_rate } }),
				...(field.win_streak && { win_streak: { set: field.win_streak } }),
			},
		});
		if (updatedStats) {
			return "Update Succesfully";
		}
	} catch (error) {
		if (
			error instanceof PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			return error.message;
		} else {
			return error;
		}
	}
};
