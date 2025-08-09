import { Chess } from "chess.js";
import { WebSocket, WebSocketServer } from "ws";

type GameClient = {
	socket: WebSocket;
	id: string;
	mode: string;
};

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

	startGame(ws: WebSocket, mode: string) {
		console.log(`🎮 ${this.clientId} wants to start a game`);
		const client: GameClient = { socket: ws, id: this.clientId, mode: mode };
		tryMatchPlayers(client, mode, this);
	}

	move(wss: WebSocketServer, ws: WebSocket, msg: any) {
		console.log("in move ");

		const { roomId, from, to, piece } = msg;
		console.log("RoomId", roomId);

		const game = games.get(roomId);
		console.log(game);

		if (!game) return;
		console.log("Move init in ws");

		const move = game.chess.move({ from, to });
		if (!move) return;

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
		if (chess.isInsufficientMaterial()) return "insufficient material";
		return "unknown";
	}
}

const tryMatchPlayers = (
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

		opponent.socket.send(JSON.stringify({ ...gameState, color: "w" }));
		client.socket.send(JSON.stringify({ ...gameState, color: "b" }));

		console.log(`✅ GAME STARTED: ${client.id} vs ${opponent.id}`);
	} else {
		waitingPlayers[mode] = client;
		console.log(`${client.id} is waiting for an opponent for ${mode} game`);
	}
};
