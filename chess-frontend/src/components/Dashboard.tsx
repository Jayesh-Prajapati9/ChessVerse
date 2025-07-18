"use client";
import React, { useState, useEffect } from "react";
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

export const Dashboard = () => {
	const [isSearchingGame, setIsSearchingGame] = useState(false);
	const [searchTime, setSearchTime] = useState(0);

	const [isDark, setIsDark] = useState(true);
	const toggleTheme = () => {
		const newTheme = !isDark;
		setIsDark(newTheme);
		// localStorage.setItem("theme", newTheme ? "dark" : "light");
	};
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isSearchingGame) {
			interval = setInterval(() => {
				setSearchTime((prev) => prev + 1);
			}, 1000);
		} else {
			setSearchTime(0);
		}
		return () => clearInterval(interval);
	}, [isSearchingGame]);

	const handleFindGame = () => {
		if (isSearchingGame) {
			setIsSearchingGame(false);
			return;
		}

		setIsSearchingGame(true);
		// Simulate finding a game after 3-8 seconds
		const searchDuration = Math.random() * 5000 + 3000;
		setTimeout(() => {
			setIsSearchingGame(false);
			// Redirect to game
			window.location.href = "/game";
		}, searchDuration);
	};

	const handleStartGame = () => {
		handleFindGame();
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Last game board position (simplified representation)
	const renderLastGameBoard = () => {
		const squares = [];
		const lastGamePosition = [
			["♜", "", "♝", "♛", "♚", "♝", "♞", "♜"],
			["♟", "♟", "", "♟", "", "♟", "♟", "♟"],
			["", "", "♞", "", "", "", "", ""],
			["", "", "♟", "", "♟", "", "", ""],
			["", "", "♗", "", "♙", "", "", ""],
			["", "", "", "", "", "♘", "", ""],
			["♙", "♙", "♙", "♙", "", "♙", "♙", "♙"],
			["♖", "♘", "♗", "♕", "♔", "", "", "♖"],
		];

		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 8; col++) {
				const isLight = (row + col) % 2 === 0;
				squares.push(
					<div
						key={`${row}-${col}`}
						className={`aspect-square flex items-center justify-center text-sm ${
							isLight
								? isDark
									? "bg-gray-300"
									: "bg-amber-100"
								: isDark
								? "bg-gray-600"
								: "bg-amber-800"
						}`}
					>
						{lastGamePosition[row][col]}
					</div>
				);
			}
		}
		return squares;
	};

	return (
		<div
			className={`min-h-screen transition-all duration-500 ${
				isDark ? "bg-background" : "bg-background"
			}`}
		>
			{/* Navigation */}
			<nav className="px-6 py-4 border-b border-border">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-xl bg-card border border-border">
							<Crown className="h-8 w-8 text-foreground" />
						</div>
						<span className="text-2xl font-bold text-foreground">
							ChessMaster
						</span>
					</div>
					<div className="flex items-center space-x-6">
						<button
							onClick={() => (window.location.href = "/history")}
							className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors"
						>
							<History className="h-4 w-4" />
							<span>History</span>
						</button>
						<button
							onClick={toggleTheme}
							className="p-3 rounded-full transition-all transform hover:scale-110 bg-card text-foreground hover:bg-accent border border-border"
						>
							{isDark ? (
								<Sun className="h-5 w-5" />
							) : (
								<Moon className="h-5 w-5" />
							)}
						</button>
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
								<span className="text-primary font-bold">J</span>
							</div>
							<span className="text-foreground font-medium">John Doe</span>
						</div>
					</div>
				</div>
			</nav>

			<div className="max-w-7xl mx-auto px-6 py-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-2">
						Welcome back, John!
					</h1>
					<p className="text-muted-foreground text-lg">
						Ready for your next chess challenge?
					</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Left Column - Quick Actions */}
					<div className="lg:col-span-2 space-y-6">
						{/* Quick Play Section */}
						<div className="bg-card rounded-xl p-8 border border-border">
							<h2 className="text-3xl font-bold text-foreground mb-8 text-center">
								Quick Play
							</h2>
							<div className="grid md:grid-cols-2 gap-6">
								<button
									onClick={handleStartGame}
									className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-12 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
								>
									<Play className="h-12 w-12 mx-auto mb-4" />
									Find Opponent
									<div className="text-sm font-normal mt-2 opacity-80">
										Play against real players
									</div>
								</button>
								<button className="bg-card hover:bg-accent text-foreground border border-border px-8 py-12 rounded-xl font-bold text-xl transition-all shadow-lg">
									<Bot className="h-12 w-12 mx-auto mb-4" />
									Play vs Computer
									<div className="text-sm font-normal mt-2 opacity-80">
										Practice with AI
									</div>
								</button>
							</div>
						</div>

						{/* Game Modes */}
						<div className="bg-card rounded-xl p-6 border border-border">
							<h2 className="text-2xl font-bold text-foreground mb-6">
								Game Modes
							</h2>
							<div className="grid md:grid-cols-3 gap-4">
								<div className="text-center p-6 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer group">
									<Zap className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
									<div className="font-bold text-foreground text-lg">Blitz</div>
									<div className="text-muted-foreground">3+0 minutes</div>
									<div className="text-sm text-muted-foreground mt-2">
										Fast-paced games
									</div>
								</div>
								<div className="text-center p-6 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer group">
									<Clock className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
									<div className="font-bold text-foreground text-lg">Rapid</div>
									<div className="text-muted-foreground">10+0 minutes</div>
									<div className="text-sm text-muted-foreground mt-2">
										Balanced gameplay
									</div>
								</div>
								<div className="text-center p-6 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer group">
									<Crown className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
									<div className="font-bold text-foreground text-lg">
										Classical
									</div>
									<div className="text-muted-foreground">30+0 minutes</div>
									<div className="text-sm text-muted-foreground mt-2">
										Deep strategy
									</div>
								</div>
							</div>
						</div>

						{/* Daily Puzzles */}
						<div className="bg-card rounded-xl p-6 border border-border">
							<h2 className="text-2xl font-bold text-foreground mb-6">
								Daily Training
							</h2>
							<div className="grid md:grid-cols-2 gap-4">
								<div className="p-4 bg-muted rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
									<div className="flex items-center justify-between mb-3">
										<h3 className="font-bold text-foreground">Chess Puzzles</h3>
										<Brain className="h-5 w-5 text-primary" />
									</div>
									<p className="text-muted-foreground text-sm mb-3">
										Solve tactical puzzles to improve your pattern recognition
									</p>
									<div className="text-sm text-primary font-medium">
										3/5 completed today
									</div>
								</div>
								<div className="p-4 bg-muted rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
									<div className="flex items-center justify-between mb-3">
										<h3 className="font-bold text-foreground">
											Opening Practice
										</h3>
										<Star className="h-5 w-5 text-primary" />
									</div>
									<p className="text-muted-foreground text-sm mb-3">
										Master popular chess openings
									</p>
									<div className="text-sm text-primary font-medium">
										Sicilian Defense
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Stats */}
					<div className="space-y-6">
						{/* Player Stats */}
						<div className="bg-card rounded-xl p-6 border border-border">
							<h2 className="text-xl font-bold text-foreground mb-6">
								Your Stats
							</h2>
							<div className="space-y-4">
								<div className="flex justify-between items-center p-3 bg-muted rounded-lg">
									<span className="text-muted-foreground">Current Rating</span>
									<span className="text-2xl font-bold text-primary">1562</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Games Played</span>
									<span className="font-bold text-foreground">247</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Win Rate</span>
									<span className="font-bold text-green-500">68%</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Best Streak</span>
									<span className="font-bold text-foreground">12 wins</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Avg Accuracy</span>
									<span className="font-bold text-foreground">84%</span>
								</div>
							</div>
						</div>

						{/* Quick Stats */}
						<div className="bg-card rounded-xl p-6 border border-border">
							<h2 className="text-xl font-bold text-foreground mb-6">
								Today's Performance
							</h2>
							<div className="grid grid-cols-2 gap-4">
								<div className="text-center p-3 bg-muted rounded-lg">
									<div className="text-2xl font-bold text-primary">3</div>
									<div className="text-sm text-muted-foreground">Games Won</div>
								</div>
								<div className="text-center p-3 bg-muted rounded-lg">
									<div className="text-2xl font-bold text-foreground">1</div>
									<div className="text-sm text-muted-foreground">
										Games Lost
									</div>
								</div>
								<div className="text-center p-3 bg-muted rounded-lg">
									<div className="text-2xl font-bold text-primary">+23</div>
									<div className="text-sm text-muted-foreground">
										Rating Change
									</div>
								</div>
								<div className="text-center p-3 bg-muted rounded-lg">
									<div className="text-2xl font-bold text-foreground">89%</div>
									<div className="text-sm text-muted-foreground">Accuracy</div>
								</div>
							</div>
						</div>

						{/* Achievements */}
						<div className="bg-card rounded-xl p-6 border border-border">
							<h2 className="text-xl font-bold text-foreground mb-6">
								Recent Achievements
							</h2>
							<div className="space-y-3">
								<div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
									<Trophy className="h-8 w-8 text-yellow-500" />
									<div>
										<div className="font-bold text-foreground">
											First Victory
										</div>
										<div className="text-sm text-muted-foreground">
											Won your first game
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
									<Star className="h-8 w-8 text-blue-500" />
									<div>
										<div className="font-bold text-foreground">Rising Star</div>
										<div className="text-sm text-muted-foreground">
											Gained 100 rating points
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
									<Zap className="h-8 w-8 text-purple-500" />
									<div>
										<div className="font-bold text-foreground">Speed Demon</div>
										<div className="text-sm text-muted-foreground">
											Won 10 blitz games
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Online Friends */}
						<div className="bg-card rounded-xl p-6 border border-border">
							<h2 className="text-xl font-bold text-foreground mb-6">
								Online Friends
							</h2>
							<div className="space-y-3">
								{[
									{ name: "Sarah", status: "In Game", rating: "1634" },
									{ name: "Mike", status: "Online", rating: "1523" },
									{ name: "Alex", status: "Online", rating: "1689" },
								].map((friend, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-2 bg-muted rounded-lg"
									>
										<div className="flex items-center space-x-3">
											<div className="w-2 h-2 bg-green-500 rounded-full"></div>
											<div>
												<div className="font-medium text-foreground">
													{friend.name}
												</div>
												<div className="text-sm text-muted-foreground">
													{friend.status}
												</div>
											</div>
										</div>
										<div className="text-sm text-muted-foreground">
											{friend.rating}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Game Finding Modal */}
			{isSearchingGame && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-card rounded-xl p-8 border border-border max-w-md w-full mx-4">
						<div className="text-center">
							<div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
							<h3 className="text-xl font-bold text-foreground mb-2">
								Finding Opponent...
							</h3>
							<p className="text-muted-foreground mb-6">
								Please wait while we match you with a player
							</p>
							<button
								onClick={() => setIsSearchingGame(false)}
								className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-2 rounded-lg transition-colors"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
