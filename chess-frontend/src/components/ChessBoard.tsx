import { Chess, type Square, type Piece } from "chess.js";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const chess = new Chess();
const socket = io("http://localhost:8080");

export const ChessBoard = () => {
	const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
	const [validMove, setValidMove] = useState<Square[] | null>([]);
	const [board, setBoard] = useState(chess.board());
	const [blackCaptured, setBlackCaptured] = useState<Piece[] | null>(null);
	const [whiteCaptured, setWhiteCaptured] = useState<Piece[] | null>(null);
	const [kingSquare, setKingSquare] = useState<Square[] | null>(null);
	const [canAttack, setCanAttack] = useState<Square[] | null>(null);
	const [playerTurn, setPlayerTurn] = useState<"w" | "b">("w");
	const [roomId, setRoomId] = useState(null);

	socket.emit("start_game");
	useEffect(() => {

		socket.on("game_started", ({ roomId, color, board }) => {
			setRoomId(roomId);
			setPlayerTurn(color);
			setBoard(board);
			console.log(`Game started as ${color}`);
		});

		socket.on("move", ({ from, to, board: newBoard }) => {
			setBoard(newBoard);
			setSelectedPiece(null);
			setValidMove([]);
		});

		console.log("sending ws request ");
		
	}, []);

	useEffect(() => {
		const attackedSquare: Square[] = [];

		validMove?.map((x) => {
			chess.get(x) ? attackedSquare.push(x) : null;
		});

		setCanAttack(attackedSquare);
	}, [validMove, chess]);

	const handleMove = (square: Square) => {
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
			const capture = chess.get(square);
			if (capture) {
				if (capture?.color === "b" && validMove?.includes(square)) {
					setWhiteCaptured([...(whiteCaptured ?? []), capture]);
				} else if (capture?.color === "w" && validMove?.includes(square)) {
					setBlackCaptured([...(blackCaptured ?? []), capture]);
				}
			}

			const moveResult = chess.move({ from: selectedPiece, to: square });
			if (moveResult) {
				socket.emit("move", { roomId, from: selectedPiece, to: square });
				chess.undo();
				// setBoard(chess.board());
			}

			setSelectedPiece(null);
			setValidMove([]);

			// const isCheck = chess.inCheck();
			// if (isCheck) {
			// 	// Highlight the King
			// 	setKingSquare(chess.findPiece({ type: "k", color: chess.turn() }));
			// 	console.log("You are under Check");
			// }

			chess.inCheck()
				? setKingSquare(chess.findPiece({ type: "k", color: chess.turn() }))
				: setKingSquare(null);
		} else {
			const moves = chess.moves({ square, verbose: true });

			if (moves.length > 0) {
				setSelectedPiece(square);
				setValidMove(moves.map((m) => m.to));
			} else {
				if (chess.turn() !== chess.get(square)?.color) {
					console.log("Not your Turn");
				}
			}

			// Check player moves his king or block the check so set the king square to null
			console.log(chess.inCheck());

			chess.inCheck() ? null : setKingSquare(null);
		}
	};

	return (
		<div>
			<div className="w-[480px] h-[480px] grid grid-cols-8 grid-rows-8 border-2 border-black select-none">
				{(playerTurn === "w" ? board : [...board].reverse()).map(
					(row, rowIndex) =>
						(playerTurn === "w" ? row : [...row].reverse()).map(
							(obj, colIndex) => {
								const actualRowIndex =
									playerTurn === "w" ? rowIndex : 7 - rowIndex;
								const actualColIndex =
									playerTurn === "w" ? colIndex : 7 - colIndex;

								// For coloring the box alternating box will be white and black
								const isLight = (actualRowIndex + actualColIndex) % 2 === 0;
								// To get the box value like a1,e4 etc..
								const selectedSquare = getSquare(
									actualColIndex,
									actualRowIndex
								);
								// to show the border over selected peices
								const isSelected = selectedSquare === selectedPiece;
								const isValid = validMove?.includes(selectedSquare);
								// set The canAttack array
								const isUnderAttack = canAttack?.includes(selectedSquare);

								const pieceHighlight =
									isSelected &&
									kingSquare?.[0] === getSquare(actualColIndex, actualRowIndex)
										? "shadow-[inset_0_0_0_3px_rgba(59,130,246,1),inset_0_0_0_3px_rgba(239,68,68,1)]"
										: isSelected
											? "shadow-[inset_0_0_0_3px_rgba(59,130,246,1)]"
											: kingSquare?.[0] ===
												  getSquare(actualColIndex, actualRowIndex)
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
      									${
													isUnderAttack
														? "w-full h-full shadow-[inset_0_0_0_3px_rgba(239,68,68,1)]"
														: "w-3 h-3 rounded-full bg-green-500 opacity-80"
												}
    `}
											/>
										)}
									</div>
								);
							}
						)
				)}
			</div>
			<div>
				Black Capture :{" "}
				{blackCaptured
					? blackCaptured.map((x) => getPieces(x.type, x.color))
					: "---"}
			</div>
			<div>
				White Capture :{" "}
				{whiteCaptured
					? whiteCaptured.map((x) => getPieces(x.type, x.color))
					: "---"}
			</div>
			{/* <p>{JSON.stringify(board)}</p> */}
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
