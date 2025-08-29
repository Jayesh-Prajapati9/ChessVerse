import {
	Crown,
	Sun,
	Moon,
	Calendar,
	Clock,
	Trophy,
	TrendingUp,
	Eye,
	ArrowLeft,
} from "lucide-react";
import type { game as GameType } from "@repo/db";
import { useTheme } from "../hooks/useTheme";
import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";
import axios from "axios";

export const History = () => {
	const { isDark, toggleTheme } = useTheme();
	const { user } = useUser();
	const [gameData, setGameData] = useState<GameType[]>([]);
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	useEffect(() => {
		const getData = async () => {
			try {
				const response = await axios.get(
					`${BACKEND_URL}/game/${user?.id}/details`
				);
				if (response.status === 200) {
					setGameData(response.data.game);
					console.log(response.data.game);
				}
			} catch (error) {
				console.log(error);
			}
		};
		getData();
	}, [user, BACKEND_URL]);

	const bg = isDark ? "bg-[#101014]" : "bg-[#f8fafc]";
	const text = isDark ? "text-white" : "text-[#18181b]";
	const border = isDark ? "border-[#27272a]" : "border-[#e5e7eb]";
	const card = isDark
		? "bg-gradient-to-br from-[#0f0f0f]/70 via-[#1a1a1a]/60 to-[#2a2a2a]/70 text-white backdrop-blur-md border border-white/10 shadow-lg"
		: "bg-gradient-to-br from-white/40 via-white/20 to-white/30 text-black backdrop-blur-md border border-gray-300/30 shadow-lg";

	const mutedText = isDark ? "text-[#a1a1aa]" : "text-[#52525b]";
	const primaryBg = "bg-[#4c4fef]";
	const primaryFg = "text-white";
	const primary = "text-[#4c4fef]";

	const handleViewAnalysis = (gameId: number) => {
		window.location.href = `/game-analysis/${gameId}`;
	};

	const resultDot = (result: string) =>
		result === "Win"
			? "bg-green-500"
			: result === "Loss"
				? "bg-red-500"
				: "bg-yellow-500";

	const resultText = (result: string) =>
		result === "Win"
			? "text-green-500"
			: result === "Loss"
				? "text-red-500"
				: "text-yellow-500";

	const getResult = (winnerId: string | null, userId: string | undefined) =>
		winnerId === null ? "Draw" : winnerId === userId ? "Win" : "Loss";

	const getMoves = (whiteMoves: string[], blackMoves: string[]) =>
		whiteMoves.length + blackMoves.length;

	return (
		<div className={`min-h-screen transition-all duration-500 ${bg}`}>
			{/* Top Nav */}
			<nav className={`px-6 py-4 border-b ${border} ${bg}`}>
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<button
							onClick={() => (window.location.href = "/dashboard")}
							className={`p-2 rounded-lg transition-colors border ${card}`}
						>
							<ArrowLeft className="h-5 w-5" />
						</button>
						<div className={`p-2 rounded-xl border ${card}`}>
							<Crown className={`h-8 w-8 ${primary}`} />
						</div>
						<span className={`text-2xl font-bold ${text}`}>ChessVerse</span>
					</div>
					<div className="flex items-center space-x-6">
						<button
							onClick={toggleTheme}
							className={`p-3 rounded-full transition-all transform hover:scale-110 border ${card}`}
						>
							{isDark ? (
								<Sun className="h-5 w-5" />
							) : (
								<Moon className="h-5 w-5" />
							)}
						</button>
						<div className={`flex items-center space-x-2 border rounded-lg ${card}`}>
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center`}
							>
								<span className={`font-bold ${primary}`}>{user?.username[0]}</span>
							</div>
							<span className={`font-medium ${text} mr-2.5`}>{user?.username}</span>
						</div>
					</div>
				</div>
			</nav>

			<div className="max-w-7xl mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className={`text-4xl font-bold mb-2 ${text}`}>Game History</h1>
					<p className={`text-lg ${mutedText}`}>
						Review your past games and analyze your performance
					</p>
				</div>

				<div className="grid md:grid-cols-4 gap-6 mb-8">
					<div className={`${card} rounded-xl p-6`}>
						<div className="flex items-center justify-between">
							<div>
								<div className={`text-2xl font-bold ${text}`}>
									{user?.playerstats[0].games_played}
								</div>
								<div className={mutedText}>Total Games</div>
							</div>
							<Trophy className={`h-8 w-8 ${text}`} />
						</div>
					</div>

					<div className={`${card} rounded-xl p-6`}>
						<div className="flex items-center justify-between">
							<div>
								<div className="text-2xl font-bold text-green-500">
									{user?.playerstats[0].games_won}
								</div>
								<div className={mutedText}>Wins</div>
							</div>
							<TrendingUp className="h-8 w-8 text-green-500" />
						</div>
					</div>

					<div className={`${card} rounded-xl p-6`}>
						<div className="flex items-center justify-between">
							<div>
								<div className={`text-2xl font-bold ${text}`}>
									{user?.playerstats[0].win_rate}%
								</div>
								<div className={mutedText}>Win Rate</div>
							</div>
							<Calendar className={`h-8 w-8 ${text}`} />
						</div>
					</div>

					<div className={`${card} rounded-xl p-6`}>
						<div className="flex items-center justify-between">
							<div>
								<div className={`text-2xl font-bold ${text}`}>
									{user?.playerstats[0].win_streak}
								</div>
								<div className={mutedText}>Win Streak</div>
							</div>
							<Clock className={`h-8 w-8 ${text}`} />
						</div>
					</div>
				</div>

				<div className={`${card} rounded-2xl overflow-hidden`}>
					<div className={`p-6 border-b ${border}`}>
						<h2 className={`text-2xl font-bold ${text}`}>Recent Games</h2>
					</div>

					<div className="p-2 space-y-2">
						{gameData && gameData.length > 0 ? (
							gameData.map((game) => (
								<div
									key={game.id}
									className="grid grid-cols-12 items-center gap-4 px-4 py-4 rounded-xl hover:bg-white/5 transition-colors"
								>
									<div className="col-span-12 md:col-span-2 flex items-center gap-3">
										<div
											className={`w-3 h-3 rounded-full ${resultDot(getResult(game.winnerId, user?.id))}`}
										/>
										<div className="leading-tight">
											<div
												className={`font-bold text-lg ${resultText(getResult(game.winnerId, user?.id))}`}
											>
												{getResult(game.winnerId, user?.id)}
											</div>
											<div className={`text-sm ${mutedText}`}>
												{user?.playerstats[0].rating}
											</div>
										</div>
									</div>

									<div className="col-span-6 md:col-span-3">
										<div className={`font-bold ${text}`}>{game.user2}</div>
										<div className={`text-sm ${mutedText}`}>
											{game.played_At.toString()}
										</div>
									</div>

									{/* Col 6-7: Time control + moves */}
									<div className="col-span-6 md:col-span-2">
										<div className={`font-medium ${text}`}>{game.mode}</div>
										<div className={`text-sm ${mutedText}`}>
											{getMoves(game.whitemoves, game.blackmoves)} moves
										</div>
									</div>

									<div className="col-span-6 md:col-span-2">
										<div className={`font-semibold ${text}`}>
											{user?.playerstats[0].rating}
										</div>
										<div className={`text-sm ${mutedText}`}>Accuracy</div>
									</div>

									{/* <div className="col-span-12 md:col-span-3 md:justify-self-end">
										<button
											onClick={() => handleViewAnalysis(game.id)}
											className={`flex items-center gap-2 px-4 py-2 rounded-lg ${primaryBg} ${primaryFg} hover:opacity-90 transition`}
										>
											<Eye className="h-4 w-4" />
											<span>View Analysis</span>
										</button>
									</div> */}
								</div>
							))
						) : (
							<div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
								<p className="text-lg font-medium">No recent games found</p>
								<p className="text-sm">Play a game and it will appear here.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
