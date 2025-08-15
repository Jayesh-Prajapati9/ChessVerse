import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const Auth = () => {
	const { setUser, user } = useUser();
	const navigate = useNavigate();
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	useEffect(() => {
		console.log("1st user",user?.username); // ✅ This runs after re-render, will show new value
	}, [user]);
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await axios.get(`${BACKEND_URL}/user/auth/check`, {
					withCredentials: true,
				});

				if (response.status === 200) {
					const { data } = response;
					setUser(prev => prev ?? data.message);
					console.log("User", data.message.playerstats[0]);
					console.log("User Context", user?.id);
					navigate("/dashboard");
				}
			} catch (error) {
				if (
					error instanceof AxiosError &&
					(error.status === 404 || error.status === 401)
				) {
					navigate("/");
				}
			}
		};

		checkAuth();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return null;
};

export default Auth;
