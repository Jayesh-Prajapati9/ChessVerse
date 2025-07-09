import { Chess } from "chess.js";
import { WebSocket, WebSocketServer } from "ws";

type GameClient = {
	socket: WebSocket;
	id: string;
};

const games = new Map<
	string,
	{ chess: Chess; players: [WebSocket, WebSocket] }
>();

let waitingPlayer: GameClient | null = null; // single waiting player

const blackMoves: string[] = [];
const whiteMoves: string[] = [];

const getGameOverReason = (chess: Chess) => {
	if (chess.isCheckmate()) return "checkmate";
	if (chess.isDraw()) return "draw";
	if (chess.isStalemate()) return "stalemate";
	if (chess.isThreefoldRepetition()) return "threefold";
	if (chess.isInsufficientMaterial()) return "insufficient";
	return "unknown";
};

export class GameManager {
	clientId: string;
	chess: Chess;

	constructor() {
		this.chess = new Chess();
		this.clientId = crypto.randomUUID();
		console.log("Game Manager New client connected:", this.clientId);
	}

	startGame(ws: WebSocket) {
		console.log(`🎮 ${this.clientId} wants to start a game`);

		if (waitingPlayer && waitingPlayer.id !== this.clientId) {
			const opponent = waitingPlayer;
			waitingPlayer = null;

			const roomId = crypto.randomUUID(); // can also use createRoomId()
			games.set(roomId, { chess: this.chess, players: [ws, opponent.socket] });

			// Send to both players
			opponent.socket.send(
				JSON.stringify({
					type: "game_started",
					roomId: roomId,
					color: "w",
					board: this.chess.board(),
					fen: this.chess.fen(),
				})
			);

			ws.send(
				JSON.stringify({
					type: "game_started",
					roomId: roomId,
					color: "b",
					board: this.chess.board(),
					fen: this.chess.fen(),
				})
			);
			console.log(`GAME STARTED BETWEEN ${this.clientId} vs ${opponent.id}`);
		} else {
			waitingPlayer = { socket: ws, id: this.clientId };
			console.log(`${this.clientId} is waiting for an opponent`);
		}
	}

	move(wss: WebSocketServer, ws: WebSocket, msg: any) {
		console.log(`Updated Move : ${msg.piece.type}${msg.to}`);

		// Broadcast to everyone for now (or implement room logic)
		const { roomId, from, to, piece } = msg;
		const game = games.get(roomId);
		if (!game) return;

		const move = game.chess.move({ from: from, to: to });

		piece.color === "w"
			? whiteMoves.push(`${piece.type}${to}`)
			: blackMoves.push(`${piece.type}${to}`);

		if (game.chess.isGameOver()) {
			console.log("Game Over");
			const reason = getGameOverReason(game.chess);
			wss.clients.forEach((clients) => {
				if (clients.readyState === ws.OPEN) {
					clients.send(
						JSON.stringify({
							type: "game_over",
							reason: reason,
							fen: game.chess.fen(),
							winner:
								reason === "checkmate"
									? game.chess.turn() === "w"
										? "black"
										: "white"
									: null,
						})
					);
					games.delete(roomId);
				}
				this.chess.reset();
				clients.close(1000, "Game Over");
			});
			console.log(whiteMoves);
			console.log(blackMoves);
		}

		if (!move) return;

		wss.clients.forEach((client) => {
			if (client.readyState === ws.OPEN) {
				client.send(
					JSON.stringify({
						type: "move",
						from: msg.from,
						to: msg.to,
						board: game.chess.board(),
						fen: game.chess.fen(),
						turn: game.chess.turn(),
					})
				);
			}
		});
	}

	close() {
		console.log(`Client disconnected : ${this.clientId}`);
		waitingPlayer = null;
	}
}

// import { Chess } from "chess.js";
// import { WebSocket, WebSocketServer } from "ws";

// type GameClient = {
// 	socket: WebSocket;
// 	id: string;
// };

// const games = new Map<
// 	string,
// 	{
// 		chess: Chess;
// 		players: [WebSocket, WebSocket];
// 		timers: {
// 			white: number;
// 			black: number;
// 			intervalId: NodeJS.Timeout | null;
// 			currentTurn: "w" | "b";
// 		};
// 	}
// >();

// let waitingPlayer: GameClient | null = null;

// export class GameManager {
// 	clientId: string;
// 	chess: Chess;

// 	constructor() {
// 		this.chess = new Chess();
// 		this.clientId = crypto.randomUUID();
// 		console.log("Game Manager New client connected:", this.clientId);
// 	}

// 	startGame(ws: WebSocket) {
// 		console.log(`🎮 ${this.clientId} wants to start a game`);

