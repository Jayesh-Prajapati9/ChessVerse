import { Chess } from "chess.js";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const gemini_api_key = process.env.gemini_api_key;
const groq_api_key = process.env.groq_api_key;

// export const getBestMove = async (fen: string) => {
// 	const chess = new Chess(fen);
//   const legalMoves = chess.moves();
//   console.log(legalMoves);

// 	if (legalMoves.length === 0) return null;

// 	const prompt = `You are a chess grandmaster. Given this FEN position: "${fen}", and these legal moves: ${legalMoves.join(
// 		", "
// 	)}, choose the best move (only one, in SAN format). Only reply with the move.`;

// 	const groq = new Groq({ apiKey: groq_api_key });

// 	const completion = await groq.chat.completions.create({
// 		messages: [
// 			{
// 				role: "user",
// 				content: prompt,
// 			},
// 		],
// 		model: "llama-3.3-70b-versatile",
// 	});
// 	let bestMove = completion.choices[0].message.content;
// 	console.log(bestMove);

//   if (!bestMove)
//     console.log("Failed to get the best move from groq");
// 		bestMove =  legalMoves[Math.floor(Math.random() * legalMoves.length)];

// 	return bestMove;
// };

export const getBestMove = async (fen: string) => {
	console.log(gemini_api_key);
	
	const chess = new Chess(fen);
	const legalMoves = chess.moves();

	const prompt = `
	You are a chess engine. Given this position (FEN): "${fen}"
	And legal moves: ${legalMoves.join(", ")}
	Reply with the best move only. Use SAN (e.g., Nf3, d4) or UCI (e.g., e2e4) format. No explanation Send in single line.
`;

	// The client gets the API key from the environment variable `GEMINI_API_KEY`.
	const ai = new GoogleGenAI({ apiKey: gemini_api_key });

	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash-lite",
		contents: prompt,
	});
	console.log(response.text?.trim());
	return response.text?.trim();
};
