import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not set in environment variables.");
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(apiKey || "");

// Default Gemini Model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export { genAI, model };
