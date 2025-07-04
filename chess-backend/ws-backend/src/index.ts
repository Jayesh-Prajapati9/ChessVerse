import { WebSocket, WebSocketServer } from "ws";
import { Chess, Color, PieceSymbol, Square } from "chess.js";

const WSS_PORT = 8000;
const wss = new WebSocketServer({ port: WSS_PORT });

type GameClient = {
	socket: WebSocket;
	id: string;
};

const getGameOverReason = (chess: Chess) => {
	if (chess.isCheckmate()) return "checkmate";
	if (chess.isDraw()) return "draw";
	if (chess.isStalemate()) return "stalemate";
	if (chess.isThreefoldRepetition()) return "threefold";
	if (chess.isInsufficientMaterial()) return "insufficient";
	return "unknown";
};

const games = new Map<
	string,
	{ chess: Chess; players: [WebSocket, WebSocket] }
>();

let waitingPlayer: GameClient | null = null; // single waiting player

wss.on("connection", (ws) => {
	const chess = new Chess();
	const clientId = crypto.randomUUID();
	console.log("🔌 New client connected:", clientId);

	ws.on("message", (data) => {
		const msg = JSON.parse(data.toString());

		if (msg.type === "start_game") {
			console.log(`🎮 ${clientId} wants to start a game`);

			if (waitingPlayer && waitingPlayer.id !== clientId) {
				const opponent = waitingPlayer;
				waitingPlayer = null;

				const roomId = crypto.randomUUID(); // can also use createRoomId()
				games.set(roomId, { chess, players: [ws, opponent.socket] });

				// Send to both players
				opponent.socket.send(
					JSON.stringify({
						type: "game_started",
						roomId: roomId,
						color: "w",
						board: chess.board(),
						fen: chess.fen(),
					})
				);

				ws.send(
					JSON.stringify({
						type: "game_started",
						roomId: roomId,
						color: "b",
						board: chess.board(),
						fen: chess.fen(),
					})
				);
				console.log(`GAME STARTED BETWEEN ${clientId} vs ${opponent.id}`);
			} else {
				waitingPlayer = { socket: ws, id: clientId };
				console.log(`🕒 ${clientId} is waiting for an opponent`);
			}
		}

		if (msg.type === "move") {
			console.log(`Move from${msg.from} to ${msg.to}`);

			// Broadcast to everyone for now (or implement room logic)
			const { roomId, from, to } = msg;
			const game = games.get(roomId);

			if (!game) return;

			const move = game.chess.move({ from: from, to: to });

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
					clients.close(1000, "Game Over");
				});
				console.log(games);
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
							game_over: game.chess.isGameOver(),
							turn: game.chess.turn(),
						})
					);
				}
			});
		}
	});

	ws.on("close", () => {
		console.log(`❌ Client disconnected: ${clientId}`);
		waitingPlayer = null;
	});
});

console.log(`WebSocket Server is listening on port ${WSS_PORT}`);
