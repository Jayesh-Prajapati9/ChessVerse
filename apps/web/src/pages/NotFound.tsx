import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Key } from "lucide-react";

export const NotFound = () => {
	const location = useLocation();

	useEffect(() => {
		console.error(
			"404 Error: User attempted to access non-existent route:",
			location.pathname
		);
	}, [location.pathname]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
			{/* Subtle Illustration (replace with Undraw/Lottie if needed) */}
			<div className="mb-6">
				<svg
					className="w-48 h-48 text-gray-400"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>

			<h1 className="text-5xl font-bold mb-4 text-gray-400">404</h1>
			<p className="text-2xl text-gray-400 mb-6">Oops! Page not found</p>

			{/* Lucide Icon Button */}
			<Link
				to="/"
				className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-semibold border-2 border-gray-600 text-gray-900 bg-[#c3c0c0] hover:bg-gray-800 hover:text-gray-300 hover:border-gray-500 transition-all duration-200"
			>
				<ArrowLeft className="w-5 h-5" />
				<span>Return to Home Page</span>
			</Link>
		</div>
	);
};
