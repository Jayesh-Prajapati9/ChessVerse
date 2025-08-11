import { CreateUserPayload, QueryResult, User, UserPlayload, userStats, UserUpdatePayload } from "../types/types";
import { prismaClient } from "..";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
			return "Error While creating the user in DB";
		}
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			return error.message;
		} else {
			return "Error";
		}
	}
};

export const getUserById = async (
	id: string
): Promise<User | string | unknown> => {
	try {
		const user = await prismaClient.user.findUnique({
			where: {
				id: id,
			},
		});

		if (user) {
			return user;
		} else {
			return "No such user found";
		}
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			return error.message;
		} else {
			return error;
		}
	}
};

export const getUserByEmail = async ({
	email,
	password,
}: UserPlayload): Promise<User | string> => {
	try {
		const user = await prismaClient.user.findUnique({
			where: {
				email: email,
				password: password,
			},
		});
		if (user) {
			return user;
		} else {
			return "No such user found";
		}
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			return error.message;
		} else {
			return "Error";
		}
	}
};

export const getUserStats = async (id: string): Promise<QueryResult> => {
	try {
		const user = await prismaClient.player_stats.findUnique({
			where: {
				userId: id,
			},
		});
		if (user) {
			return { success: true, data: user };
		} else {
			return {
				success: false,
				error: "Cannot able to find the stats of the given id",
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
}: UserUpdatePayload): Promise<User | string | unknown> => {
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
}: userStats): Promise<string | unknown> => {
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
