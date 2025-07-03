import express from "express";
import cors from "cors";
import { userRoutes } from "./routes/userRoutes";
import { gameRoutes } from "./routes/gameRoutes";
const app = express();

const PORT = 8080;

app.use(
	cors({
		origin: "http://localhost:5173", // Replace with your frontend URL
		credentials: true,
	})
);

app.use(express.json());

app.use('/api/v1/user',userRoutes)
app.use('/api/v1/game',gameRoutes)

app.listen(PORT, () => {
	console.log(`Http Backend listening on port ${PORT}` );
	
});
