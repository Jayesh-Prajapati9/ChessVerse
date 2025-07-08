import "./App.css";
// import { ChessBoard } from './components/ChessBoard'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { NotFound } from "./pages/NotFound";
import { useEffect, useState } from "react";
import { SignUp } from "./components/SignUp";

function App() {
	const [isDark, setIsDark] = useState(true);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			setIsDark(savedTheme === "dark");
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = !isDark;
		setIsDark(newTheme);
		localStorage.setItem("theme", newTheme ? "dark" : "light");
	};

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route
						path="/signup"
						element={<SignUp isDark={isDark} toggleTheme={toggleTheme} />}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
