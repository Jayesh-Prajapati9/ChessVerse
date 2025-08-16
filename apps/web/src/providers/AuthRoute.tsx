import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import type { UserWithStats } from "../hooks/useUser";
import { useUser } from "../hooks/useUser";
export const AuthRoute = () => {
	const { setUser } = useUser();
	const userData = useLoaderData() as UserWithStats;
    useEffect(() => {
        console.log(userData);
		setUser((prev) => userData ?? prev);
	}, [userData, setUser]);
	return <Outlet/>;
};