// 		if (waitingPlayer && waitingPlayer.id !== this.clientId) {
// 			const opponent = waitingPlayer;
// 			waitingPlayer = null;

// 			const roomId = crypto.randomUUID();

// 			games.set(roomId, {
// 				chess: this.chess,
// 				players: [ws, opponent.socket],
// 				timers: {
// 					white: 180,
// 					black: 180,
// 					intervalId: null,
// 					currentTurn: "w",
// 				},
// 			});

// 			this.startTimer(roomId);

// 			// Notify both players
// 			opponent.socket.send(
// 				JSON.stringify({
// 					type: "game_started",
// 					roomId,
// 					color: "w",
// 					board: this.chess.board(),
// 					fen: this.chess.fen(),
// 				})
// 			);

// 			ws.send(
// 				JSON.stringify({
// 					type: "game_started",
// 					roomId,
// 					color: "b",
// 					board: this.chess.board(),
// 					fen: this.chess.fen(),
// 				})
// 			);

// 			console.log(`✅ GAME STARTED: ${this.clientId} vs ${opponent.id}`);
// 		} else {
// 			waitingPlayer = { socket: ws, id: this.clientId };
// 			console.log(`${this.clientId} is waiting for an opponent`);
// 		}
// 	}

// 	move(wss: WebSocketServer, ws: WebSocket, msg: any) {
// 		const { roomId, from, to, piece } = msg;
// 		const game = games.get(roomId);
// 		if (!game) return;

// 		const move = game.chess.move({ from, to });
// 		if (!move) return;

// 		// Broadcast move to all players
// 		game.players.forEach((client) => {
// 			if (client.readyState === ws.OPEN) {
// 				client.send(
// 					JSON.stringify({
// 						type: "move",
// 						from,
// 						to,
// 						board: game.chess.board(),
// 						fen: game.chess.fen(),
// 						turn: game.chess.turn(),
// 					})
// 				);
// 			}
// 		});

// 		// Switch timer to next player
// 		game.timers.currentTurn = game.chess.turn();

// 		// Handle game over
// 		if (game.chess.isGameOver()) {
// 			const reason = this.getGameOverReason(game.chess);
// 			const winner =
// 				reason === "checkmate"
// 					? game.chess.turn() === "w"
// 						? "black"
// 						: "white"
// 					: null;

// 			clearInterval(game.timers.intervalId!);

// 			game.players.forEach((client) => {
// 				if (client.readyState === ws.OPEN) {
// 					client.send(
// 						JSON.stringify({
// 							type: "game_over",
// 							reason,
// 							winner,
// 							fen: game.chess.fen(),
// 						})
// 					);
// 					client.close(1000, "Game Over");
// 				}
// 			});

// 			games.delete(roomId);
// 			this.chess.reset();
// 			console.log("🏁 Game Over by", reason);
// 		}
// 	}

// 	startTimer(roomId: string) {
// 		const game = games.get(roomId);
// 		if (!game) return;

// 		game.timers.intervalId = setInterval(() => {
// 			const turn = game.timers.currentTurn;

// 			turn === "w" ? game.timers.white-- : game.timers.black--;

// 			// Broadcast timer update
// 			game.players.forEach((socket) => {
// 				if (socket.readyState === socket.OPEN) {
// 					socket.send(
// 						JSON.stringify({
// 							type: "timer_update",
// 							white: game.timers.white,
// 							black: game.timers.black,
// 						})
// 					);
// 				}
// 			});

// 			// Handle timeout
// 			if (game.timers.white <= 0 || game.timers.black <= 0) {
// 				const winner = game.timers.white <= 0 ? "black" : "white";

// 				clearInterval(game.timers.intervalId!);

// 				game.players.forEach((client) => {
// 					if (client.readyState === client.OPEN) {
// 						client.send(
// 							JSON.stringify({
// 								type: "game_over",
// 								reason: "timeout",
// 								winner,
// 							})
// 						);
// 						client.close(1000, "Game Over");
// 					}
// 				});

// 				games.delete(roomId);
// 				console.log("⏰ Game ended by timeout");
// 			}
// 		}, 1000);
// 	}

// 	close() {
// 		console.log(`Client disconnected: ${this.clientId}`);
// 		waitingPlayer = null;
// 	}

// 	getGameOverReason(chess: Chess) {
// 		if (chess.isCheckmate()) return "checkmate";
// 		if (chess.isDraw()) return "draw";
// 		if (chess.isStalemate()) return "stalemate";
// 		if (chess.isThreefoldRepetition()) return "threefold repetition";
// 		if (chess.isInsufficientMaterial()) return "insufficient material";
// 		return "unknown";
// 	}
// }
