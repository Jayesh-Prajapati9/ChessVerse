import { useState } from "react";
import type { ReactNode } from "react";
import { UserContext } from "../hooks/useUser";
import type { UserWithStats } from "../hooks/useUser";

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
