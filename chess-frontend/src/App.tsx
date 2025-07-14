import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { NotFound } from "./pages/NotFound";
import { useEffect, useState } from "react";
import { SignUp } from "./components/SignUp";
import { ChessBoard } from "./components/ChessBoard";
import { SignIn } from "./components/SignIn";

function App() {
	const [isDark, setIsDark] = useState(true);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			setIsDark(savedTheme === "dark");
		}
	}, []);

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/signup" element={<SignUp isDark={isDark} />} />
					<Route path="/login" element={<SignIn isDark={ isDark} />} />
					<Route path="/chessboard" element={<ChessBoard />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
