import { useState } from "react";
import type { ReactNode } from "react";
import { UserContext } from "./useUser";
import type { UserWithStats } from "./useUser";

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserWithStats | null>(null);
	return (
		<>
			<UserContext.Provider value={{ user, setUser }}>
				{children}
			</UserContext.Provider>
		</>
	);
};
