import { Chess, type Square } from "chess.js";
import { useEffect } from "react";
import { useChessGame } from "../hooks/useChessGame";
import { showToast } from "@repo/ui/Toast";
import axios from "axios";
import { useUser } from "../hooks/useUser";
type ChessBoardProps = ReturnType<typeof useChessGame>;

export const ChessBoard = ({
	socketRef,
	chessRef,
	selectedPiece,
	setSelectedPiece,
	validMove,
	setValidMove,
	board,
	setBoard,
	blackCaptured,
	setBlackCaptured,
	whiteCaptured,
	setWhiteCaptured,
	kingSquare,
	setKingSquare,
	canAttack,
	setCanAttack,
	roomId,
	setRoomId,
	gameStarted,
	setGameStarted,
	playerColor,
	setPlayerColor,
	setWhiteTimer,
	setBlackTimer,
	isCheckMate,
	setIsCheckMate,
	gameResult,
	setGameResult,
	setMode,
	isSearchingGame,
	setIsSearchingGame,
	wsConnected,
	setWsConnected,
	isDark,
	setIsDark,
	location,
	setTotalMove,
	setOpponent,
	setGameId,
	gameId,
	setIsWsError,
	isWsError,
}: ChessBoardProps) => {
	const card = isDark ? "bg-[#232326]" : "bg-white";
	const cardBorder = isDark ? "border-[#27272a]" : "border-[#e5e7eb]";
	const primaryBg = "bg-[#4c4fef]";
	const primaryFg = "text-white";
	const mutedText = isDark ? "text-[#a1a1aa]" : "text-[#52525b]";
	const secondary = isDark ? "bg-[#27272a]" : "bg-[#e5e7eb]";
	const secondaryText = isDark ? "text-[#f1f5f9]" : "text-[#18181b]";
	const lightSquare = isDark ? "bg-[#94a3b8]" : "bg-[#f0d9b5]";
	const darkSquare = isDark ? "bg-[#334155]" : "bg-[#b58863]";
	const suggestion = isDark ? "bg-[#f1f5f9]" : "bg-green-500";
	const text = isDark ? "text-white" : "text-[#18181b]";
	const { user } = useUser();
	const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY


	useEffect(() => {
		// Here the websocket is bind for the first time and therefore all the message can be viewed and processed
		initWebSocketConnection();
		//theme
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			setIsDark(savedTheme === "dark");
		}
		return () => {
			socketRef.current?.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const attackedSquare: Square[] = [];
		validMove?.map((x) => chessRef.current.get(x) && attackedSquare.push(x));
		setCanAttack(attackedSquare);
	}, [validMove, setCanAttack, chessRef]);

	useEffect(() => {
		if (location.state.mode === "ai") {
			setIsSearchingGame(false);
			setGameStarted(true);
			setPlayerColor("w");
			setBoard(chessRef.current.board());
		} else {
			if (wsConnected) handleStartGame();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wsConnected]);

	const initWebSocketConnection = () => {
		// When the website mount then a new websocket connection is created
		socketRef.current = new WebSocket("ws://localhost:8000");
		socketRef.current.onopen = () => {
			console.log("🟢 Connected to WS server");
			setWsConnected(true);
		};

		socketRef.current.onmessage = async (event) => {
			const msg = JSON.parse(event.data.toString());

			if (msg.type === "game_started") {
				setIsSearchingGame(false);
				console.log("TURN: ", chessRef.current.turn());
				setRoomId(msg.roomId);
				setPlayerColor(msg.color);
				setGameStarted(true);
				chessRef.current.load(msg.fen);
				setBoard(chessRef.current.board());
				if (user?.username !== msg.username) {
					setOpponent(msg.username);
				}
				showToast("Game Started", "success", isDark);
				setGameId(msg.gameId);
				console.log(`Game started as ${msg.color}`);
				console.log("TURN 2 : ", chessRef.current.turn());
			}

			if (msg.type === "move") {
				console.log("MOVE TURN: ", chessRef.current.turn());
				chessRef.current.load(msg.fen);
				setBoard(chessRef.current.board());
				setSelectedPiece(null);
				setValidMove([]);
				setTotalMove((prev) => prev + 1);
				console.log("MOVE TURN2: ", chessRef.current.turn());
				// After the move check whether any player is under the check ? If Yes then indicate the that player

				if (chessRef.current.turn() === "w") {
					if (chessRef.current.inCheck()) {
						setKingSquare(
							chessRef.current.findPiece({ type: "k", color: "w" })
						);
					} else {
						setKingSquare(null);
					}
				} else {
					if (chessRef.current.inCheck()) {
						setKingSquare(
							chessRef.current.findPiece({ type: "k", color: "b" })
						);
					} else {
						setKingSquare(null);
					}
				}
			}

			if (msg.type === "game_over") {
				setIsCheckMate(true);
				setGameResult({ winner: msg.winner, reason: msg.reason });
				setGameStarted(false);
				chessRef.current.load(msg.fen);
				setBoard(chessRef.current.board());
				setSelectedPiece(null);
				setValidMove([]);
				socketRef.current?.close();
				// Clear All the states
			}

			if (msg.type === "timer_update") {
				setWhiteTimer(msg.white);
				setBlackTimer(msg.black);
			}

			if (msg.type === "error") {
				setIsWsError(msg.msg);
			}
		};
	};

	const handleStartNewGame = async () => {
		// After the first game is completed if the user want to start the new game
		initWebSocketConnection();
		setIsCheckMate(false);
		setGameResult(null);
		setWhiteCaptured([]);
		setBlackCaptured([]);
		setKingSquare(null);
		setCanAttack([]);
		setBoard(new Chess().board());
		setIsSearchingGame(true);
	};

	const handleStartGame = () => {
		if (!socketRef.current) return;
		setMode(location.state.mode);
		socketRef.current?.send(
			JSON.stringify({
				type: "start_game",
				mode: location.state.mode,
				userId: user?.id,
			})
		);
	};

	const getAImove = async () => {
		const legalMoves = chessRef.current.moves();
		const data = JSON.stringify({
			contents: [
				{
					parts: [
						{
							text: `You are a chess engine. Given this position (FEN): "${chessRef.current.fen()}"
							And legal moves: ${legalMoves.join(", ")}
							Reply with the best move only. Use SAN (e.g., Nf3, d4) or UCI (e.g., e2e4) format. No explanation Send in single line.`,
						},
					],
				},
			],
		});

		const config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
			headers: {
				"Content-Type": "application/json",
				"X-goog-api-key": GEMINI_API_KEY,
			},
			data: data,
		};

		axios
			.request(config)
			.then((response) => {
				if (
					chessRef.current.move(
						response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
					)
				) {
					chessRef.current.load(chessRef.current.fen());
					setBoard(chessRef.current.board());
					setSelectedPiece(null);
					setValidMove([]);
					setTotalMove((prev) => prev + 1);
					if (chessRef.current.turn() === "w") {
						if (chessRef.current.inCheck()) {
							setKingSquare(
								chessRef.current.findPiece({ type: "k", color: "w" })
							);
						} else {
							setKingSquare(null);
						}
					} else {
						if (chessRef.current.inCheck()) {
							setKingSquare(
								chessRef.current.findPiece({ type: "k", color: "b" })
							);
						} else {
							setKingSquare(null);
						}
					}
				}
			})
			.catch((error) => {
				console.log(error);
			});

	};

	const handleMove = (square: Square) => {
		//Check whether the the game is started or not
		if (!gameStarted) return;
		// Check whether the game is over or not
		if (isCheckMate) return;

		// If user want to select other piece so first he will select the selected piece to reselect the other piece

		if (square === selectedPiece) {
			setSelectedPiece(null);
			setValidMove(null);
			return;
		}

		// First of all the selected piece will be empty when the user click on piece the first selection is done by user which should be of selecting pieces only means you cannnot select random square box so if you have selected the random box then it will show error.

		// Then if the user had selected piece then the board will re render according to the moves he can play. This time the arrgument be the box user wants to places the piece.

		// Now here to play a single move user have to click 2 times first to select the piece and then to select the box. First time the selectedPiece will be empty so will update that and for the second time if it is valid square we will update the board and empty the selectedPiece as well as validMoves state variable.

		if (selectedPiece) {
			// to get the piece which is already present means the one of the player is attacking the other's piece so to get the present piece

			const piece = chessRef.current.get(selectedPiece);
			if (!piece) return;

			// Prevent moving opponent’s piece or out of turn
			if (
				piece.color !== playerColor ||
				chessRef.current.turn() !== playerColor
			) {
				showToast("Not your Turn", "warning", isDark);
				console.log("⛔ Not your turn!");
				return;
			}

			const capture = chessRef.current.get(square);
			if (capture && validMove?.includes(square)) {
				if (capture.color === "b") {
					setWhiteCaptured([...(whiteCaptured ?? []), capture]);
				} else {
					setBlackCaptured([...(blackCaptured ?? []), capture]);
				}
			}

			const moveResult = chessRef.current.move({
				from: selectedPiece,
				to: square,
			});

			if (moveResult) {
				if (location.state.mode === "ai") {
					chessRef.current.load(chessRef.current.fen());
					setBoard(chessRef.current.board());
					setSelectedPiece(null);
					setValidMove([]);
					setTotalMove((prev) => prev + 1);
					if (chessRef.current.turn() === "w") {
						if (chessRef.current.inCheck()) {
							setKingSquare(
								chessRef.current.findPiece({ type: "k", color: "w" })
							);
						} else {
							setKingSquare(null);
						}
					} else {
						if (chessRef.current.inCheck()) {
							setKingSquare(
								chessRef.current.findPiece({ type: "k", color: "b" })
							);
						} else {
							setKingSquare(null);
						}
					}
					getAImove();
				}
				console.log("send to ws");
				socketRef.current?.send(
					JSON.stringify({
						type: "move",
						roomId: roomId,
						from: selectedPiece,
						to: square,
						piece: piece,
						gameId
					})
				);
			}

			setSelectedPiece(null);
			setValidMove([]);
		} else {
			const piece = chessRef.current.get(square);
			if (!piece || piece.color !== playerColor) return;

			if (chessRef.current.turn() !== playerColor) {
				showToast("Not your Turn", "warning", isDark);
				console.log("⛔ Not your turn!");
				return;
			}

			const moves = chessRef.current.moves({ square, verbose: true });
			if (moves.length > 0) {
				setSelectedPiece(square);
				setValidMove(moves.map((m) => m.to));
			}

			if (!chessRef.current.inCheck()) setKingSquare(null);
		}
	};

	return (
		<>
			<div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-4xl select-none">
				{(playerColor === "w" ? board : [...board].reverse()).map(
					(row, rowIndex) =>
						(playerColor === "w" ? row : [...row].reverse()).map(
							(obj, colIndex) => {
								const actualRowIndex =
									playerColor === "w" ? rowIndex : 7 - rowIndex;
								const actualColIndex =
									playerColor === "w" ? colIndex : 7 - colIndex;
								const selectedSquare = getSquare(
									actualColIndex,
									actualRowIndex
								);
								// For coloring the box alternating box will be white and black
								const isLight = (actualRowIndex + actualColIndex) % 2 === 0;
								// To get the box value like a1,e4 etc..
								const isSelected = selectedSquare === selectedPiece;
								// to show the border over selected peices
								const isValid = validMove?.includes(selectedSquare);
								// set The canAttack array
								const isUnderAttack = canAttack?.includes(selectedSquare);
								const pieceHighlight =
									isSelected && kingSquare?.[0] === selectedSquare
										? "shadow-[inset_0_0_0_3px_rgba(59,130,246,1),inset_0_0_0_3px_rgba(239,68,68,1)]"
										: isSelected
											? "shadow-[inset_0_0_0_3px_rgba(59,130,246,1)]"
											: kingSquare?.[0] === selectedSquare
												? "shadow-[inset_0_0_0_3px_rgba(239,68,68,1)]"
												: null;

								return (
									<div
										key={actualRowIndex + actualColIndex}
										onClick={() => {
											console.log("Move");
											handleMove(selectedSquare);
										}}
										className={`relative flex w-full h-full items-center justify-center cursor-pointer 
								${isLight ? `${lightSquare}` : `${darkSquare}`} 
								${pieceHighlight}`}
									>
										<span className="text-5xl">
											{obj ? getPieces(obj.type, obj.color) : null}
										</span>
										{isValid && (
											<div
												className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
									${
										isUnderAttack
											? "w-full h-full shadow-[inset_0_0_0_3px_rgba(239,68,68,1)]"
											: `w-3 h-3 rounded-full ${suggestion} opacity-80`
									}`}
											/>
										)}
									</div>
								);
							}
						)
				)}
			</div>
			{/* Game Finding Modal */}
			{isSearchingGame && (
				<div
					className={`fixed inset-0 ${
						isDark ? "bg-black/50" : "bg-white/70"
					} flex items-center justify-center z-50 select-none`}
				>
					<div
						className={`${card} rounded-xl p-8 ${cardBorder} border max-w-md w-full mx-4`}
					>
						<div className="text-center">
							<div
								className={`animate-spin rounded-full h-16 w-16 border-4 ${text} ${primaryBg} border-t-transparent mx-auto mb-4`}
							></div>
							<h3 className={`text-xl font-bold mb-2 ${text}`}>
								Finding Opponent...
							</h3>
							<p className={`mb-6 ${mutedText}`}>
								Please wait while we match you with a player
							</p>
							<button
								onClick={() => {
									setIsSearchingGame(false);
									window.location.href = "/dashboard";
								}}
								className={`${secondary} ${secondaryText} hover:opacity-80 px-6 py-2 rounded-lg cursor-pointer transition-all transform hover:scale-110`}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{isCheckMate && (
				<div
					className={`fixed inset-0 ${
						isDark ? "bg-black/50" : "bg-white/70"
					} flex items-center justify-center z-50 select-none`}
				>
					<div
						className={`${card} rounded-xl p-5 ${cardBorder} border max-w-md w-full mx-4`}
					>
						<div className="text-center">
							<h3 className={`text-3xl font-bold mb-2 ${text}`}>Game Over!</h3>
							<p className={`text-xl font-semibold mt-5 ${mutedText}`}>
								{gameResult?.reason === "checkmate"
									? "Checkmate!"
									: gameResult?.reason}
							</p>
							{gameResult?.winner && (
								<p className={`${mutedText} text-xl mb-5 mt-2 font-bold`}>
									{gameResult.winner.toUpperCase()} WON BY{" "}
									{gameResult.reason.toUpperCase()}{" "}
								</p>
							)}
							<div className="flex justify-around items-center">
								<button
									onClick={() => handleStartNewGame()}
									className={`hover:opacity-80 px-6 py-2 rounded-lg transition-colors cursor-pointer ${primaryBg} ${primaryFg} transition-all transform hover:scale-110`}
								>
									Play again
								</button>

								<button
									onClick={() => {
										window.location.href = "/dashboard";
									}}
									className={`${secondary} ${secondaryText} hover:opacity-80 px-6 py-2 rounded-lg cursor-pointer transition-all transform hover:scale-110`}
								>
									Home
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{isWsError && (
				<div
					className={`fixed inset-0 ${isDark ? "bg-black/50" : "bg-white/70"
						} flex items-center justify-center z-50 select-none`}
				>
					<div
						className={`${isDark ? "bg-black/70" : "bg-white/70"} rounded-xl p-5 ${cardBorder} border max-w-md w-full mx-4`}
					>
						<div className="text-center">
							<h3 className={`text-3xl font-bold mb-2 text-[#DC2626]`}>Error</h3>
							<p className={`text-xl font-semibold mt-5 text-[#b90101] mb-10`}>
								{isWsError}
							</p>

							<div className="flex justify-around items-center">
								<button
									onClick={() => handleStartNewGame()}
									className={`hover:opacity-80 px-6 py-2 rounded-lg cursor-pointer ${secondary} ${primaryFg} transition-all transform hover:scale-110`}
								>
									Play again
								</button>

								<button
									onClick={() => {
										window.location.href = "/dashboard";
									}}
									className={`${secondary} ${secondaryText} hover:opacity-80 px-6 py-2 rounded-lg cursor-pointer transition-all transform hover:scale-110`}
								>
									Home
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

function getPieces(type: string, color: string) {
	const pieces: Record<string, [string, string]> = {
		p: ["♙", "♟"],
		r: ["♖", "♜"],
		n: ["♘", "♞"],
		b: ["♗", "♝"],
		q: ["♕", "♛"],
		k: ["♔", "♚"],
	};
	return color === "w" ? pieces[type][0] : pieces[type][1];
}

const getSquare = (col: number, row: number) => {
	const dict: Record<number, string> = {
		0: "a",
		1: "b",
		2: "c",
		3: "d",
		4: "e",
		5: "f",
		6: "g",
		7: "h",
	};
	return `${dict[col]}${8 - row}` as Square;
};
// chess.get() to get the piece from the given square
