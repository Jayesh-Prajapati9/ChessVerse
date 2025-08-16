import "./App.css";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./providers/userContext";
import { Router } from "./router/router";

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
			<UserProvider>
				<RouterProvider router={Router} />
			</UserProvider>
		</>
	);
}

export default App;
