import { useState, useEffect } from "react";
import {
	Crown,
	Users,
	Trophy,
	Zap,
	Play,
	Star,
	Shield,
	Brain,
	Sun,
	Moon,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
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
		<div
			className={`min-h-screen transition-all duration-500 select-none ${
				isDark ? "bg-black" : "bg-white"
			}`}
		>
			{/* Subtle Background Pattern */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				{/* <div
					className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-5 animate-pulse ${
						isDark ? "bg-gray-400" : "bg-gray-600"
					}`}
				></div>

				<div
					className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-5 animate-pulse delay-1000 ${
						isDark ? "bg-gray-500" : "bg-gray-500"
					}`}
				></div> */}

				{/* <div
					className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-3 animate-pulse delay-500 ${
						isDark ? "bg-gray-600" : "bg-gray-400"
					}`}
				></div> */}
			</div>

			{/* Navigation */}
			<nav className="relative z-10 px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div
							className={`p-2 rounded-xl ${
								isDark
									? "bg-gray-800 border border-gray-700"
									: "bg-gray-100 border border-gray-200"
							}`}
						>
							<Crown
								className={`h-8 w-8 ${isDark ? "text-gray-300" : "text-gray-700"}`}
							/>
						</div>
						<span
							className={`text-2xl font-bold ${
								isDark ? "text-white" : "text-black"
							}`}
						>
							Chess Verse
						</span>
					</div>
					<div className="hidden md:flex items-center space-x-8">
						<a
							href="#features"
							className={`${
								isDark
									? "text-gray-400 hover:text-gray-200"
									: "text-gray-600 hover:text-gray-800"
							} transition-colors font-medium`}
						>
							Features
						</a>
						<a
							href="#about"
							className={`${
								isDark
									? "text-gray-400 hover:text-gray-200"
									: "text-gray-600 hover:text-gray-800"
							} transition-colors font-medium`}
						>
							About
						</a>
						<a
							href="#leaderboard"
							className={`${
								isDark
									? "text-gray-400 hover:text-gray-200"
									: "text-gray-600 hover:text-gray-800"
							} transition-colors font-medium`}
						>
							Leaderboard
						</a>
						<button
							onClick={toggleTheme}
							className={`p-3 rounded-full transition-all transform hover:scale-110 ${
								isDark
									? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
							}`}
						>
							{isDark ? (
								<Sun className="h-5 w-5" />
							) : (
								<Moon className="h-5 w-5" />
							)}
						</button>
						<Link
							to="/login"
							className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
								isDark
									? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
									: "bg-gray-900 text-white hover:bg-gray-800 border border-gray-900"
							}`}
						>
							Sign In
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative px-6 py-20">
				<div className="max-w-7xl mx-auto text-center">
					<div className="relative">
						<h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
							<span
								className={`${
									isDark ? "text-white" : "text-black"
								} drop-shadow-2xl`}
							>
								Conquer 
							</span>
							<br />
							<span
								className={`${
									isDark ? "text-gray-400" : "text-gray-600"
								} drop-shadow-2xl`}
							>
								The Game
							</span>
						</h1>
						<p
							className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium ${
								isDark ? "text-gray-300" : "text-gray-700"
							}`}
						>
							Elevate your chess skills with our cutting-edge platform. Play
							against world-class AI, challenge friends.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
						<Link
							to="/signup"
							className={`px-10 py-5 rounded-full text-lg font-bold transition-all transform hover:scale-105 flex items-center space-x-3 ${
								isDark
									? "bg-white text-black hover:bg-gray-100"
									: "bg-black text-white hover:bg-gray-900"
							}`}
						>
							<Play className="h-6 w-6" />
							<span>Start Playing</span>
						</Link>
						<button
							className={`px-10 py-5 rounded-full text-lg font-bold transition-all flex items-center space-x-3 ${
								isDark
									? "border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
									: "border-2 border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500"
							}`}
						>
							<Users className="h-6 w-6" />
							<span>Challenge Others</span>
						</button>
					</div>

					{/* Floating Chess Pieces Pattern */}
					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						<div className="absolute top-20 left-10 animate-bounce">
							<Crown
								className={`h-16 w-16 ${isDark ? "text-gray-700" : "text-gray-300"}`}
							/>
						</div>
						<div className="absolute top-40 right-20 animate-pulse">
							<Shield
								className={`h-12 w-12 ${isDark ? "text-gray-700" : "text-gray-300"}`}
							/>
						</div>
						<div className="absolute bottom-20 left-20 animate-bounce delay-200">
							<Trophy
								className={`h-18 w-18 ${isDark ? "text-gray-700" : "text-gray-300"}`}
							/>
						</div>
						<div className="absolute top-60 right-10 animate-pulse delay-300">
							<Brain
								className={`h-14 w-14 ${isDark ? "text-gray-700" : "text-gray-300"}`}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="px-6 py-20">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2
							className={`text-4xl md:text-5xl font-bold mb-6 ${
								isDark ? "text-white" : "text-black"
							}`}
						>
							Why Choose ChessVerse?
						</h2>
						<p
							className={`text-xl max-w-2xl mx-auto font-medium ${
								isDark ? "text-gray-400" : "text-gray-600"
							}`}
						>
							Experience chess like never before with our advanced features and
							intuitive design
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								icon: <Brain className="h-8 w-8" />,
								title: "AI-Powered Analysis",
								description:
									"Get instant feedback on your moves with our advanced chess engine",
								color: isDark ? "bg-gray-700" : "bg-gray-200",
							},
							{
								icon: <Users className="h-8 w-8" />,
								title: "Global Community",
								description:
									"Play with millions of players worldwide in real-time matches",
								color: isDark ? "bg-gray-700" : "bg-gray-200",
							},
							{
								icon: <Trophy className="h-8 w-8" />,
								title: "Tournaments & Prizes",
								description:
									"Compete in daily tournaments and climb the global leaderboard",
								color: isDark ? "bg-gray-700" : "bg-gray-200",
							},
							{
								icon: <Zap className="h-8 w-8" />,
								title: "Lightning Fast",
								description:
									"Optimized for speed with minimal lag, even in blitz games",
								color: isDark ? "bg-gray-700" : "bg-gray-200",
							},
							{
								icon: <Star className="h-8 w-8" />,
								title: "Personalized Learning",
								description:
									"Adaptive training system that evolves with your skill level",
								color: isDark ? "bg-gray-700" : "bg-gray-200",
							},
							{
								icon: <Shield className="h-8 w-8" />,
								title: "Fair Play Guarantee",
								description:
									"Advanced anti-cheat system ensures fair and honest games",
								color: isDark ? "bg-gray-700" : "bg-gray-200",
							},
						].map((feature, index) => (
							<div key={index} className="group relative">
								<div
									className={`rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 ${
										isDark
											? "bg-gray-900 border border-gray-800 hover:border-gray-700 hover:bg-gray-800"
											: "bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-white shadow-lg hover:shadow-xl"
									}`}
								>
									<div
										className={`inline-flex p-4 rounded-xl ${feature.color} mb-6`}
									>
										<div
											className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
										>
											{feature.icon}
										</div>
									</div>
									<h3
										className={`text-2xl font-bold mb-4 ${
											isDark ? "text-white" : "text-black"
										}`}
									>
										{feature.title}
									</h3>
									<p
										className={`leading-relaxed ${
											isDark ? "text-gray-400" : "text-gray-600"
										}`}
									>
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="px-6 py-20">
				<div className="max-w-7xl mx-auto">
					<div
						className={`rounded-3xl p-12 ${
							isDark
								? "bg-gray-900 border border-gray-800"
								: "bg-gray-50 border border-gray-200 shadow-xl"
						}`}
					>
						<div className="grid md:grid-cols-4 gap-8 text-center">
							{[
								{ number: "2M+", label: "Active Players" },
								{ number: "15M+", label: "Games Played" },
								{ number: "50K+", label: "Daily Matches" },
								{ number: "99.9%", label: "Uptime" },
							].map((stat, index) => (
								<div key={index} className="group">
									<div
										className={`text-4xl md:text-5xl font-bold mb-2 ${
											isDark ? "text-white" : "text-black"
										}`}
									>
										{stat.number}
									</div>
									<div
										className={`text-lg font-medium ${
											isDark ? "text-gray-400" : "text-gray-600"
										}`}
									>
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="px-6 py-20">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl md:text-6xl font-bold mb-8">
						<span className={`${isDark ? "text-white" : "text-black"}`}>
							Ready to Play?
						</span>
					</h2>
					<p
						className={`text-xl mb-10 max-w-2xl mx-auto font-medium ${
							isDark ? "text-gray-300" : "text-gray-700"
						}`}
					>
						Join thousands of chess enthusiasts and start your journey to
						becoming a grandmaster today.
					</p>
					<div className="flex flex-col sm:flex-row gap-6 justify-center">
						<Link
							to="/signup"
							className={`px-12 py-5 rounded-full text-xl font-bold transition-all transform hover:scale-105 ${
								isDark
									? "bg-white text-black hover:bg-gray-100"
									: "bg-black text-white hover:bg-gray-900"
							}`}
						>
							Create Free Account
						</Link>
						<Link
							to="/dashboard"
							className={`px-12 py-5 rounded-full text-xl font-bold transition-all ${
								isDark
									? "border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
									: "border-2 border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500"
							}`}
						>
							Play as Guest
						</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer
				className={`px-6 py-12 border-t ${
					isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50"
				}`}
			>
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
					<div className="flex items-center space-x-3 mb-4 md:mb-0">
						<div
							className={`p-2 rounded-xl ${
								isDark
									? "bg-gray-800 border border-gray-700"
									: "bg-gray-100 border border-gray-200"
							}`}
						>
							<Crown
								className={`h-6 w-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}
							/>
						</div>
						<span
							className={`text-xl font-bold ${
								isDark ? "text-white" : "text-black"
							}`}
						>
							ChessVerse
						</span>
					</div>
					<div
						className={`text-center md:text-right ${
							isDark ? "text-gray-400" : "text-gray-600"
						}`}
					>
						<p className="font-medium">
							&copy; 2025 ChessVerse. All rights reserved.
						</p>
						<p className="text-sm mt-1">Elevating chess to the next level.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;