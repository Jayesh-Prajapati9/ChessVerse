import React, { useState, useEffect } from "react";
import {
	Crown,
	Clock,
	Flag,
	Settings,
	Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ChessBoard } from "./ChessBoard";

interface GameProps {
	isDark: boolean;
	toggleTheme: () => void;
}

const Game: React.FC<GameProps> = ({ isDark }) => {
	const [playerTime, setPlayerTime] = useState(600); // 10 minutes
	const [opponentTime, setOpponentTime] = useState(600);
	const [isPlayerTurn, setIsPlayerTurn] = useState(true);
	const [gameStarted, setGameStarted] = useState(true);
	const [capturedByPlayer, setCapturedByPlayer] = useState(["♟", "♞", "♝"]);
	const [capturedByOpponent, setCapturedByOpponent] = useState(["♙", "♘"]);



	return (
		<div
			className={`min-h-screen transition-all duration-500 ${
				isDark ? "bg-black" : "bg-white"
			}`}
		>
			{/* Navigation */}
			<nav className="relative z-10 px-6 py-4 border-b border-gray-800">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<Link
							to="/dashboard"
							className={`p-2 rounded-xl transition-all hover:scale-110 ${
								isDark
									? "bg-gray-800 border border-gray-700 hover:bg-gray-700"
									: "bg-gray-100 border border-gray-200 hover:bg-gray-200"
							}`}
						>
							<Home
								className={`h-6 w-6 ${
									isDark ? "text-gray-300" : "text-gray-700"
								}`}
							/>
						</Link>
						<div
							className={`p-2 rounded-xl ${
								isDark
									? "bg-gray-800 border border-gray-700"
									: "bg-gray-100 border border-gray-200"
							}`}
						>
							<Crown
								className={`h-8 w-8 ${
									isDark ? "text-gray-300" : "text-gray-700"
								}`}
							/>
						</div>
						<span
							className={`text-2xl font-bold ${
								isDark ? "text-white" : "text-black"
							}`}
						>
							Live Game
						</span>
					</div>

					<div className="flex items-center space-x-4">
						<button
							className={`p-3 rounded-full transition-all ${
								isDark
									? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
									: "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
							}`}
						>
							<Settings className="h-5 w-5" />
						</button>
					</div>
				</div>
			</nav>

			<div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Game Board */}
					<div className="lg:col-span-2">
						<div
							className={`rounded-2xl p-6 ${
								isDark
									? "bg-gray-900 border border-gray-800"
									: "bg-gray-50 border border-gray-200 shadow-xl"
							}`}
						>
							{/* Opponent Info */}
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center space-x-3">
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center ${
											isDark ? "bg-gray-800" : "bg-gray-200"
										}`}
									>
										<span
											className={`font-bold ${
												isDark ? "text-white" : "text-black"
											}`}
										>
											M
										</span>
									</div>
									<div>
										<p
											className={`font-semibold ${
												isDark ? "text-white" : "text-black"
											}`}
										>
											Magnus2023
										</p>
										<p
											className={`text-sm ${
												isDark ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Rating: 1456
										</p>
									</div>
								</div>
								<div
									className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
										!isPlayerTurn && gameStarted
											? isDark
												? "bg-green-900 border border-green-700"
												: "bg-green-100 border border-green-300"
											: isDark
											? "bg-gray-800"
											: "bg-gray-200"
									}`}
								>
									<Clock className="h-5 w-5" />
									<span
										className={`font-mono text-lg font-bold ${
											isDark ? "text-white" : "text-black"
										}`}
									>
									
									</span>
								</div>
							</div>

							{/* Captured by Player */}


							{/* Chess Board */}
							<div className="relative my-6">
								<div className="aspect-square w-full max-w-[90vw] sm:max-w-[670px] mx-auto border-4 border-gray-700 rounded-xl overflow-hidden">
									<ChessBoard/>
								</div>
							</div>

							{/* Captured by Opponent */}

							{/* Player Info */}
							<div className="flex items-center justify-between mt-4">
								<div className="flex items-center space-x-3">
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center ${
											isDark ? "bg-gray-800" : "bg-gray-200"
										}`}
									>
										<span
											className={`font-bold ${
												isDark ? "text-white" : "text-black"
											}`}
										>
											J
										</span>
									</div>
									<div>
										<p
											className={`font-semibold ${
												isDark ? "text-white" : "text-black"
											}`}
										>
											John Doe (You)
										</p>
										<p
											className={`text-sm ${
												isDark ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Rating: 1247
										</p>
									</div>
								</div>
								<div
									className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
										isPlayerTurn && gameStarted
											? isDark
												? "bg-green-900 border border-green-700"
												: "bg-green-100 border border-green-300"
											: isDark
											? "bg-gray-800"
											: "bg-gray-200"
									}`}
								>
									<Clock className="h-5 w-5" />
									<span
										className={`font-mono text-lg font-bold ${
											isDark ? "text-white" : "text-black"
										}`}
									>
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Game Controls & Chat */}
					<div className="space-y-6">
						{/* Game Controls */}
						<div
							className={`rounded-2xl p-6 ${
								isDark
									? "bg-gray-900 border border-gray-800"
									: "bg-gray-50 border border-gray-200 shadow-lg"
							}`}
						>
							<h3
								className={`text-xl font-bold mb-4 ${
									isDark ? "text-white" : "text-black"
								}`}
							>
								Game Controls
							</h3>
							<div className="space-y-3">
								<button
									className={`w-full py-3 rounded-lg font-semibold transition-all ${
										isDark
											? "bg-red-900 text-red-300 hover:bg-red-800 border border-red-700"
											: "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
									}`}
								>
									<Flag className="inline h-5 w-5 mr-2" />
									Resign
								</button>
								<button
									className={`w-full py-3 rounded-lg font-semibold transition-all ${
										isDark
											? "bg-yellow-900 text-yellow-300 hover:bg-yellow-800 border border-yellow-700"
											: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300"
									}`}
								>
									Offer Draw
								</button>
							</div>
						</div>

						{/* Game Status */}
						<div
							className={`rounded-2xl p-6 ${
								isDark
									? "bg-gray-900 border border-gray-800"
									: "bg-gray-50 border border-gray-200 shadow-lg"
							}`}
						>
							<h3
								className={`text-xl font-bold mb-4 ${
									isDark ? "text-white" : "text-black"
								}`}
							>
								Game Status
							</h3>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span
										className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
									>
										Turn:
									</span>
									<span
										className={`font-semibold ${
											isDark ? "text-white" : "text-black"
										}`}
									>
										{isPlayerTurn ? "Your turn" : "Opponent's turn"}
									</span>
								</div>
								<div className="flex justify-between">
									<span
										className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
									>
										Move:
									</span>
									<span
										className={`font-semibold ${
											isDark ? "text-white" : "text-black"
										}`}
									>
										12
									</span>
								</div>
								<div className="flex justify-between">
									<span
										className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
									>
										Game Type:
									</span>
									<span
										className={`font-semibold ${
											isDark ? "text-white" : "text-black"
										}`}
									>
										Blitz 10+0
									</span>
								</div>
								<div className="flex justify-between">
									<span
										className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
									>
										Material:
									</span>
									<span
										className={`font-semibold ${
											capturedByPlayer.length > capturedByOpponent.length
												? "text-green-500"
												: capturedByPlayer.length < capturedByOpponent.length
												? "text-red-500"
												: isDark
												? "text-white"
												: "text-black"
										}`}
									>
										{capturedByPlayer.length > capturedByOpponent.length
											? "+"
											: capturedByPlayer.length < capturedByOpponent.length
											? "-"
											: "="}
										{Math.abs(
											capturedByPlayer.length - capturedByOpponent.length
										)}
									</span>
								</div>
							</div>
						</div>

						{/* Quick Chat */}
						<div
							className={`rounded-2xl p-6 ${
								isDark
									? "bg-gray-900 border border-gray-800"
									: "bg-gray-50 border border-gray-200 shadow-lg"
							}`}
						>
							<h3
								className={`text-xl font-bold mb-4 ${
									isDark ? "text-white" : "text-black"
								}`}
							>
								Quick Messages
							</h3>
							<div className="grid grid-cols-2 gap-2">
								{["Good luck!", "Nice move!", "Thanks!", "Well played!"].map(
									(message, index) => (
										<button
											key={index}
											className={`p-2 text-sm rounded-lg transition-all ${
												isDark
													? "bg-gray-800 text-gray-300 hover:bg-gray-700"
													: "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
											}`}
										>
											{message}
										</button>
									)
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Game;
