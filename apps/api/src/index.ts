import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes } from "./routes/userRoutes";
import { gameRoutes } from "./routes/gameRoutes";
import dotenv from "dotenv"

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL

app.use(
	cors({
		origin: FRONTEND_URL,
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user',userRoutes)
app.use('/api/v1/game',gameRoutes)

app.listen(PORT, () => {
	console.log(`Http Backend listening on port ${PORT}` );
	
});
