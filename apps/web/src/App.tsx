import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { NotFound } from "./pages/NotFound";
import { SignUp } from "./components/SignUp";
import { SignIn } from "./components/SignIn";
import { Dashboard } from "./components/Dashboard";
import Game from "./components/Game";
import { ToastContainer } from "react-toastify";

function App() {
	return (
		<>
			<ToastContainer
				position="bottom-right"
				autoClose={3000}
				hideProgressBar={true}
				closeOnClick
				draggable
				pauseOnHover
				theme="auto" 
			/>

			<BrowserRouter>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/login" element={<SignIn />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/game" element={<Game />}></Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
