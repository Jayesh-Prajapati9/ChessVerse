import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { User, Player } from "@repo/db";

export interface UserWithStats extends User {
	playerstats: Player[];
}

export interface UserContextType {
	user: UserWithStats | null;
	setUser: Dispatch<SetStateAction<UserWithStats | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) throw new Error("useUser must be used within a UserProvider");
	return context;
};
