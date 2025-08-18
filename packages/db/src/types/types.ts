import { player_stats, user } from "@prisma/client";
export type { player_stats as Player, user as User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export interface UpdateUserPayload {
    id: string;
    data: string;
    field: "bio" | "password" | "username" | "avatar_Url";
}
export interface UpdateStatsPayload {
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
export interface CreateUserPayload {
    username: string;
    password: string;
    email: string;
}

export interface UserPlayload {
	email: string;
    password: string;
}

export type QueryResult =
    | { success: true; data: user | player_stats }
    | { success: false; error: string | PrismaClientKnownRequestError | Error };

export interface GameInput {
	user1: string;
  	user2: string;
  	winnerId?: string | null;
  	fen: string;
  	whitemoves: string[];
  	blackmoves: string[];
	mode:string
};

export type { game } from "@prisma/client";