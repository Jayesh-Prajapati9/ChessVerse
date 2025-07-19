import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { NotFound } from "./pages/NotFound";
import { useEffect, useState } from "react";
import { SignUp } from "./components/SignUp";
import { SignIn } from "./components/SignIn";
import { Dashboard } from "./components/Dashboard";
import Game from "./components/Game";

function App() {
	const [isDark, setIsDark] = useState(true);

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
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/game" element={<Game />}></Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
