import { groq_api_key } from "../config";

export const getBestMove = async (fen: string) => {
 const prompt = `You are a chess engine. Given this FEN: "${fen}", return the best next move in UCI format like e2e4. Only respond with the move.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${groq_api_key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    })
  });

  const json = await res.json();
  const move = json.choices?.[0]?.message?.content?.trim();
  return move?.split(/\s/)[0] ?? null;
};
