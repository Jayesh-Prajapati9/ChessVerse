import axios from "axios";
import {redirect} from "react-router-dom"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const requireAuth = async () => {
	try {
		const response = await axios.get(`${BACKEND_URL}/user/auth/check`, {
			withCredentials: true,
		});

		if (response.status === 200) {
			return response.data.message;
		}
	} catch (error) {
		console.log(error);
		throw redirect("/login");
	}
};

export const redirectIfAuthed = async () => {
	try {
		const response = await axios.get(`${BACKEND_URL}/user/auth/check`, {
			withCredentials: true,
		});

		if (response.status === 200) {
			console.log("inside response");
			return redirect('/dashboard');
		}
	} catch (error) {
		console.log(error);
		return null;
	}
};
