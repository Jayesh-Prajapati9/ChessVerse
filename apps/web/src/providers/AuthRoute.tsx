import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import type { UserWithStats } from "../hooks/useUser";
import { useUser } from "../hooks/useUser";

export const AuthRoute = () => {
	const { setUser } = useUser();
	const userData = useLoaderData() as UserWithStats | null;

	useEffect(() => {
		if (userData) {
			setUser(userData);
		} else {
			setUser(null);
		}
	}, [userData, setUser]);

	return <Outlet />;
};
