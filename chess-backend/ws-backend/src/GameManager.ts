import { Chess } from "chess.js";
import { WebSocket, WebSocketServer } from "ws";

type GameClient = {
	socket: WebSocket;
	id: string;
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

let waitingPlayer: GameClient | null = null;

export class GameManager {
	clientId: string;
	chess: Chess;

	constructor() {
		this.chess = new Chess();
		this.clientId = crypto.randomUUID();
		console.log("Game Manager New client connected:", this.clientId);
	}

	setGame(roomId: string, ws: WebSocket, opponent: GameClient, mode: string) {
		if (mode === "blitz") {
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
			games.set(roomId, {
				chess: this.chess,
				players: [ws, opponent.socket],
				timers: null,
			});
		}
	}

	startGame(ws: WebSocket, mode: string) {
		console.log(`🎮 ${this.clientId} wants to start a game`);

		if (waitingPlayer && waitingPlayer.id !== this.clientId) {
			const opponent = waitingPlayer;
			waitingPlayer = null;

			const roomId = crypto.randomUUID();

			this.setGame(roomId, ws, opponent, mode);

			// Notify both players
			opponent.socket.send(
				JSON.stringify({
					type: "game_started",
					roomId,
					color: "w",
					board: this.chess.board(),
					fen: this.chess.fen(),
				})
			);

			ws.send(
				JSON.stringify({
					type: "game_started",
					roomId,
					color: "b",
					board: this.chess.board(),
					fen: this.chess.fen(),
				})
			);

			console.log(`✅ GAME STARTED: ${this.clientId} vs ${opponent.id}`);
		} else {
			waitingPlayer = { socket: ws, id: this.clientId };
			console.log(`${this.clientId} is waiting for an opponent`);
		}
	}

	move(wss: WebSocketServer, ws: WebSocket, msg: any) {
		const { roomId, from, to, piece } = msg;
		const game = games.get(roomId);
		if (!game) return;

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

			// Broadcast timer update
			game.players.forEach((socket) => {
				if (socket.readyState === socket.OPEN) {
					socket.send(
						JSON.stringify({
							type: "timer_update",
							white: game.timers?.white,
							black: game.timers?.black,
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
		waitingPlayer = null;
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
