import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const WSS_PORT = 8000;
const wss = new WebSocketServer({ port: WSS_PORT });

wss.on("connection", (ws) => {
	const gamemanager = new GameManager();

	ws.on("message", (data) => {
		const msg = JSON.parse(data.toString());

		if (msg.type === "start_game") {
			console.log("game started");
			
			gamemanager.startGame(ws,msg.mode);
		}

		if (msg.type === "move") {
			console.log("move init");
			
			gamemanager.move(wss, ws, msg);
		}
	});

	ws.on("close", () => {
		gamemanager.close();
	});
});

console.log(`WebSocket Server is listening on port ${WSS_PORT}`);
