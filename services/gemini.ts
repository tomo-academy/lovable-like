import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_API_KEY || '';
const ai = new GoogleGenerativeAI(apiKey);

export const sendMessageToGemini = async (prompt: string): Promise<string> => {
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: "You are Lovable, a helpful AI coding assistant. You are concise, friendly, and expert in React and web development. Answer requests as if you are about to build them.",
    });
    
    return response.response.text() || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};
