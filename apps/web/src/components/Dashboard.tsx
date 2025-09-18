"use client";
import "../App.css";
import { useState } from "react";
import {
	Crown,
	Trophy,
	Zap,
	Play,
	Star,
	Brain,
	Sun,
	Moon,
	Clock,
	History,
	Bot,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useUser } from "../hooks/useUser";

type GameMode = "normal" | "blitz" | "rapid" | "bullet" | "ai" | null;

export const Dashboard = () => {
	const { isDark, toggleTheme } = useTheme();
	const [mode, setMode] = useState<GameMode>("normal");
	const navigate = useNavigate();
	const { user } = useUser();

	const handleStartGame = (mode: GameMode) => {
		navigate("/game", {
			state: {
				mode: mode,
			},
		});
	};

	const bg = isDark ? "bg-[#101014]" : "bg-[#f8fafc]";
	const text = isDark ? "text-white" : "text-[#18181b]";
	const border = isDark ? "border-[#27272a]" : "border-[#e5e7eb]";
	const card = isDark
		? "bg-gradient-to-br from-[#0f0f0f]/70 via-[#1a1a1a]/60 to-[#2a2a2a]/70 text-white backdrop-blur-md border border-white/10 shadow-lg"
		: "bg-gradient-to-br from-white/40 via-white/20 to-white/30 text-black backdrop-blur-md border border-gray-300/30 shadow-lg";

	const cardBorder = isDark ? "border-[#27272a]" : "border-[#e5e7eb]";
	const cardText = isDark ? "text-white" : "text-[#18181b]";
	const muted = isDark ? "bg-[#232326]" : "bg-[#f1f5f9]";
	const mutedText = isDark ? "text-[#a1a1aa]" : "text-[#52525b]";
	const accent = isDark ? "bg-[#27272a]" : "bg-[#e0e7ef]";
	const secondary = isDark ? "bg-[#27272a]" : "bg-[#e5e7eb]";
	const secondaryText = isDark ? "text-[#f1f5f9]" : "text-[#18181b]";
	const primary = "text-[#4c4fef]";
	const primaryBg = "bg-[#4c4fef]";
	const primaryFg = "text-white";
	const borderSelection = isDark
		? "border-2 border-[#f1f6f9]"
		: "border-2 border-[#0e0e10]";

	return (
		<div
			className={`min-h-screen transition-all duration-500 ${bg} ${text} select-none`}
		>
			{/* Navigation */}
			<nav className={`px-6 py-4 border-b ${border}`}>
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className={`p-2 rounded-xl ${card} ${border}`}>
							<Crown className={`h-8 w-8 ${primary}`} />
						</div>
						<span className="text-2xl font-bold">ChessVerse</span>
					</div>
					<div className="flex items-center space-x-6">
						{/* <button
							onClick={() => (window.location.href = "/history")}
							className={`flex items-center space-x-2 px-4 py-2 ${secondary} ${secondaryText} rounded-lg transition-all hover:cursor-pointer transform hover:scale-105 `}
						>
							<History className="h-4 w-4" />
							<span>History</span>
						</button> */}
						<button
							onClick={toggleTheme}
							className={`p-3 rounded-full transition-all transform hover:scale-110 ${card} ${cardText} hover:${accent} ${border} hover:cursor-pointer`}
						>
							{isDark ? (
								<Sun className="h-5 w-5" />
							) : (
								<Moon className="h-5 w-5" />
							)}
						</button>
						{/* Profile */}
						<div className="flex items-center space-x-3">
							<span className={`${primary} font-bold`}>{user?.username[0] }</span>
							<span className="font-medium">{user?.username}</span>
						</div>
					</div>
				</div>
			</nav>

			<div className="max-w-7xl mx-auto px-6 py-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold mb-2">Welcome back, { user?.username}!</h1>
					<p className={`${mutedText} text-lg`}>
						Ready for your next chess challenge?
					</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Left Column - Quick Actions */}
					<div className="lg:col-span-2 shine space-y-6">
						{/* Quick Play Section */}
						<div className={`${card} rounded-xl p-8 ${cardBorder} border`}>
							<h2 className="text-3xl font-bold mb-8 text-center">
								Quick Play
							</h2>
							<div className="grid md:grid-cols-2 gap-6">
								<button
									onClick={() => {
										if (!mode) setMode("normal");
										handleStartGame(mode);
									}}
									className={`${primaryBg} ${primaryFg} hover:bg-indigo-600 px-8 py-12 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg hover:cursor-pointer`}
								>
									<Play className="h-12 w-12 mx-auto mb-4" />
									Find Opponent
									<div className="text-sm font-normal mt-2 opacity-80">
										Play against real players
									</div>
								</button>
								<button
									onClick={() => {
										setMode("ai");
										handleStartGame("ai");
									}}
									className={`${card} hover:${accent} ${cardText} ${cardBorder} border px-8 py-12 rounded-xl font-bold text-xl transition-all shadow-lg transform hover:scale-105 hover:border-1.5 hover:border-white hover:cursor-pointer`}
								>
									<Bot className="h-12 w-12 mx-auto mb-4" />
									Play vs Computer
									<div className="text-sm font-normal mt-2 opacity-80">
										Practice with AI
									</div>
								</button>
							</div>
						</div>

						{/* Game Modes */}
						<div className={`${card} rounded-xl p-6 ${cardBorder} border`}>
							<h2 className="text-2xl font-bold mb-6">Game Modes</h2>
							<div className="grid md:grid-cols-3 gap-4">
								<div
									onClick={() => {
										setMode(mode === "blitz" ? "normal" : "blitz");
									}}
									className={`text-center p-6 ${cardBorder} border rounded-lg transition-all cursor-pointer group ${
										mode === "blitz" ? `${borderSelection}` : null
									} transform hover:scale-108`}
								>
									<Zap
										className={`h-8 w-8 mx-auto mb-3 ${primary} group-hover:scale-110 transition-transform`}
									/>
									<div className="font-bold text-lg">Blitz</div>
									<div className={mutedText}>3+0 minutes</div>
									<div className={`text-sm ${mutedText} mt-2`}>
										Fast-paced games
									</div>
								</div>
								<div
									onClick={() => {
										setMode(mode === "rapid" ? null : "rapid");
									}}
									className={`text-center p-6 ${cardBorder} border rounded-lg transition-all cursor-pointer group transform hover:scale-108 ${
										mode === "rapid" ? `${borderSelection}` : null
									}`}
								>
									<Clock
										className={`h-8 w-8 mx-auto mb-3 ${primary} group-hover:scale-110 transition-transform`}
									/>
									<div className="font-bold text-lg">Rapid</div>
									<div className={mutedText}>10+0 minutes</div>
									<div className={`text-sm ${mutedText} mt-2`}>
										Balanced gameplay
									</div>
								</div>
								<div
									onClick={() => {
										setMode(mode === "normal" ? null : "normal");
									}}
									className={`text-center p-6 ${cardBorder} border rounded-lg transition-all cursor-pointer group transform hover:scale-108 ${
										mode === "normal" ? `${borderSelection}` : null
									}`}
								>
									<Crown
										className={`h-8 w-8 mx-auto mb-3 ${primary} group-hover:scale-110 transition-transform`}
									/>
									<div className="font-bold text-lg">Classical</div>
									<div className={mutedText}>30+0 minutes</div>
									<div className={`text-sm ${mutedText} mt-2`}>
										Deep strategy
									</div>
								</div>
							</div>
						</div>

						{/* Daily Puzzles */}
						<div className={`${card} rounded-xl p-6 ${cardBorder} border`}>
							<h2 className="text-2xl font-bold mb-6">Daily Training</h2>
							<div className="grid md:grid-cols-2 gap-4">
								<div
									className={`p-4 ${muted} rounded-lg ${cardBorder} border hover:${accent} transition-colors cursor-pointer`}
								>
									<div className="flex items-center justify-between mb-3">
										<h3 className="font-bold">Chess Puzzles</h3>
										<Brain className={`h-5 w-5 ${primary}`} />
									</div>
									<p className={`text-sm mb-3 ${mutedText}`}>
										Solve tactical puzzles to improve your pattern recognition
									</p>
									<div className={`text-sm ${primary} font-medium`}>
										3/5 completed today
									</div>
								</div>
								<div
									className={`p-4 ${muted} rounded-lg ${cardBorder} border hover:${accent} transition-colors cursor-pointer`}
								>
									<div className="flex items-center justify-between mb-3">
										<h3 className="font-bold">Opening Practice</h3>
										<Star className={`h-5 w-5 ${primary}`} />
									</div>
									<p className={`text-sm mb-3 ${mutedText}`}>
										Master popular chess openings
									</p>
									<div className={`text-sm ${primary} font-medium`}>
										Sicilian Defense
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Stats */}
					<div className="space-y-6">
						{/* Player Stats */}
						<div className={`${card} rounded-xl p-3 ${cardBorder} border`}>
							<h2 className="text-xl font-bold mb-6 ml-3 mt-3">Your Stats</h2>
							<div className="space-y-4 mb-3">
								<div
									className={`flex justify-between items-center p-3 ${muted} rounded-lg `}
								>
									<span className={mutedText}>Current Rating</span>
									<span className={`text-2xl font-bold ${primary}`}>{ user?.playerstats[0].rating }</span>
								</div>
								<div className="flex justify-between items-center px-3">
									<span className={mutedText}>Games Played</span>
									<span className="font-bold">{ user?.playerstats[0].games_played }</span>
								</div>
								<div className="flex justify-between items-center px-3">
									<span className={mutedText}>Win Rate</span>
									<span className="font-bold text-green-500">{ user?.playerstats[0].win_rate }</span>
								</div>
								<div className="flex justify-between items-center px-3">
									<span className={mutedText}>Best Streak</span>
									<span className="font-bold">{ user?.playerstats[0].win_streak }</span>
								</div>
								<div className="flex justify-between items-center px-3">
									<span className={mutedText}>Avg Accuracy</span>
									<span className="font-bold">-</span>
								</div>
							</div>
						</div>

						{/* Quick Stats */}
						<div className={`${card} rounded-xl p-6 ${cardBorder} border`}>
							<h2 className="text-xl font-bold mb-6">Today's Performance</h2>
							<div className="grid grid-cols-2 gap-4">
								<div className={`text-center p-3 ${muted} rounded-lg`}>
									<div className={`text-2xl font-bold ${primary}`}>3</div>
									<div className={`text-sm ${mutedText}`}>Games Won</div>
								</div>
								<div className={`text-center p-3 ${muted} rounded-lg`}>
									<div className="text-2xl font-bold">1</div>
									<div className={`text-sm ${mutedText}`}>Games Lost</div>
								</div>
								<div className={`text-center p-3 ${muted} rounded-lg`}>
									<div className={`text-2xl font-bold ${primary}`}>+23</div>
									<div className={`text-sm ${mutedText}`}>Rating Change</div>
								</div>
								<div className={`text-center p-3 ${muted} rounded-lg`}>
									<div className="text-2xl font-bold">89%</div>
									<div className={`text-sm ${mutedText}`}>Accuracy</div>
								</div>
							</div>
						</div>

						{/* Achievements */}
						<div className={`${card} rounded-xl p-4 ${cardBorder} border`}>
							<h2 className="text-xl font-bold mb-6">Recent Achievements</h2>
							<div className="space-y-3">
								<div
									className={`flex items-center space-x-3 p-2 ${muted} rounded-lg`}
								>
									<Trophy className="h-8 w-8 text-yellow-500" />
									<div>
										<div className="font-bold">First Victory</div>
										<div className={`text-sm ${mutedText}`}>
											Won your first game
										</div>
									</div>
								</div>
								<div
									className={`flex items-center space-x-3 p-2 ${muted} rounded-lg`}
								>
									<Star className="h-8 w-8 text-blue-500" />
									<div>
										<div className="font-bold">Rising Star</div>
										<div className={`text-sm ${mutedText}`}>
											Gained 100 rating points
										</div>
									</div>
								</div>
								<div
									className={`flex items-center space-x-3 p-2 ${muted} rounded-lg`}
								>
									<Zap className="h-8 w-8 text-purple-500" />
									<div>
										<div className="font-bold">Speed Demon</div>
										<div className={`text-sm ${mutedText}`}>
											Won 10 blitz games
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
