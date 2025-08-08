import { Chess, type Piece, type Square } from "chess.js";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "./useTheme";

export const useChessGame = () => {
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
	const [whiteTimer, setWhiteTimer] = useState<number | null>(null);
	const [blackTimer, setBlackTimer] = useState<number | null>(null);
	// Here this playerColor is just used once every time new game is started to show the board acc to the color
	const [isCheckMate, setIsCheckMate] = useState<boolean>(false);
	const [gameResult, setGameResult] = useState<{
		winner: string;
		reason: string;
	} | null>(null);
	const [mode, setMode] = useState<string | null>(null);
	const [isSearchingGame, setIsSearchingGame] = useState(true);
	const [wsConnected, setWsConnected] = useState(false);
	const location = useLocation();
	const [totalmove, setTotalMove] = useState<number>(0);
	const { isDark, setIsDark, toggleTheme } = useTheme();

	return {
		// refs
		socketRef,
		chessRef,

		// state
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
		whiteTimer,
		setWhiteTimer,
		blackTimer,
		setBlackTimer,
		isCheckMate,
		setIsCheckMate,
		gameResult,
		setGameResult,
		mode,
		setMode,
		isSearchingGame,
		setIsSearchingGame,
		wsConnected,
		setWsConnected,
		isDark,
		setIsDark,
		toggleTheme,
		location,
		totalmove,
		setTotalMove,
	};
};
