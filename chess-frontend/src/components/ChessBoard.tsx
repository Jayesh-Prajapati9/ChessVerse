import { Chess, type Square, type Piece } from "chess.js";
import { useEffect, useRef, useState } from "react";
export const ChessBoard = () => {
	const socketRef = useRef<WebSocket | null>(null);
	const chessRef = useRef<Chess>(new Chess());
	// Using the useRef hook becoz every time the chessboard re render it will create a new ws connection therefore to eliminate this useref is better option.

	const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
	const [validMove, setValidMove] = useState<Square[] | null>([]);
	const [board, setBoard] = useState(chessRef.current.board());
	const [blackCaptured, setBlackCaptured] = useState<Piece[] | null>(null);
	const [whiteCaptured, setWhiteCaptured] = useState<Piece[] | null>(null);
	const [kingSquare, setKingSquare] = useState<Square[] | null>(null);
	const [canAttack, setCanAttack] = useState<Square[] | null>(null);
	const [roomId, setRoomId] = useState<string | null>(null);
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
	// Here this playerColor is just used once every time new game is started to show the board acc to the color
	const [isCheckMate, setIsCheckMate] = useState<boolean>(false);
	const [gameResult, setGameResult] = useState<{
		winner: string;
		reason: string;
	} | null>(null);

	useEffect(() => {
		// Here the websocket is bind for the first time and therefore all the message can be viewed and processed 
		initWebSocketConnection();
		return () => {
			socketRef.current?.close();
		};
	}, []);

	useEffect(() => {
		const attackedSquare: Square[] = [];
		validMove?.map((x) => chessRef.current.get(x) && attackedSquare.push(x));
		setCanAttack(attackedSquare);
	}, [validMove, chessRef.current]);

	const initWebSocketConnection = () => {
		// When the website mount then a new websocket connection is created
		socketRef.current = new WebSocket("ws://localhost:8000");
		socketRef.current.onopen = () => {
			console.log("🟢 Connected to WS server");
		};

		socketRef.current.onmessage = (event) => {
			const msg = JSON.parse(event.data.toString());

			if (msg.type === "game_started") {
				setRoomId(msg.roomId);
				setPlayerColor(msg.color);
				setGameStarted(true);
				chessRef.current.load(msg.fen);
				setBoard(chessRef.current.board());
				console.log(`Game started as ${msg.color}`);
			}

			if (msg.type === "move") {
				chessRef.current.load(msg.fen);
				setBoard(chessRef.current.board());
				setSelectedPiece(null);
				setValidMove([]);

				// After the move check whether any player is under the check ? If Yes then indicate the that player

				chessRef.current.turn() === "w"
					? chessRef.current.inCheck()
						? setKingSquare(
								chessRef.current.findPiece({ type: "k", color: "w" })
							)
						: setKingSquare(null)
					: chessRef.current.inCheck()
						? setKingSquare(
								chessRef.current.findPiece({ type: "k", color: "b" })
							)
						: setKingSquare(null);
			}

			if (msg.type === "game_over") {
				setIsCheckMate(true);
				setGameResult({ winner: msg.winner, reason: msg.reason });
				setGameStarted(false);
				socketRef.current?.close();
				// Clear All the states
			}
		};
	};

	const handleStartNewGame = () => {
		// After the first game is completed if the user want to start the new game
		initWebSocketConnection();
		setSelectedPiece(null);
		setValidMove([]);
		setIsCheckMate(false);
		setGameResult(null);
		setWhiteCaptured([]);
		setBlackCaptured([]);
		setKingSquare(null);
		setCanAttack([]);
		setBoard(new Chess().board());
	};

	const handleStartGame = () => {
		if (!socketRef.current) return;
		socketRef.current?.send(JSON.stringify({ type: "start_game" }));
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
				console.log("⛔ Not your turn!");
				return;
			}

			const capture = chessRef.current.get(square);
			if (capture && validMove?.includes(square)) {
				capture.color === "b"
					? setWhiteCaptured([...(whiteCaptured ?? []), capture])
					: setBlackCaptured([...(blackCaptured ?? []), capture]);
			}

			const moveResult = chessRef.current.move({
				from: selectedPiece,
				to: square,
			});

			if (moveResult) {
				socketRef.current?.send(
					JSON.stringify({
						type: "move",
						roomId,
						from: selectedPiece,
						to: square,
					})
				);
			}

			setSelectedPiece(null);
			setValidMove([]);
		} else {
			const piece = chessRef.current.get(square);
			if (!piece || piece.color !== playerColor) return;

			if (chessRef.current.turn() !== playerColor) {
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
		<div>
			{isCheckMate && (
				<div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
					<p className="text-lg font-semibold">
						♔ Game Over —{" "}
						{gameResult?.reason === "checkmate"
							? "Checkmate!"
							: gameResult?.reason}
					</p>
					{gameResult?.winner && <p>🏆 Winner: {gameResult.winner}</p>}
					<button
						onClick={handleStartNewGame}
						className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
					>
						Play Again
					</button>
				</div>
			)}
			<div className="w-[480px] h-[480px] grid grid-cols-8 grid-rows-8 border-2 border-black select-none">
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
										onClick={() => handleMove(selectedSquare)}
										className={`relative flex w-full h-full items-center justify-center cursor-pointer 
								${isLight ? "bg-white" : "bg-orange-300"} 
								${pieceHighlight}`}
									>
										<span className="text-5xl">
											{obj ? getPieces(obj.type, obj.color) : null}
										</span>
										{isValid && (
											<div
												className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
									${isUnderAttack ? "w-full h-full shadow-[inset_0_0_0_3px_rgba(239,68,68,1)]" : "w-3 h-3 rounded-full bg-green-500 opacity-80"}`}
											/>
										)}
									</div>
								);
							}
						)
				)}
			</div>

			{playerColor === "w" ? (
				<div className="text-indigo-300">
					White Capture:{" "}
					{whiteCaptured
						? whiteCaptured.map((x) => getPieces(x.type, x.color))
						: "---"}
				</div>
			) : (
				<div className="text-indigo-300">
					Black Capture:{" "}
					{blackCaptured
						? blackCaptured.map((x) => getPieces(x.type, x.color))
						: "---"}
				</div>
			)}

			<button
				className="border-2 rounded-2xl p-1 text-indigo-300 "
				onClick={handleStartGame}
			>
				Start The Game
			</button>
		</div>
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
