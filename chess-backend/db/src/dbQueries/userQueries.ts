import { prismaClient } from "../index";
import { user } from "../../generated/prisma";
import { PrismaClientKnownRequestError } from "../../generated/prisma/runtime/library";

interface UserUpdatePayload {
	id: string;
	data: string;
	field: "bio" | "password" | "username" | "avatar_Url";
}
interface userStats {
	userId: string;
	field: {
		rating: number;
		games_won: number;
		games_draw: number;
		games_played: number;
		win_streak: number;
		win_rate: number;
	};
}

export const createUser = async ({ username, password, email }: user) => {
	const user = await prismaClient.user.create({
		data: {
			username: username,
			password: password,
			email: email,
			joined_Date: new Date(),
		},
	});
};

export const getUserById = async (
	id: string
): Promise<user | string | unknown> => {
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

export const getUserStats = async (
	id: string
): Promise<string | user | unknown> => {
	try {
		const user = await prismaClient.player_stats.findUnique({
			where: {
				userId: id,
			},
		});
		if (user) {
			return user;
		} else {
			return "Failed to retrive stats";
		}
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			return error.message;
		} else {
			return error;
		}
	}
};

export const updateUserDetails = async ({
	id,
	data,
	field,
}: UserUpdatePayload): Promise<user | string | unknown> => {
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
