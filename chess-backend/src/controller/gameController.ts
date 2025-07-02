import { Chess } from "chess.js";

export const gameLogic = () => {
	// const games = new Map();
	// const waitingPlayers: string[] = []; // queue of socket IDs

	// const createRoomId = () => {
	// 	return Math.floor(Math.random() * 10000).toString();
	// };

	// io.on("connection", (socket) => {
	// 	console.log(`Connected Socket with socket Id ${socket.id}`);

	// 	socket.on("start_game", async () => {
	// 		console.log(`${socket.id} started the game`);
	// 		if (waitingPlayers.length > 0) {
	// 			const opponentSocketId = waitingPlayers.pop();
	// 			if (!opponentSocketId) return;

	// 			const roomId = createRoomId();

	// 			const game = new Chess();

	// 			games.set(roomId, game);
	// 			socket.join(roomId);

	// 			const allSockets = await io.fetchSockets();
	// 			const opponentSocket = allSockets.filter(
	// 				(x) => x.id === opponentSocketId
	// 			)[0];

	// 			opponentSocket.join(roomId);

	// 			io.to(opponentSocketId).emit("game_started", {
	// 				roomId,
	// 				color: "w",
	// 				board: game.board(),
	// 				turn: game.turn(),
	// 			});

	// 			io.to(socket.id).emit("game_started", {
	// 				roomId,
	// 				color: "b",
	// 				board: game.board(),
	// 				turn: game.turn(),
	// 			});
	// 			console.log(`Match started: ${opponentSocketId} vs ${socket.id}`);
	// 		} else {
	// 			waitingPlayers.push(socket.id);
	// 			console.log(`${socket.id} is waiting for an opponent`);
	// 		}
	// 	});

	// 	socket.on("move", ({ roomId, from, to }) => {
	// 		const game = games.get(roomId);
	// 		const move = game.move({ from, to });
            
    //         if (!move) return;
            
	// 		io.to(roomId).emit("move", {
	// 			from,
	// 			to,
	// 			board: game.board(),
	// 			turn: game.turn(),
	// 			game_over: game.game_over(),
	// 		});
	// 	});
	// });
};
