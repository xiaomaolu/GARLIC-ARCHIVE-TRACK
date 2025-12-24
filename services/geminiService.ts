import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AiParseResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are a utilitarian finance parser. 
Extract the following fields from the user's input (text or audio transcript):
1. amount (number, positive value)
2. currency (string, default to 'CNY' if inferred as Chinese context, 'USD' otherwise, or symbol provided)
3. category (string, keep it short, 1-2 words. Examples: 'Food', 'Transport', 'Salary', 'Freelance')
4. description (string, concise summary of the note/item)
5. date (string, ISO 8601 format YYYY-MM-DD. If "today", use current date. If "yesterday", use yesterday.)
6. type (string, strictly "INCOME" or "EXPENSE". Infer from context: e.g., "salary", "sold", "received" -> INCOME; "bought", "paid", "spent" -> EXPENSE)

If information is missing, infer reasonable defaults based on context.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    amount: { type: Type.NUMBER },
    currency: { type: Type.STRING },
    category: { type: Type.STRING },
    description: { type: Type.STRING },
    date: { type: Type.STRING },
    type: { type: Type.STRING, enum: ["INCOME", "EXPENSE"] },
  },
  required: ["amount", "category", "date", "type"],
};

export const parseExpenseText = async (text: string): Promise<AiParseResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse this transaction: "${text}". Today is ${new Date().toISOString().split('T')[0]}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as AiParseResponse;
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    throw error;
  }
};

export const parseExpenseAudio = async (base64Audio: string, mimeType: string): Promise<AiParseResponse> => {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing");
    }
  
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Audio
                    }
                },
                {
                    text: `Listen to this audio and extract transaction details. Today is ${new Date().toISOString().split('T')[0]}`
                }
            ]
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      });
  
      const jsonText = response.text;
      if (!jsonText) throw new Error("No response from AI");
      
      return JSON.parse(jsonText) as AiParseResponse;
    } catch (error) {
      console.error("Gemini Audio Parse Error:", error);
      throw error;
    }
  };