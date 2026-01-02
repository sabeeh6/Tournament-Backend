import OpenAI from "openai";

if (!process.env.OPEN_Router_SECRET_KEY) {
  console.warn("KEY is missing in .env");
}

export const openAi = new OpenAI({
  apiKey: process.env.OPEN_Router_SECRET_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3009" || "https://your-vercel-app.vercel.app", // optional but recommended
    "X-Title": "Tournament Scheduler API"
  }
});

