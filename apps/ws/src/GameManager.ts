import { Chess } from "chess.js";
import { WebSocket, WebSocketServer } from "ws";
import { getUserDetails } from "@repo/db";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

type GameClient = {
	socket: WebSocket;
	id: string;
	mode: string;
	username: string;
	userId: string;
};

const users = new Map<number, {
	whitePlayer: {
		id: string;
		moves: string[];
	};
	blackPlayer: {
		id: string;
		moves: string[];
	};
}>();

const games = new Map<
	string,
	{
		chess: Chess;
		players: [WebSocket, WebSocket];
		timers: {
			white: number;
			black: number;
			intervalId: NodeJS.Timeout | null;
			currentTurn: "w" | "b";
		} | null;
	}
>();

const waitingPlayers: Record<string, GameClient | null> = {
	blitz: null,
	rapid: null,
	bullet: null,
	normal: null,
};

const BACKEND_URL = process.env.BACKEND_URL || "";

export class GameManager {
	clientId: string;
	chess: Chess;
	constructor() {
		this.chess = new Chess();
		this.clientId = crypto.randomUUID();
		console.log("Game Manager New client connected:", this.clientId);
	}

	setGame(roomId: string, ws: WebSocket, opponent: GameClient, mode: string) {
		console.log("Mode of game :", mode);

		if (mode === "blitz") {
			console.log("inside normal mode");
			games.set(roomId, {
				chess: this.chess,
				players: [ws, opponent.socket],
				timers: {
					white: 180,
					black: 180,
					intervalId: null,
					currentTurn: "w",
				},
			});
			this.startTimer(roomId);
		} else if (mode === "rapid") {
			console.log("inside normal mode");

			games.set(roomId, {
				chess: this.chess,
				players: [ws, opponent.socket],
				timers: {
					white: 600,
					black: 600,
					intervalId: null,
					currentTurn: "w",
				},
			});
			this.startTimer(roomId);
		} else if (mode === "bullet") {
			console.log("inside normal mode");

			games.set(roomId, {
				chess: this.chess,
				players: [ws, opponent.socket],
				timers: {
					white: 60,
					black: 60,
					intervalId: null,
					currentTurn: "w",
				},
			});
			this.startTimer(roomId);
		} else if (mode === "normal") {
			console.log("inside normal mode");

			games.set(roomId, {
				chess: this.chess,
				players: [ws, opponent.socket],
				timers: null,
			});
		}
	}

	async startGame(ws: WebSocket, mode: string, userId: string) {
		const username = await getUsername(userId);
		console.log(`🎮 ${this.clientId} wants to start a game`);
		const client: GameClient = {
			socket: ws,
			id: this.clientId,
			mode: mode,
			username,
			userId
		};
		tryMatchPlayers(client, mode, this);
	}

	async move(wss: WebSocketServer, ws: WebSocket, msg: any) {
		console.log("in move ");

		const { roomId, from, to, gameId } = msg;

		console.log("RoomId", roomId);

		const game = games.get(roomId);
		console.log(game);

		if (!game) return;
		console.log("Move init in ws");

		const move = game.chess.move({ from, to });
		if (!move) return;

		const user = users.get(gameId);
		if (!user) {
			console.error("Error whie finding the game from gameId..");
			return;
		}
		move.color === 'w' ? user.whitePlayer.moves.push(move.lan) : user.blackPlayer.moves.push(move.lan);

		// Broadcast move to all players
		game.players.forEach((client) => {
			if (client.readyState === ws.OPEN) {
				client.send(
					JSON.stringify({
						type: "move",
						from,
						to,
						board: game.chess.board(),
						fen: game.chess.fen(),
						turn: game.chess.turn(),
					})
				);
				console.log("Send to client");
			}
		});

		// Switch timer to next player
		game.timers ? (game.timers.currentTurn = game.chess.turn()) : null;

		// Handle game over
		if (game.chess.isGameOver()) {
			const reason = this.getGameOverReason(game.chess);
			const winner =
				reason === "checkmate"
					? game.chess.turn() === "w"
						? "black"
						: "white"
					: null;
			
			const user = users.get(gameId);

			if (!user) {
				console.error("Error whie finding the game from gameId..");
				return;
			}
			const winnerId = winner ? winner === "white" ? user?.whitePlayer.id : user?.blackPlayer.id : null;

			const response = await updateGame(gameId, user.blackPlayer.moves, user.whitePlayer.moves, game.chess.fen(), winnerId, roomId)
			
			if (!response.success || !response) {
				sendError(roomId);
				console.error("Game not updated...");
				return;
			}

			clearInterval(game.timers?.intervalId!);

			game.players.forEach((client) => {
				if (client.readyState === ws.OPEN) {
					client.send(
						JSON.stringify({
							type: "game_over",
							reason,
							winner,
							fen: game.chess.fen(),
						})
					);
					client.close(1000, "Game Over");
				}
			});

			games.delete(roomId);
			this.chess.reset();
			console.log("🏁 Game Over by", reason);
		}
	}

	gameover(wss: WebSocketServer, ws: WebSocket, msg: any) {
		const { roomId, reason, winner } = msg;
		const game = games.get(roomId);
		if (!game) return;

		game.players.forEach((client) => {
			if (client.readyState === ws.OPEN) {
				client.send(
					JSON.stringify({
						type: "game_over",
						reason,
						winner,
						fen: game.chess.fen(),
					})
				);
				client.close(1000, "Game Over");
			}
		});
	}

