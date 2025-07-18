import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { NotFound } from "./pages/NotFound";
import { useEffect, useState } from "react";
import { SignUp } from "./components/SignUp";
import { ChessBoard } from "./components/ChessBoard";
import { SignIn } from "./components/SignIn";
import { Dashboard } from "./components/Dashboard";

function App() {
	const [isDark, setIsDark] = useState(true);
	const toggleTheme = () => {
		const newTheme = !isDark;
		setIsDark(newTheme);
		localStorage.setItem("theme", newTheme ? "dark" : "light");
	};

	useEffect(() => {
		// Apply theme to document element
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDark]);

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/signup" element={<SignUp isDark={isDark} />} />
					<Route path="/login" element={<SignIn isDark={isDark} />} />
					<Route path="/chessboard" element={<ChessBoard />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
