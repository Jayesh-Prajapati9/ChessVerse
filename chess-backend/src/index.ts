import express from "express";
import http from "http";
import { gameRoutes } from "./routes/gameRoutes";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import cors from "cors";
const app = express();
const port = 8080;
import { WebSocket, WebSocketServer } from "ws";

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const chess = new Chess();

app.use(
	cors({
		origin: "http://localhost:5173", // Replace with your frontend URL
		credentials: true,
	})
);

app.use(express.json());

app.use("/game", gameRoutes);

type GameClient = {
	socket: WebSocket;
	id: string;
};
const games = new Map<
	string,
	{ chess: Chess; players: [WebSocket, WebSocket] }
>();

let waitingPlayer: GameClient | null = null; // single waiting player

const createRoomId = () => {
	return Math.floor(Math.random() * 10000).toString();
};

wss.on("connection", (ws) => {
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
			console.log("Move Init");

			// Broadcast to everyone for now (or implement room logic)
			const { roomId, from, to } = msg;
			const game = games.get(roomId);

			if (!game) return;

			const move = game.chess.move({ from: from, to: to });

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
		if (waitingPlayer?.id === clientId) {
			waitingPlayer = null;
		}
	});
});

server.listen(port, () => {
	console.log(`✅ Server (with Socket.IO) is listening on port ${port}`);
});
