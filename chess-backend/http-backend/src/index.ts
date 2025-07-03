import express from "express";
import http from "http";
import { gameRoutes } from "./routes/gameRoutes";
import cors from "cors";
const app = express();

const PORT = 8080;

app.use(
	cors({
		origin: "http://localhost:5173", // Replace with your frontend URL
		credentials: true,
	})
);

app.use(express.json());

app.use("/game", gameRoutes);

app.listen(PORT, () => {
	console.log(`Http Backend listening on port ${PORT}` );
	
});