	startTimer(roomId: string) {
		const game = games.get(roomId);
		if (!game) return;
		if (!game?.timers) return;

		game.timers.intervalId = setInterval(() => {
			if (!game?.timers) return;
			const turn = game.timers?.currentTurn;

			turn === "w" ? game.timers.white-- : game.timers.black--;

			const formatTime = (seconds: number) => {
				const min = Math.floor(seconds / 60)
					.toString()
					.padStart(2, "0");
				const sec = (seconds % 60).toString().padStart(2, "0");
				return `${min}:${sec}`;
			};

			// Broadcast timer update
			game.players.forEach((socket) => {
				if (socket.readyState === socket.OPEN) {
					if (!game.timers) return;
					socket.send(
						JSON.stringify({
							type: "timer_update",
							white: formatTime(game.timers.white),
							black: formatTime(game.timers.black),
						})
					);
				}
			});

			// Handle timeout
			if (game.timers.white <= 0 || game.timers.black <= 0) {
				const winner = game.timers.white <= 0 ? "black" : "white";

				clearInterval(game.timers.intervalId!);

				game.players.forEach((client) => {
					if (client.readyState === client.OPEN) {
						client.send(
							JSON.stringify({
								type: "game_over",
								reason: "timeout",
								winner,
							})
						);
						client.close(1000, "Game Over");
					}
				});

				games.delete(roomId);
				console.log("⏰ Game ended by timeout");
			}
		}, 1000);
	}

	close() {
		console.log(`Client disconnected: ${this.clientId}`);
		for (const mode in waitingPlayers) {
			if (waitingPlayers[mode]?.id === this.clientId) {
				waitingPlayers[mode] = null;
				console.log(`❌ Removed disconnected client from ${mode} queue`);
			}
		}
	}

	getGameOverReason(chess: Chess) {
		if (chess.isCheckmate()) return "checkmate";
		if (chess.isDraw()) return "draw";
		if (chess.isStalemate()) return "stalemate";
		if (chess.isThreefoldRepetition()) return "threefold repetition";
		return "unknown";
	}
} // class completed

const createGame = async (clientId: string, opponentId: string, mode: string, fen: string, roomId:string) => {
	try {
		const response = await axios.post(`${BACKEND_URL}/game/create`, {
			user1: clientId,
			user2: opponentId,
			mode,
			fen
		});
		if (response.data.status) {
			console.log("Game Create");
			return {
				status: true,
				gameId: response.data.gameId,
				message: response.data.message,
			}
		} else {
			console.error("Error while creating the game");
			return {
				status: false,
				message: response.data.message
			}
		}
	} catch (error) {
		sendError(roomId);
		console.error("Error while creating game...");
		
	}
}

const updateGame = async (gameId: number, blackMoves: string[], whiteMoves: string[], fen: string, winnerId: string | null, roomId:string) => {
	try {
		const response = await axios.patch	(`${BACKEND_URL}/game/update`, {
			gameId,
			blackMoves,
			whiteMoves,
			winnerId,
			fen
		})
		return response.data;	
	} catch (error) {
		sendError(roomId);
		console.error("Error while updating the game...",error);
	}
}

const tryMatchPlayers = async (
	client: GameClient,
	mode: string,
	manager: GameManager
) => {
	if (waitingPlayers[mode] && waitingPlayers[mode].id !== client.id) {
		const opponent = waitingPlayers[mode];
		waitingPlayers[mode] = null;

		const roomId = crypto.randomUUID();
		manager.setGame(roomId, client.socket, opponent, mode);

		const gameState = {
			type: "game_started",
			roomId,
			board: manager.chess.board(),
			fen: manager.chess.fen(),
		};
		console.log(client.username);
		console.log(opponent.username);
		
		const response = await createGame(
			client.userId,
			opponent.userId,
			client.mode || opponent.mode,
			gameState.fen,
			roomId
		);
		if (!response || !response.status) {
			sendError(roomId);
			console.error("Error while creating the game");
			return;
		}

		opponent.socket.send(
			JSON.stringify({ ...gameState, color: "w", username: client.username, gameId: response.gameId })
		);
		client.socket.send(
			JSON.stringify({ ...gameState, color: "b", username: opponent.username, gameId: response.gameId })
		);

		users.set(response.gameId, { whitePlayer: { id: client.userId, moves: [] }, blackPlayer: { id: opponent.userId, moves: [] } });
		console.log(`✅ GAME STARTED: ${client.id} vs ${opponent.id}`);
	} else {
		waitingPlayers[mode] = client;
		console.log(`${client.id} is waiting for an opponent for ${mode} game`);
	}
};

const getUsername = async (userId: string) => {
	const response = await getUserDetails(userId, null, null);
	if (response.success) {
		return response.data.username;
	} else {
		return "--";
	}
};

const sendError = (roomId: string) => {
	const game = games.get(roomId);
	if (!game) {
		console.error("Error not to client..");
		return;
	}
	game.players.forEach((x) => {
		if (x.readyState === WebSocket.OPEN) {
			x.send(
				JSON.stringify({
					type: "error",
					msg:"Error in connection or websockets...."
				})
			)
		}
	})
}